/**
 * Máscara de dados sensíveis — roda NO APARELHO antes de qualquer envio
 * para a IA (tela D2). O usuário escolhe o que ocultar.
 */

export type MaskKind = 'cpf' | 'phone' | 'email' | 'pix' | 'address' | 'document' | 'card';

export const MASK_LABELS: Record<MaskKind, string> = {
  cpf: 'CPF',
  phone: 'Telefone',
  email: 'E-mail',
  pix: 'Chave Pix',
  address: 'Endereço',
  document: 'RG/CNH',
  card: 'Cartão',
};

export const DEFAULT_MASKS: MaskKind[] = ['cpf', 'phone', 'email', 'pix', 'card'];

const BLOCK = '█';

const RULES: Record<MaskKind, RegExp> = {
  // Cartão antes de telefone/CPF para não ser quebrado por eles.
  card: /\b(?:\d{4}[ .-]?){3}\d{4}\b/g,
  cpf: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  email: /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g,
  phone: /(?:\+?55\s?)?\(?\b\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b/g,
  // Chave aleatória (EVP) do Pix.
  pix: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  document: /\b(?:rg|cnh)[:\s]*[\d.\-xX]{5,14}\b/gi,
  address: /\b(?:rua|r\.|av\.|avenida|travessa|alameda|rodovia|estrada)\s+[^\n,]{2,60},?\s*(?:n[ºo°.]?\s*)?\d{1,6}\b/gi,
};

const ORDER: MaskKind[] = ['card', 'pix', 'email', 'cpf', 'phone', 'document', 'address'];

/** Troca cada dígito/letra por █, mantendo pontuação (ex.: ███.███.███-██). */
const blockOut = (s: string) => s.replace(/[\p{L}\p{N}]/gu, BLOCK);

export interface MaskResult {
  text: string;
  counts: Partial<Record<MaskKind, number>>;
  total: number;
}

export function maskSensitive(text: string, kinds: MaskKind[] = DEFAULT_MASKS): MaskResult {
  const enabled = new Set(kinds);
  const counts: Partial<Record<MaskKind, number>> = {};
  let out = text;
  for (const kind of ORDER) {
    if (!enabled.has(kind)) continue;
    const re = RULES[kind];
    re.lastIndex = 0;
    out = out.replace(re, (m) => {
      if (m.includes(BLOCK)) return m;
      counts[kind] = (counts[kind] ?? 0) + 1;
      return blockOut(m);
    });
  }
  // Chave Pix "e-mail/telefone/CPF" já é coberta pelas regras acima.
  if (enabled.has('pix')) {
    out = out.replace(/(chave pix[:\s]+)(\S+)/gi, (_m, p: string, key: string) => {
      if (key.includes(BLOCK)) return p + key;
      counts.pix = (counts.pix ?? 0) + 1;
      return p + blockOut(key);
    });
  }
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  return { text: out, counts, total };
}
