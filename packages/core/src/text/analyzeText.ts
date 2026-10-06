import { buildResult } from '../result';
import type { AnalysisResult, Highlight, RiskLevel, Signal, SignalCategory } from '../types';
import { linkSignals } from '../url/analyzeUrl';
import { parseLink } from '../url/parse';
import { LINK_IN_TEXT_RE, normalizeText, TEXT_PATTERNS } from './patterns';

const TEXT_SUMMARIES: Record<RiskLevel, string> = {
  low: 'Não encontramos sinais fortes de golpe nesta mensagem. Ainda assim, não envie senha, código ou dinheiro sem confirmar pelo canal oficial.',
  attention:
    'A mensagem tem sinais que costumam aparecer em golpes. Melhor confirmar por outro canal antes de responder.',
  high: 'A mensagem tem vários sinais de golpe. Não responda, não clique e não envie nada antes de confirmar pelo canal oficial.',
  unknown:
    'Não conseguimos ler texto suficiente para analisar. Tente uma imagem mais nítida ou cole o texto da mensagem.',
};

/** Tipo de golpe mais provável, em linguagem simples. */
export type ScamType =
  | 'falso banco'
  | 'falso parente'
  | 'falso benefício'
  | 'falso prêmio'
  | 'falsa cobrança'
  | 'falso suporte'
  | 'falso investimento'
  | 'falso entregador';

export interface TextAnalysis {
  result: AnalysisResult;
  highlights: Highlight[];
  links: string[];
  /** Explicações simples em camadas (máx. 2 frases). */
  explanation: string[];
  scamType?: ScamType;
  /** A mensagem tenta gerar pressa — gatilho do modo "Não me pressione". */
  pressure: boolean;
}

export interface AnalyzeTextOptions {
  offline?: boolean;
  now?: Date;
  /** Texto veio de OCR de um print. */
  fromImage?: boolean;
}

function guessScamType(cats: Set<SignalCategory>, norm: string): ScamType | undefined {
  if (cats.has('family-impostor')) return 'falso parente';
  if (cats.has('remote-access')) return 'falso suporte';
  if (/\b(?:investimento|cripto|bitcoin|rendimento)\b/.test(norm)) return 'falso investimento';
  if (/\b(?:encomenda|entrega|rastreio|correios)\b/.test(norm)) return 'falso entregador';
  if (/\b(?:beneficio|inss|fgts|bolsa familia|valores a receber)\b/.test(norm)) return 'falso benefício';
  if (cats.has('promise') && /\b(?:ganhou|premio|sorteado)\b/.test(norm)) return 'falso prêmio';
  if (/\b(?:banco|conta|cartao|pix)\b/.test(norm) && (cats.has('credentials') || cats.has('authority'))) return 'falso banco';
  if (/\b(?:boleto|fatura|divida|multa)\b/.test(norm)) return 'falsa cobrança';
  return undefined;
}

function explain(cats: Set<SignalCategory>): string[] {
  const out: string[] = [];
  if (cats.has('urgency') || cats.has('threat')) out.push('A mensagem tenta fazer você agir com pressa.');
  if (cats.has('credentials') || cats.has('documents') || cats.has('money')) {
    out.push('Ela pede dados ou dinheiro que bancos e órgãos oficiais normalmente não pedem por mensagem.');
  } else if (cats.has('promise')) {
    out.push('Ela promete algo bom demais — promessas assim merecem uma pausa.');
  } else if (cats.has('family-impostor')) {
    out.push('Confirme ligando para o número antigo da pessoa antes de qualquer coisa.');
  }
  return out.slice(0, 2);
}

/**
 * Analisa o texto de uma mensagem (colado ou extraído de um print por OCR).
 */
export function analyzeText(text: string, opts: AnalyzeTextOptions = {}): TextAnalysis {
  const norm = normalizeText(text);
  const signals: Signal[] = [];
  const highlights: Highlight[] = [];

  for (const p of TEXT_PATTERNS) {
    let first: string | undefined;
    for (const re of p.patterns) {
      re.lastIndex = 0;
      for (const m of norm.matchAll(re)) {
        const start = m.index ?? 0;
        const end = start + m[0].length;
        first ??= text.slice(start, end);
        highlights.push({ start, end, category: p.category, text: text.slice(start, end) });
      }
    }
    if (first !== undefined) {
      signals.push({ id: p.id, category: p.category, severity: p.severity, label: p.label, excerpt: first });
    }
  }

  const links: string[] = [];
  LINK_IN_TEXT_RE.lastIndex = 0;
  for (const m of text.matchAll(LINK_IN_TEXT_RE)) {
    const raw = m[0].replace(/[.,;:!?)]+$/, '');
    const parsed = parseLink(raw);
    if (!parsed) continue;
    links.push(raw);
    const start = m.index ?? 0;
    highlights.push({ start, end: start + raw.length, category: 'hidden-link', text: raw });
    const { signals: ls } = linkSignals(parsed);
    if (ls.some((s) => s.category === 'shortener')) {
      signals.push({ id: 'text.hidden-link', category: 'hidden-link', severity: 'medium', label: 'Tem link encurtado, que esconde o endereço real', excerpt: raw });
    }
    signals.push(...ls.filter((s) => s.category !== 'shortener' && s.severity !== 'weak'));
  }
  if (links.length && !signals.some((s) => s.category === 'hidden-link')) {
    signals.push({ id: 'text.link', category: 'hidden-link', severity: 'weak', label: 'Tem um link — não clique antes de verificar', excerpt: links[0] });
  }

  // Autoridade + pedido de dado/dinheiro juntos é o padrão clássico.
  const cats = new Set(signals.map((s) => s.category));
  if (cats.has('authority') && (cats.has('credentials') || cats.has('money') || cats.has('documents'))) {
    const auth = signals.find((s) => s.category === 'authority');
    if (auth) auth.severity = 'medium';
  }

  highlights.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Highlight[] = [];
  for (const h of highlights) {
    const last = merged[merged.length - 1];
    if (last && h.start < last.end) continue; // já coberto por destaque anterior
    merged.push(h);
  }

  const words = norm.split(/\s+/).filter(Boolean).length;
  const inconclusive = words < 3 && signals.length === 0;

  const result = buildResult({
    kind: 'text',
    signals,
    summaries: TEXT_SUMMARIES,
    checked: [
      'Sem pedido de senha, código ou Pix',
      'Sem frases de pressa ou ameaça conhecidas',
    ],
    inconclusive,
    offline: opts.offline,
    now: opts.now,
    technical: [
      { label: 'Origem', value: opts.fromImage ? 'OCR local (print)' : 'Texto colado' },
      { label: 'Palavras analisadas', value: String(words) },
      { label: 'Links encontrados', value: links.join(', ') || 'nenhum' },
      { label: 'Regras disparadas', value: signals.map((s) => s.id).join(', ') || 'nenhuma' },
    ],
  });

  const explanation = explain(cats);
  if (explanation.length && result.level !== 'low' && result.level !== 'unknown') {
    result.summary = explanation.join(' ');
  }

  return {
    result,
    highlights: merged,
    links,
    explanation,
    scamType: guessScamType(cats, norm),
    pressure: cats.has('urgency') || cats.has('threat'),
  };
}
