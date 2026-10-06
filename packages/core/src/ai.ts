import { findForbiddenPhrases, LEVEL_COPY } from './copy';
import type { AnalysisResult, RiskLevel } from './types';
import { maskSensitive } from './mask';
import { parseLink } from './url/parse';

/**
 * Contrato da "Análise com IA" (online). O app só chama a IA quando o
 * usuário escolhe, e sempre com o texto já mascarado no aparelho.
 * A implementação do provedor fica no backend — nunca no cliente.
 */
export interface AiAnalysisRequest {
  kind: 'link' | 'text';
  /** Link ou texto JÁ MASCARADO por `maskSensitive`. */
  content: string;
  /** Resultado local, para a IA complementar (não substituir) as regras. */
  local: Pick<AnalysisResult, 'level' | 'signals'>;
  locale: 'pt-BR';
}

/** Envia só o domínio principal; caminhos, parâmetros, fragmentos e credenciais podem conter segredos. */
export function linkContentForAi(input: string): string {
  const link = parseLink(input);
  return link?.registrableDomain
    ? `Domínio analisado: ${maskSensitive(link.registrableDomain).text}`
    : 'Endereço não reconhecido pela análise local';
}

/** Trechos dos sinais podem repetir dados digitados ou extraídos do print. */
export function sanitizeAiRequest(request: AiAnalysisRequest): AiAnalysisRequest {
  return {
    ...request,
    content: request.kind === 'link' ? linkContentForAi(request.content) : maskSensitive(request.content).text,
    local: {
      level: request.local.level,
      signals: request.local.signals.map(({ id, category, severity, label }) => ({ id, category, severity, label })),
    },
  };
}

export interface AiAnalysisResponse {
  level: RiskLevel;
  title: string;
  /** O que o golpista parece estar tentando fazer, em 1 frase. */
  intent: string;
  /** Até 5 motivos. */
  reasons: string[];
  /** Separação exigida no briefing. */
  known: string[];
  unknown: string[];
  actions: string[];
}

/** Resposta externa é dado não confiável; a análise local continua sendo o piso de risco. */
export function validateAiResponse(value: unknown, localLevel: RiskLevel): AiAnalysisResponse {
  if (!value || typeof value !== 'object') throw new Error('Resposta inválida da IA');
  const r = value as Record<string, unknown>;
  const levels: RiskLevel[] = ['low', 'attention', 'high', 'unknown'];
  if (!levels.includes(r.level as RiskLevel) || typeof r.intent !== 'string') throw new Error('Resposta inválida da IA');
  const list = (key: string): string[] => {
    const v = r[key];
    if (!Array.isArray(v) || v.length > 5 || !v.every((item) => typeof item === 'string' && item.length <= 500)) {
      throw new Error('Resposta inválida da IA');
    }
    return v;
  };
  const responseLevel = r.level as RiskLevel;
  const rank: Record<RiskLevel, number> = { unknown: 0, low: 1, attention: 2, high: 3 };
  if (rank[responseLevel] < rank[localLevel]) throw new Error('IA contradiz o risco da análise local');
  const level = responseLevel;
  const response: AiAnalysisResponse = {
    level,
    title: LEVEL_COPY[level].title,
    intent: r.intent.slice(0, 500),
    reasons: list('reasons'), known: list('known'), unknown: list('unknown'), actions: list('actions'),
  };
  if (findForbiddenPhrases(JSON.stringify(response)).length) throw new Error('Resposta insegura da IA');
  return response;
}

/**
 * Instruções de sistema para o modelo. Ficam aqui para serem versionadas
 * junto com as regras de copy (`FORBIDDEN_PHRASES`).
 */
export const AI_SYSTEM_PROMPT = `Você é o assistente do app Escudo Fácil, que ajuda pessoas leigas e idosas a identificar possíveis golpes digitais no Brasil.
Regras obrigatórias:
- Responda em português do Brasil, com frases curtas, calmas e sem julgamento.
- Nunca use jargão técnico (phishing, malware, IOC, hash, sandbox, score).
- Nunca diga que algo é "seguro", "100% confiável", "sem risco" ou "pode clicar". Use linguagem de risco: "Nenhum sinal grave encontrado agora".
- Nunca incentive clicar no link, pagar ou enviar dados.
- Separe o que sabemos do que não dá para confirmar.
- No máximo 5 motivos.
- Resuma em uma frase o que o golpista parece estar tentando fazer.
- Sugira ações práticas: não clicar, não pagar, ligar para o canal oficial, falar com familiar.
Responda somente em JSON no formato: {"level":"low|attention|high|unknown","title":"","intent":"","reasons":[],"known":[],"unknown":[],"actions":[]}`;
