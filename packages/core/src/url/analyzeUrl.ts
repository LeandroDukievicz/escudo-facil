import { buildResult } from '../result';
import type { AnalysisResult, RiskLevel, Signal, TechnicalDetail } from '../types';
import {
  BRANDS,
  DIGIT_LOOKALIKES,
  SHORTENERS,
  SUSPICIOUS_PATH_WORDS,
  SUSPICIOUS_TLDS,
  type Brand,
} from './lists';
import { editDistance, parseLink, type ParsedLink } from './parse';

export const LINK_SUMMARIES: Record<RiskLevel, string> = {
  low: 'A análise não encontrou indícios fortes de golpe neste link. Mesmo assim, confirme se o endereço é o site oficial antes de informar dados ou pagar.',
  attention:
    'Encontramos sinais que costumam aparecer em golpes. Pode ser golpe — melhor confirmar por outro canal antes de continuar.',
  high: 'Este link tem sinais fortes de golpe. Ele pode tentar se passar por uma instituição para pegar seus dados ou seu dinheiro.',
  unknown:
    'Não conseguimos verificar este link agora. Isso não quer dizer que não há risco — apenas que não dá para confirmar.',
};

const isOfficialHost = (host: string, brand: Brand) =>
  brand.official.some((d) => host === d || host.endsWith(`.${d}`));

const deLeet = (s: string) => s.replace(/[0134578]/g, (c) => DIGIT_LOOKALIKES[c] ?? c);

/** Sinais encontrados no endereço. Exportado para reuso na análise de texto. */
export function linkSignals(link: ParsedLink): { signals: Signal[]; checked: string[] } {
  const signals: Signal[] = [];
  const checked: string[] = [];
  const add = (s: Signal) => signals.push(s);

  if (link.scheme === 'javascript' || link.scheme === 'data') {
    add({ id: 'url.script', category: 'structure', severity: 'strong', label: 'Não é um endereço de site comum: pode executar algo no seu celular' });
    return { signals, checked };
  }

  const { host, registrableDomain, mainLabel } = link;

  if (SHORTENERS.has(registrableDomain) || SHORTENERS.has(host)) {
    add({ id: 'url.shortener', category: 'shortener', severity: 'medium', label: 'Link encurtado, esconde o endereço real', excerpt: host });
  }

  if (link.isIp) {
    add({ id: 'url.ip', category: 'ip-host', severity: 'strong', label: 'Endereço é só uma sequência de números, sem nome de site', excerpt: host });
  }

  if (link.userinfo) {
    add({ id: 'url.userinfo', category: 'structure', severity: 'strong', label: 'O endereço usa um truque com "@" para disfarçar o site verdadeiro', excerpt: link.userinfo });
  }

  if (host.includes('xn--') || /[^\x00-\x7f]/.test(link.rawHost)) {
    add({ id: 'url.strange-chars', category: 'strange-chars', severity: 'strong', label: 'Usa letras diferentes que parecem letras comuns', excerpt: link.rawHost });
  }

  // Imitação de marca / erro de digitação.
  const hostTokens = host.split(/[.-]/).filter(Boolean);
  const compactHost = host.replace(/[.-]/g, '');
  let matchedOfficial: Brand | undefined;
  for (const brand of BRANDS) {
    if (isOfficialHost(host, brand)) {
      matchedOfficial ??= brand;
      continue;
    }
    const kwHit = brand.keywords.find((k) => compactHost.includes(k.replace(/-/g, '')) || host.includes(k));
    if (kwHit) {
      add({
        id: `url.lookalike.${brand.keywords[0]}`,
        category: 'lookalike',
        // Bancos e governo são o alvo nº 1 de páginas falsas: peso máximo.
        severity: brand.kind === 'banco' || brand.kind === 'governo' ? 'strong' : 'medium',
        label: `Endereço imita ${brand.name}, mas não é o site oficial`,
        excerpt: host,
      });
      continue;
    }
    const kw = brand.keywords[0]!;
    if (kw.length < 5) continue;
    const typo = [mainLabel, ...hostTokens].find((t) => {
      if (!t || t === kw) return false;
      if (deLeet(t) === kw) return true;
      return Math.abs(t.length - kw.length) <= 2 && editDistance(t, kw) <= (kw.length >= 8 ? 2 : 1);
    });
    if (typo) {
      add({
        id: `url.typo.${kw}`,
        category: 'typo',
        severity: 'strong',
        label: `Endereço parecido com ${brand.name}, com erro de digitação`,
        excerpt: typo,
      });
    }
  }

  if (matchedOfficial) {
    checked.push(`O endereço pertence a um domínio conhecido de ${matchedOfficial.name}`);
  }

  if (SUSPICIOUS_TLDS.has(link.tld)) {
    add({
      id: 'url.tld',
      category: 'suspicious-tld',
      severity: 'medium',
      label: `Termina em ".${link.tld}", final pouco comum para bancos e lojas`,
      excerpt: `.${link.tld}`,
    });
  }

  if (link.subdomains.length >= 3) {
    add({ id: 'url.subdomains', category: 'structure', severity: 'medium', label: 'Endereço com muitas partes, difícil de ler', excerpt: host });
  }

  const pathParts = link.path.split('/').filter(Boolean);
  const params = link.query ? link.query.split('&').filter(Boolean) : [];
  if (pathParts.length > 4 || params.length > 4 || link.raw.length > 120) {
    add({ id: 'url.complex', category: 'structure', severity: 'weak', label: 'Endereço muito longo ou com muitos parâmetros' });
  }

  const pathLower = `${link.path}?${link.query}`.toLowerCase();
  const pathWord = SUSPICIOUS_PATH_WORDS.find((w) => pathLower.includes(w));
  if (pathWord && !matchedOfficial) {
    add({ id: 'url.path-word', category: 'structure', severity: 'weak', label: `Pede para "${pathWord}" fora de um site oficial conhecido`, excerpt: pathWord });
  }

  if (host.split('-').length > 3) {
    add({ id: 'url.hyphens', category: 'structure', severity: 'weak', label: 'Nome do site com muitos hífens' });
  }

  if (link.scheme === 'http' && !link.schemeMissing) {
    add({ id: 'url.http', category: 'insecure', severity: 'weak', label: 'Conexão sem cadeado (http)' });
  }

  if (!signals.some((s) => s.category === 'lookalike' || s.category === 'typo' || s.category === 'strange-chars')) {
    checked.push('Endereço sem disfarces ou erros de digitação conhecidos');
  }
  if (!signals.some((s) => s.category === 'shortener')) {
    checked.push('Não é um link encurtado');
  }
  checked.push('Não está nas listas locais de risco');

  return { signals, checked };
}

export interface AnalyzeLinkOptions {
  offline?: boolean;
  now?: Date;
}

/**
 * Analisa um link SEM abri-lo — só lê o texto do endereço.
 */
export function analyzeLink(input: string, opts: AnalyzeLinkOptions = {}): AnalysisResult {
  const link = parseLink(input);
  if (!link) {
    return buildResult({
      kind: 'link',
      signals: [],
      summaries: LINK_SUMMARIES,
      inconclusive: true,
      technical: [{ label: 'Entrada', value: 'Não reconhecida como endereço (URL)' }],
      now: opts.now,
    });
  }
  const { signals, checked } = linkSignals(link);
  const technical: TechnicalDetail[] = [
    { label: 'Host', value: link.host || '—' },
    { label: 'Domínio registrável', value: link.registrableDomain || '—' },
    { label: 'TLD', value: link.tld ? `.${link.tld}` : '—' },
    { label: 'Esquema', value: link.schemeMissing ? '(ausente)' : link.scheme },
    { label: 'Subdomínios', value: String(link.subdomains.length) },
    { label: 'Regras disparadas', value: signals.map((s) => s.id).join(', ') || 'nenhuma' },
  ];
  return buildResult({
    kind: 'link',
    signals,
    checked,
    summaries: LINK_SUMMARIES,
    technical,
    offline: opts.offline,
    now: opts.now,
  });
}
