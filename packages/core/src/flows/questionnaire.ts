import { buildResult } from '../result';
import type { AnalysisResult, RiskLevel, Severity, Signal } from '../types';

export type Answer = 'yes' | 'no' | 'unknown';

export interface Question {
  id: string;
  icon: string;
  text: string;
  /** Resposta que indica risco. Em "conhece a pessoa?" o risco é o "não". */
  riskyAnswer: Exclude<Answer, 'unknown'>;
  severity: Severity;
  /** Selo mostrado em "Sinais que você marcou". */
  tag: string;
}

/** As 8 perguntas do fluxo "Recebi uma proposta suspeita" (tela E1/E2). */
export const QUESTIONS: Question[] = [
  { id: 'money', icon: '💰', text: 'Estão pedindo dinheiro, Pix ou boleto?', riskyAnswer: 'yes', severity: 'medium', tag: 'Pede Pix' },
  { id: 'credentials', icon: '🔑', text: 'Estão pedindo senha, código SMS ou token?', riskyAnswer: 'yes', severity: 'strong', tag: 'Pede senha/código' },
  { id: 'urgency', icon: '⏰', text: 'Dizem que é urgente?', riskyAnswer: 'yes', severity: 'medium', tag: 'Urgência' },
  { id: 'authority', icon: '🏦', text: 'A pessoa se passou por banco, governo, parente ou empresa?', riskyAnswer: 'yes', severity: 'medium', tag: 'Se passou por banco' },
  { id: 'link', icon: '🔗', text: 'Você recebeu um link?', riskyAnswer: 'yes', severity: 'weak', tag: 'Mandou link' },
  { id: 'too-good', icon: '🎁', text: 'A oferta parece boa demais?', riskyAnswer: 'yes', severity: 'medium', tag: 'Boa demais' },
  { id: 'knows', icon: '🤝', text: 'Você conhece essa pessoa fora da internet?', riskyAnswer: 'no', severity: 'weak', tag: 'Não conhece' },
  { id: 'install', icon: '📲', text: 'Pedem para instalar algum aplicativo?', riskyAnswer: 'yes', severity: 'strong', tag: 'Instalar app' },
];

const SUMMARIES: Record<RiskLevel, string> = {
  low: 'Pelas suas respostas, não apareceram sinais fortes de golpe. Mesmo assim, não envie senha, código ou dinheiro sem confirmar pelo canal oficial.',
  attention:
    'Algumas respostas mostram sinais que aparecem em golpes. Confirme por outro canal antes de continuar.',
  high: 'Quando vários desses sinais aparecem juntos, costuma ser golpe. Não pague e não envie dados sem confirmar pelo canal oficial.',
  unknown:
    'Você respondeu "não sei" em muitas perguntas. Na dúvida, confirme pelo canal oficial ou fale com alguém de confiança.',
};

export const QUESTIONNAIRE_HEADLINE: Record<RiskLevel, string> = {
  low: 'Parece ter baixo risco, mas confirme',
  attention: 'Vale a pena confirmar antes',
  high: 'Melhor parar antes de continuar',
  unknown: 'Não deu para concluir',
};

export function scoreQuestionnaire(
  answers: Record<string, Answer | undefined>,
  opts: { now?: Date } = {},
): AnalysisResult & { marked: string[]; headline: string } {
  const signals: Signal[] = [];
  let unknowns = 0;
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    if (a === 'unknown' || a === undefined) {
      unknowns++;
      continue;
    }
    if (a === q.riskyAnswer) {
      signals.push({ id: `q.${q.id}`, category: 'questionnaire', severity: q.severity, label: q.tag });
    }
  }
  const result = buildResult({
    kind: 'questionnaire',
    signals,
    summaries: SUMMARIES,
    inconclusive: unknowns >= 5 && signals.length === 0,
    now: opts.now,
  });
  return {
    ...result,
    // No questionário mostramos todos os sinais marcados, não só 5.
    marked: signals.map((s) => s.label),
    headline: QUESTIONNAIRE_HEADLINE[result.level],
  };
}
