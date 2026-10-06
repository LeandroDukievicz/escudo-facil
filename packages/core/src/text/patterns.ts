import type { Severity, SignalCategory } from '../types';

export interface TextPattern {
  id: string;
  category: SignalCategory;
  severity: Severity;
  /** Rótulo curto exibido como selo (ex.: "URGÊNCIA"). */
  tag: string;
  /** Explicação simples do sinal. */
  label: string;
  /**
   * Expressões aplicadas ao texto normalizado (minúsculo, sem acento).
   * Mantêm o mesmo comprimento do original, então os índices servem
   * para destacar trechos na tela.
   */
  patterns: RegExp[];
}

export const TEXT_PATTERNS: TextPattern[] = [
  {
    id: 'text.urgency',
    category: 'urgency',
    severity: 'medium',
    tag: 'URGÊNCIA',
    label: 'Tenta fazer você agir com pressa',
    patterns: [
      /ultimo aviso/g,
      /(?:sua )?conta (?:sera|foi|vai ser) (?:bloqueada|suspensa|encerrada|cancelada)(?: hoje)?/g,
      /regularize (?:agora|ja|hoje)/g,
      /clique (?:imediatamente|agora|ja)/g,
      /prazo final/g,
      /(?:expira|vence) (?:hoje|em \d+ ?(?:h|horas|minutos))/g,
      /\b(?:urgente|urgencia)\b/g,
      /(?:ainda )?hoje sem falta/g,
      /nas proximas \d+ ?(?:h|horas)/g,
      /\bimediatamente\b/g,
    ],
  },
  {
    id: 'text.money',
    category: 'money',
    severity: 'strong',
    tag: 'PEDE DINHEIRO',
    label: 'Pede dinheiro, Pix ou boleto',
    patterns: [
      /(?:faca|faz|fazer|manda|mande|enviar|envie|transfira|transferir|pague|pagar|deposite|depositar) (?:um |o |a )?(?:pix|transferencia|deposito|pagamento|boleto)(?: de r\$ ?[\d.,]+)?/g,
      /(?:chave )?pix (?:de )?r\$ ?[\d.,]+/g,
      /(?:pague|pagar|quitar) (?:a |o )?(?:taxa|boleto|fatura|multa)/g,
      /\btaxa de (?:liberacao|entrega|desbloqueio|saque|adesao)\b/g,
      /me (?:empresta|manda|passa) (?:um )?(?:dinheiro|pix|r\$)/g,
    ],
  },
  {
    id: 'text.credentials',
    category: 'credentials',
    severity: 'strong',
    tag: 'SENHA/CÓDIGO',
    label: 'Pede senha, código ou token — bancos não pedem isso por mensagem',
    patterns: [
      /\bsenha\b/g,
      /\bcodigo (?:de )?(?:verificacao|seguranca|sms|de acesso|que (?:enviamos|chegou|recebeu))\b/g,
      /(?:confirme|informe|envie|mande|passe|digite) o codigo/g,
      /\btoken\b/g,
      /\bcodigo\b(?= (?:de 6|de seis|com 6))/g,
    ],
  },
  {
    id: 'text.documents',
    category: 'documents',
    severity: 'medium',
    tag: 'DOCUMENTOS',
    label: 'Pede documentos ou dados pessoais',
    patterns: [
      /(?:confirme|informe|envie|mande|atualize|digite) (?:o |seu |os seus |seus )?(?:cpf|rg|cnh|dados(?: pessoais| cadastrais| bancarios)?)/g,
      /foto (?:do|de seu|do seu) (?:cartao|documento|rosto)/g,
      /selfie (?:com|segurando) (?:o )?documento/g,
      /numero do cartao/g,
    ],
  },
  {
    id: 'text.authority',
    category: 'authority',
    severity: 'weak',
    tag: 'FALSA AUTORIDADE',
    label: 'Diz ser de banco, governo ou empresa conhecida',
    patterns: [
      /aqui e (?:do|da) (?:banco|central|receita|caixa|inss|correios|operadora)/g,
      /\breceita federal\b/g,
      /\bgov\.?br\b/g,
      /\binss\b/g,
      /\bcorreios\b/g,
      /central de (?:seguranca|atendimento|relacionamento)/g,
      /suporte tecnico/g,
      /setor de (?:fraude|seguranca)/g,
      /\bdetran\b/g,
      /\bserasa\b/g,
    ],
  },
  {
    id: 'text.threat',
    category: 'threat',
    severity: 'medium',
    tag: 'AMEAÇA',
    label: 'Faz ameaça para assustar',
    patterns: [
      /\bmulta\b/g,
      /processo judicial/g,
      /mandado de (?:prisao|busca)/g,
      /(?:seu )?nome (?:sera|vai ser|ficara) (?:negativado|protestado|sujo)/g,
      /\bprotesto\b/g,
      /(?:cpf|titulo) (?:sera |vai ser )?(?:cancelado|suspenso|bloqueado)/g,
      /perdera (?:o |seu )?(?:beneficio|acesso|saldo)/g,
    ],
  },
  {
    id: 'text.promise',
    category: 'promise',
    severity: 'medium',
    tag: 'PROMESSA EXAGERADA',
    label: 'Promete algo bom demais para ser verdade',
    patterns: [
      /(?:voce )?(?:ganhou|foi sorteado|foi contemplado)/g,
      /\bpremio\b/g,
      /beneficio liberado/g,
      /(?:valores|dinheiro) (?:a receber|esquecido)/g,
      /(?:lucro|rendimento|retorno) garantido/g,
      /renda extra/g,
      /ganhe (?:r\$ ?[\d.,]+|dinheiro)/g,
      /emprestimo (?:pre-?aprovado|liberado|sem consulta)/g,
      /\d+% de desconto/g,
    ],
  },
  {
    id: 'text.secrecy',
    category: 'secrecy',
    severity: 'medium',
    tag: 'SEGREDO',
    label: 'Pede segredo — golpista não quer que você fale com ninguém',
    patterns: [/nao (?:conte|fale) (?:para|pra) ninguem/g, /\bsegredo\b/g, /entre (?:nos|a gente)/g],
  },
  {
    id: 'text.remote',
    category: 'remote-access',
    severity: 'strong',
    tag: 'ACESSO REMOTO',
    label: 'Pede para instalar aplicativo — pode dar controle do seu celular',
    patterns: [
      /(?:instale|instalar|baixe|baixar) (?:o |um |esse |este )?(?:app|aplicativo|programa)/g,
      /\b(?:anydesk|teamviewer|rustdesk|airdroid|quicksupport)\b/g,
      /acesso remoto/g,
      /compartilh(?:e|ar) (?:a )?tela/g,
    ],
  },
  {
    id: 'text.family',
    category: 'family-impostor',
    severity: 'medium',
    tag: 'FALSO PARENTE',
    label: 'Diz que trocou de número — golpe comum do falso parente',
    patterns: [
      /(?:mudei|troquei) (?:de )?numero/g,
      /(?:esse|este) e (?:o )?meu (?:numero|celular) novo/g,
      /salva (?:esse|este) (?:numero|contato)/g,
      /meu celular (?:quebrou|caiu|foi roubado)/g,
    ],
  },
];

/** Minúsculo + sem acento, preservando o comprimento (índices batem). */
export function normalizeText(text: string): string {
  let out = '';
  for (const ch of text) {
    const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    // Mantém 1:1 com unidades UTF-16 do original.
    out += base.length === ch.length ? base : ch.toLowerCase().length === ch.length ? ch.toLowerCase() : ch;
  }
  return out;
}

/** Links dentro de um texto (com ou sem http). */
export const LINK_IN_TEXT_RE =
  /\b(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|br|net|org|xyz|top|click|online|site|ly|io|me|co|info|live|shop|store|app|link|gl|gd|at|cc|id|gy|ai)(?:\/[^\s<>"']*)?)/gi;
