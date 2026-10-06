import { MULTI_LEVEL_SUFFIXES } from './lists';

export interface ParsedLink {
  raw: string;
  scheme: string;
  schemeMissing: boolean;
  userinfo: string;
  host: string;
  /** Host como foi digitado (antes de baixar a caixa), para achar caracteres estranhos. */
  rawHost: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  /** Ex.: "seu-banco.verifique-conta.xyz" → "verifique-conta.xyz". */
  registrableDomain: string;
  /** Rótulo principal do domínio registrável, sem sufixo ("verifique-conta"). */
  mainLabel: string;
  tld: string;
  subdomains: string[];
  isIp: boolean;
}

const SCHEME_RE = /^([a-z][a-z0-9+.-]*):/i;
const IPV4_RE = /^\d{1,3}(\.\d{1,3}){3}$/;

/**
 * Parser tolerante e sem dependências (o `URL` do React Native é incompleto).
 * Nunca faz requisição: só lê o texto do endereço.
 */
export function parseLink(input: string): ParsedLink | null {
  let raw = input.trim().replace(/^[<"'(\[]+|[>"')\]]+$/g, '');
  if (!raw || /\s/.test(raw)) {
    // Pega o primeiro trecho com cara de link dentro de um texto.
    const m = raw.match(/(?:https?:\/\/|www\.)\S+|\b[\w-]+(?:\.[\w-]+)+\/\S*/i);
    if (!m) return null;
    raw = m[0];
  }

  const schemeMatch = raw.match(SCHEME_RE);
  // "site.com:8080" não é esquema — esquemas não contêm ponto seguido de dígito.
  const looksLikePort = schemeMatch && /^\d/.test(raw.slice(schemeMatch[0].length));
  const scheme = schemeMatch && !looksLikePort ? schemeMatch[1]!.toLowerCase() : '';
  let rest = scheme ? raw.slice(scheme.length + 1) : raw;

  if (scheme && !['http', 'https'].includes(scheme)) {
    return {
      raw, scheme, schemeMissing: false, userinfo: '', host: '', rawHost: '', port: '',
      path: rest, query: '', fragment: '', registrableDomain: '', mainLabel: '', tld: '',
      subdomains: [], isIp: false,
    };
  }

  // HTTP(S) sem // é ambíguo e não representa um endereço navegável confiável.
  if (scheme && !rest.startsWith('//')) return null;
  rest = rest.replace(/^\/\//, '');
  const authorityEnd = rest.search(/[/?#]/);
  const authority = authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
  const afterAuthority = authorityEnd === -1 ? '' : rest.slice(authorityEnd);

  const at = authority.lastIndexOf('@');
  const userinfo = at === -1 ? '' : authority.slice(0, at);
  const hostPort = at === -1 ? authority : authority.slice(at + 1);
  const [rawHost = '', port = ''] = hostPort.split(':');
  if (hostPort.startsWith('[') || hostPort.split(':').length > 2 || (port && !/^\d{1,5}$/.test(port))) return null;
  const host = rawHost.toLowerCase().replace(/\.$/, '');

  const hashIdx = afterAuthority.indexOf('#');
  const fragment = hashIdx === -1 ? '' : afterAuthority.slice(hashIdx + 1);
  const beforeHash = hashIdx === -1 ? afterAuthority : afterAuthority.slice(0, hashIdx);
  const qIdx = beforeHash.indexOf('?');
  const path = qIdx === -1 ? beforeHash : beforeHash.slice(0, qIdx);
  const query = qIdx === -1 ? '' : beforeHash.slice(qIdx + 1);

  const isIp = IPV4_RE.test(host);
  if (!host || (!isIp && !host.includes('.')) || /[^\p{L}\p{N}.-]/u.test(host) || host.includes('..') || host.startsWith('.') || host.startsWith('-')) return null;

  const labels = host.split('.');
  const lastTwo = labels.slice(-2).join('.');
  const suffixLen = MULTI_LEVEL_SUFFIXES.has(lastTwo) ? 2 : 1;
  const regLen = Math.min(labels.length, suffixLen + 1);
  const registrableDomain = isIp ? host : labels.slice(-regLen).join('.');
  const mainLabel = isIp ? '' : (labels[labels.length - regLen] ?? '');

  return {
    raw,
    scheme: scheme || 'http',
    schemeMissing: !scheme,
    userinfo,
    host,
    rawHost,
    port,
    path,
    query,
    fragment,
    registrableDomain,
    mainLabel,
    tld: isIp ? '' : labels[labels.length - 1]!,
    subdomains: isIp ? [] : labels.slice(0, labels.length - regLen),
    isIp,
  };
}

/** Distância de edição (Levenshtein) — usada para achar erros de digitação. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(prev[j]! + 1, prev[j - 1]! + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length]!;
}
