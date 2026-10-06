import { LEVEL_ACTIONS, LEVEL_COPY, OFFLINE_NOTICE } from './copy';
import type {
  AnalysisKind,
  AnalysisMode,
  AnalysisResult,
  RiskLevel,
  Severity,
  Signal,
  TechnicalDetail,
} from './types';

const SEVERITY_WEIGHT: Record<Severity, number> = { weak: 1, medium: 2, strong: 4 };

export const MAX_SIGNALS = 5;

/** Pontuação somada dos sinais (usada só internamente / detalhes técnicos). */
export function scoreSignals(signals: Signal[]): number {
  return signals.reduce((acc, s) => acc + SEVERITY_WEIGHT[s.severity], 0);
}

/**
 * Decide o nível do semáforo a partir dos sinais.
 * - Qualquer sinal forte, ou pontuação >= 6 → alto risco.
 * - Pontuação >= 2 → atenção.
 * - Só sinais fracos isolados → baixo risco (com lembrete de cautela).
 */
export function levelFromSignals(signals: Signal[]): Exclude<RiskLevel, 'unknown'> {
  const score = scoreSignals(signals);
  const strong = signals.filter((s) => s.severity === 'strong').length;
  if (strong >= 1 || score >= 6) return 'high';
  if (score >= 2) return 'attention';
  return 'low';
}

/** Ordena do mais forte para o mais fraco, remove duplicados e limita a 5. */
export function topSignals(signals: Signal[], max = MAX_SIGNALS): Signal[] {
  const seen = new Set<string>();
  return [...signals]
    .sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity])
    .filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)))
    .slice(0, max);
}

export interface BuildResultInput {
  kind: AnalysisKind;
  signals: Signal[];
  summaries: Record<RiskLevel, string>;
  checked?: string[];
  technical?: TechnicalDetail[];
  mode?: AnalysisMode;
  /** Força inconclusivo (ex.: entrada inválida, texto ilegível). */
  inconclusive?: boolean;
  offline?: boolean;
  now?: Date;
}

export function buildResult(input: BuildResultInput): AnalysisResult {
  const level: RiskLevel = input.inconclusive ? 'unknown' : levelFromSignals(input.signals);
  const signals = topSignals(input.signals);
  return {
    kind: input.kind,
    level,
    title: LEVEL_COPY[level].title,
    summary: input.summaries[level],
    signals,
    checked: level === 'low' ? (input.checked ?? []) : [],
    actions: LEVEL_ACTIONS[level],
    technical: [
      ...(input.technical ?? []),
      { label: 'Pontuação heurística', value: String(scoreSignals(input.signals)) },
      { label: 'Motor', value: input.mode === 'ai' ? 'IA + regras locais' : 'Regras locais (offline)' },
    ],
    mode: input.mode ?? 'local',
    analyzedAt: (input.now ?? new Date()).toISOString(),
    notice: input.offline || level === 'unknown' ? OFFLINE_NOTICE : undefined,
  };
}
