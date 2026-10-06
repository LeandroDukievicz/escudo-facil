import type { AnalysisResult, RiskLevel } from './types';

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
