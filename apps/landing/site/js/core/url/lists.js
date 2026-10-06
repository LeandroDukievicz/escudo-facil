// Generated from packages/core/src/url/lists.ts. Run npm run build:landing to update.
/**
 * Listas locais usadas na análise offline. Atualizáveis via "atualização
 * de regras" quando o app estiver online.
 */
export const SHORTENERS = new Set([
  'bit.ly', 'bitly.com', 'tinyurl.com', 'cutt.ly', 'is.gd', 'ow.ly', 't.co',
  'rebrand.ly', 'shorturl.at', 'tiny.cc', 's.id', 'rb.gy', 'v.gd', 'goo.gl',
  'buff.ly', 'encurtador.com.br', 'abre.ai', 'l1nk.dev', 'encr.pw', 'u.to',
  'shre.ink', 'qrco.de', 'linktr.ee', 'bl.ink', 'short.io', 'wa.link',
]);
/** TLDs baratos e muito usados em campanhas de golpe. */
export const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'click', 'online', 'site', 'live', 'icu', 'buzz', 'monster',
  'rest', 'cfd', 'sbs', 'cyou', 'quest', 'bond', 'lol', 'mom', 'shop', 'store',
  'support', 'help', 'win', 'vip', 'loan', 'work', 'zip', 'mov', 'tk', 'ml',
  'ga', 'cf', 'gq',
]);
/** Sufixos públicos de dois níveis mais comuns no Brasil e exterior. */
export const MULTI_LEVEL_SUFFIXES = new Set([
  'com.br', 'gov.br', 'org.br', 'net.br', 'edu.br', 'art.br', 'blog.br',
  'app.br', 'dev.br', 'leg.br', 'jus.br', 'mil.br', 'mp.br', 'ind.br',
  'co.uk', 'org.uk', 'gov.uk', 'com.ar', 'com.pt', 'com.mx', 'co.jp',
]);
export const BRANDS          = [
  { name: 'Itaú', keywords: ['itau'], official: ['itau.com.br', 'itau.com'], kind: 'banco' },
  { name: 'Bradesco', keywords: ['bradesco'], official: ['bradesco.com.br'], kind: 'banco' },
  { name: 'Santander', keywords: ['santander'], official: ['santander.com.br'], kind: 'banco' },
  { name: 'Caixa', keywords: ['caixa'], official: ['caixa.gov.br'], kind: 'banco' },
  { name: 'Banco do Brasil', keywords: ['bancodobrasil', 'bb-'], official: ['bb.com.br'], kind: 'banco' },
  { name: 'Nubank', keywords: ['nubank'], official: ['nubank.com.br', 'nu.com.br'], kind: 'banco' },
  { name: 'Inter', keywords: ['bancointer'], official: ['bancointer.com.br', 'inter.co'], kind: 'banco' },
  { name: 'PicPay', keywords: ['picpay'], official: ['picpay.com'], kind: 'banco' },
  { name: 'Mercado Pago', keywords: ['mercadopago'], official: ['mercadopago.com.br', 'mercadopago.com'], kind: 'banco' },
  { name: 'gov.br', keywords: ['govbr', 'gov-br'], official: ['gov.br'], kind: 'governo' },
  { name: 'Receita Federal', keywords: ['receita', 'receitafederal'], official: ['gov.br'], kind: 'governo' },
  { name: 'INSS', keywords: ['inss', 'meuinss'], official: ['gov.br'], kind: 'governo' },
  { name: 'Detran', keywords: ['detran'], official: ['gov.br'], kind: 'governo' },
  { name: 'Serasa', keywords: ['serasa'], official: ['serasa.com.br'], kind: 'serviço' },
  { name: 'Correios', keywords: ['correios'], official: ['correios.com.br'], kind: 'entrega' },
  { name: 'Mercado Livre', keywords: ['mercadolivre'], official: ['mercadolivre.com.br', 'mercadolivre.com'], kind: 'loja' },
  { name: 'Magalu', keywords: ['magalu', 'magazineluiza'], official: ['magazineluiza.com.br', 'magalu.com.br', 'magalu.com'], kind: 'loja' },
  { name: 'Amazon', keywords: ['amazon'], official: ['amazon.com.br', 'amazon.com'], kind: 'loja' },
  { name: 'Shopee', keywords: ['shopee'], official: ['shopee.com.br'], kind: 'loja' },
  { name: 'Americanas', keywords: ['americanas'], official: ['americanas.com.br'], kind: 'loja' },
  { name: 'Casas Bahia', keywords: ['casasbahia'], official: ['casasbahia.com.br'], kind: 'loja' },
  { name: 'Netflix', keywords: ['netflix'], official: ['netflix.com'], kind: 'serviço' },
  { name: 'WhatsApp', keywords: ['whatsapp'], official: ['whatsapp.com', 'wa.me'], kind: 'serviço' },
];
/** Palavras no caminho do link que costumam aparecer em páginas falsas. */
export const SUSPICIOUS_PATH_WORDS = [
  'login', 'signin', 'verificar', 'verifique', 'atualizar', 'atualize',
  'confirmar', 'confirme', 'desbloqueio', 'desbloquear', 'regularizar',
  'regularize', 'premio', 'resgate', 'resgatar', 'beneficio', 'token',
  'seguranca', 'cadastro', 'recadastramento', 'pix', 'boleto', 'fatura',
  'restituicao', 'taxa', 'rastreio', 'encomenda',
];
/** Letras parecidas usadas para disfarçar endereços. */
export const DIGIT_LOOKALIKES                         = {
  '0': 'o',
  '1': 'l',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
};
