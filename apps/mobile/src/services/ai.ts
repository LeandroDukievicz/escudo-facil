import type { AiAnalysisRequest, AiAnalysisResponse } from '@escudo/core';

/**
 * Cliente da "Análise com IA" (online, opcional). O app envia SOMENTE
 * texto já mascarado para o backend do Escudo Fácil, que guarda a chave do
 * provedor de IA. Configure `EXPO_PUBLIC_AI_API_URL` para ativar.
 */
const API_URL = process.env.EXPO_PUBLIC_AI_API_URL;

export const aiAvailable = (): boolean => !!API_URL;

export async function analyzeWithAi(req: AiAnalysisRequest, timeoutMs = 20_000): Promise<AiAnalysisResponse> {
  if (!API_URL) throw new Error('IA não configurada');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`IA respondeu ${res.status}`);
    return (await res.json()) as AiAnalysisResponse;
  } finally {
    clearTimeout(t);
  }
}
