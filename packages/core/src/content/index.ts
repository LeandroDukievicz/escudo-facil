/**
 * Conteúdo editorial compartilhado entre landing e app.
 * Tom: calmo, direto, respeitoso, sem julgamento e sem jargão.
 */

export interface LearnCard {
  id: string;
  icon: string;
  title: string;
  body: string;
}

/** Cards da tela "Aprender" (F3/F4). */
export const LEARN_CARDS: LearnCard[] = [
  {
    id: 'bank-code',
    icon: '🔑',
    title: 'Nunca envie código do banco',
    body: 'O código que chega por SMS serve só para você. Quem pede esse código quer entrar na sua conta.',
  },
  {
    id: 'whatsapp-password',
    icon: '💬',
    title: 'Banco não pede senha por WhatsApp',
    body: 'Nenhum banco pede senha, token ou código por mensagem. Se pedirem, pare e ligue para o número do cartão.',
  },
  {
    id: 'urgency',
    icon: '⏰',
    title: 'Desconfie de urgência',
    body: 'Golpista usa medo, pressa e promessa para você não pensar. Mensagem que diz "agora ou nunca" merece uma pausa.',
  },
  {
    id: 'address',
    icon: '🔍',
    title: 'Confira o endereço do site',
    body: 'Sites falsos copiam o visual dos verdadeiros. Olhe o final do endereço: banco de verdade não termina em ".xyz" ou ".top".',
  },
  {
    id: 'too-good',
    icon: '🎁',
    title: 'Promoção boa demais merece pausa',
    body: 'Prêmio que você não pediu, desconto enorme ou dinheiro fácil: respire e confira pelo site oficial antes.',
  },
  {
    id: 'fear',
    icon: '🧠',
    title: 'Golpista usa medo, pressa e promessa',
    body: 'Se a mensagem assusta, apressa ou promete demais, é hora de parar e falar com alguém de confiança.',
  },
];

/** Passo a passo após um resultado suspeito (D4). */
export const SAFE_STEPS = [
  'Não responda e não clique no link.',
  'Não envie senha, código ou Pix.',
  'Ligue para o banco pelo número oficial do cartão.',
  'Fale com um familiar de confiança.',
];

/** Tela de emergência "Acho que caí em golpe" (G1). Sempre gratuita. */
export const EMERGENCY_STEPS = [
  'Pare de conversar com a pessoa.',
  'Não envie mais dinheiro.',
  'Tire prints e salve comprovantes.',
  'Ligue para o banco pelo número oficial.',
  'Troque senhas se enviou dados.',
  'Registre um boletim de ocorrência.',
  'Avise um familiar de confiança.',
];

/** Orientações específicas para Pix enviado a golpista. */
export const PIX_GUIDANCE = [
  'Ligue para o seu banco o quanto antes, pelo número oficial do cartão ou do app.',
  'Peça a abertura do MED (Mecanismo Especial de Devolução do Pix). O prazo é curto.',
  'Guarde o comprovante do Pix e os prints da conversa.',
  'Registre um boletim de ocorrência (pode ser pela internet na delegacia virtual do seu estado).',
  'Não pague ninguém que prometa "recuperar seu dinheiro" — isso também costuma ser golpe.',
];

/** Modo "Não me pressione" (E4). */
export const PRESSURE_MODE = {
  title: 'Respire.\nNão pague agora.',
  body: 'Golpes usam pressa para impedir você de pensar. Você tem o direito de checar com calma.',
  primary: 'Verificar pelo canal oficial',
  secondary: 'Falar com alguém de confiança',
};

/** Selo de privacidade (A4). */
export const PRIVACY_POINTS = [
  {
    icon: '📵',
    title: 'Análise básica no aparelho',
    body: 'Links, prints e checklist funcionam sem enviar nada para a internet.',
  },
  {
    icon: '🤖',
    title: 'Você escolhe quando usar IA',
    body: 'Avisamos sempre antes de enviar algo para a nuvem.',
  },
  {
    icon: '🧹',
    title: 'Você pode apagar tudo',
    body: 'Apague seu histórico e dados quando quiser.',
  },
];

export type PlanId = 'free' | 'plus';

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
}

/** Planos (G3). O grátis continua para sempre e a emergência é sempre gratuita. */
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: 'R$ 0',
    features: [
      'Verificação básica offline',
      'Análise de links e prints (regras locais)',
      'Perguntas guiadas e checklist',
      'Histórico no aparelho',
      'Tela de emergência sempre gratuita',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 'R$ /mês',
    features: [
      'Análise avançada com IA',
      'Mais análises por mês',
      'Histórico protegido na nuvem',
      'Alertas e modo cuidador (família)',
      'Relatório de risco mensal',
      'Explicações por voz',
    ],
  },
];

/** Os 7 passos da experiência ideal. */
export const IDEAL_FLOW = [
  'Recebi algo estranho',
  'Abri o app',
  'Toquei numa opção grande',
  'Colei link ou mandei print',
  'Entendi o risco',
  'Soube o que fazer',
  'Pedi ajuda se precisei',
];
