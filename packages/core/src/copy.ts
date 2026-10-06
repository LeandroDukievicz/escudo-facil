import type { RiskLevel } from './types';

/**
 * Regra crítica de comunicação: o app NUNCA declara algo como seguro.
 * Toda análise é uma avaliação de risco no momento da verificação.
 */
export const FORBIDDEN_PHRASES = [
  'link seguro',
  'site seguro',
  'mensagem segura',
  'pode clicar',
  'sem risco',
  '100% confiável',
  '100% seguro',
  'golpe confirmado com certeza',
  'totalmente confiável',
  'você está protegido',
  'você caiu em golpe',
] as const;

const normalize = (s: string) => s.toLocaleLowerCase('pt-BR');

/** Retorna as frases proibidas encontradas no texto (vazio = ok). */
export function findForbiddenPhrases(text: string): string[] {
  const t = normalize(text);
  return FORBIDDEN_PHRASES.filter((p) => t.includes(p));
}

export const LEVEL_COPY: Record<
  RiskLevel,
  { title: string; short: string; icon: string; meter: number; reminder?: string }
> = {
  low: {
    title: 'Nenhum sinal grave encontrado agora',
    short: 'Baixo risco',
    icon: '✓',
    meter: 1,
    reminder:
      'Continue atento. Não envie senha, código ou dinheiro sem confirmar pelo canal oficial.',
  },
  attention: {
    title: 'Atenção: sinais suspeitos',
    short: 'Atenção',
    icon: '⚠️',
    meter: 2,
  },
  high: {
    title: 'Alto risco de golpe',
    short: 'Alto risco',
    icon: '🛑',
    meter: 3,
    reminder: 'Não clique · Não pague · Não envie dados',
  },
  unknown: {
    title: 'Não foi possível confirmar',
    short: 'Inconclusivo',
    icon: '❔',
    meter: 1,
  },
};

export const OFFLINE_NOTICE =
  'Análise básica feita no aparelho. Para uma verificação mais completa, conecte-se à internet.';

/** Ações recomendadas por nível (lista "O que fazer agora"). */
export const LEVEL_ACTIONS: Record<RiskLevel, string[]> = {
  low: [
    'Confirme se o endereço é mesmo o site oficial',
    'Não envie senha, código ou dinheiro sem confirmar',
  ],
  attention: [
    'Não clique e não pague ainda',
    'Procure a empresa pelo canal oficial',
    'Se estiver em dúvida, fale com alguém de confiança',
  ],
  high: [
    'Não clique',
    'Não pague',
    'Não envie senha ou código',
    'Ligue para o banco pelo número oficial',
    'Fale com um familiar de confiança',
  ],
  unknown: [
    'Procure a fonte oficial (site ou telefone)',
    'Fale com uma pessoa de confiança',
  ],
};

export const SHARE_MESSAGE =
  'Oi, pode me ajudar a verificar isso? O app marcou como suspeito.';
