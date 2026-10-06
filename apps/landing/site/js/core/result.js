// Generated from packages/core/src/result.ts. Run npm run build:landing to update.
import { LEVEL_ACTIONS, LEVEL_COPY, OFFLINE_NOTICE } from './copy.js';
const SEVERITY_WEIGHT                           = { weak: 1, medium: 2, strong: 4 };
export const MAX_SIGNALS = 5;
/** Pontuação somada dos sinais (usada só internamente / detalhes técnicos). */
export function scoreSignals(signals          )         {
  return signals.reduce((acc, s) => acc + SEVERITY_WEIGHT[s.severity], 0);
}
/**
 * Decide o nível do semáforo a partir dos sinais.
 * - Qualquer sinal forte, ou pontuação >= 6 → alto risco.
 * - Pontuação >= 2 → atenção.
 * - Só sinais fracos isolados → baixo risco (com lembrete de cautela).
 */
export function levelFromSignals(signals          )                                {
  const score = scoreSignals(signals);
  const strong = signals.filter((s) => s.severity === 'strong').length;
  if (strong >= 1 || score >= 6) return 'high';
  if (score >= 2) return 'attention';
  return 'low';
}
/** Ordena do mais forte para o mais fraco, remove duplicados e limita a 5. */
export function topSignals(signals          , max = MAX_SIGNALS)           {
  const seen = new Set        ();
  return [...signals]
    .sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity])
    .filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)))
    .slice(0, max);
}
export function buildResult(input                  )                 {
  const level            = input.inconclusive ? 'unknown' : levelFromSignals(input.signals);
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
