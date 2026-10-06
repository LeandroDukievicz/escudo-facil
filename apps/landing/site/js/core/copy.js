// Generated from packages/core/src/copy.ts. Run npm run build:landing to update.
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
]         ;
const normalize = (s        ) => s.toLocaleLowerCase('pt-BR');
/** Retorna as frases proibidas encontradas no texto (vazio = ok). */
export function findForbiddenPhrases(text        )           {
  const t = normalize(text);
  return FORBIDDEN_PHRASES.filter((p) => t.includes(p));
}
export const LEVEL_COPY
  = {
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
  'Análise feita no aparelho com regras locais. Não consultamos a reputação dos links nem confirmamos quem enviou a mensagem.';
/** Ações recomendadas por nível (lista "O que fazer agora"). */
export const LEVEL_ACTIONS                              = {
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
