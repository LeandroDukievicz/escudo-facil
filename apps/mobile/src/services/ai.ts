import { sanitizeAiRequest, type AiAnalysisRequest, type AiAnalysisResponse } from '@escudo/core';

/**
 * Cliente da "Análise com IA" (online, opcional). O app envia SOMENTE
 * texto já mascarado para o backend do Escudo Fácil, que guarda a chave do
 * provedor de IA. Configure `EXPO_PUBLIC_AI_API_URL` para ativar.
 */
const API_URL = process.env.EXPO_PUBLIC_AI_API_URL;
const SECURE_API_URL = API_URL && /^https:\/\/[^/?#@]+\/?$/i.test(API_URL) ? API_URL.replace(/\/$/, '') : undefined;

export const aiAvailable = (): boolean => !!SECURE_API_URL;

export async function analyzeWithAi(req: AiAnalysisRequest, timeoutMs = 20_000): Promise<AiAnalysisResponse> {
  if (!SECURE_API_URL) throw new Error('IA não configurada com HTTPS');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${SECURE_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizeAiRequest(req)),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`IA respondeu ${res.status}`);
    return (await res.json()) as AiAnalysisResponse;
  } finally {
    clearTimeout(t);
  }
}
