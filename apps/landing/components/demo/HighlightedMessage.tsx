import type { Highlight, SignalCategory } from '@escudo/core';
import styles from './HighlightedMessage.module.css';

export const CATEGORY_TAG: Partial<Record<SignalCategory, { tag: string; tone: string }>> = {
  urgency: { tag: 'URGÊNCIA', tone: 'high' },
  threat: { tag: 'AMEAÇA', tone: 'high' },
  money: { tag: 'PEDE PIX/DINHEIRO', tone: 'high' },
  credentials: { tag: 'SENHA/CÓDIGO', tone: 'attention' },
  documents: { tag: 'DOCUMENTOS', tone: 'attention' },
  authority: { tag: 'FALSA AUTORIDADE', tone: 'attention' },
  promise: { tag: 'PROMESSA EXAGERADA', tone: 'attention' },
  secrecy: { tag: 'SEGREDO', tone: 'attention' },
  'remote-access': { tag: 'ACESSO REMOTO', tone: 'high' },
  'family-impostor': { tag: 'FALSO PARENTE', tone: 'attention' },
  'hidden-link': { tag: 'LINK', tone: 'ai' },
};

const toneVars = (tone: string) =>
  tone === 'ai'
    ? { background: 'var(--c-ai-highlight)', borderColor: 'var(--c-ai)' }
    : { background: `var(--risk-${tone}-highlight)`, borderColor: `var(--risk-${tone}-border)` };

/** Mensagem com os trechos suspeitos marcados (tela D3). Links nunca são clicáveis. */
export function HighlightedMessage({ text, highlights }: { text: string; highlights: Highlight[] }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  highlights.forEach((h, i) => {
    if (h.start > cursor) parts.push(text.slice(cursor, h.start));
    const meta = CATEGORY_TAG[h.category] ?? { tag: h.category, tone: 'attention' };
    parts.push(
      <mark key={i} className={styles.mark} style={toneVars(meta.tone)} title={meta.tag}>
        {h.text}
        <span className="visually-hidden"> ({meta.tag})</span>
      </mark>,
    );
    cursor = h.end;
  });
  parts.push(text.slice(cursor));

  const tags = Array.from(new Map(highlights.map((h) => [h.category, h])).values());

  return (
    <div className={styles.wrap}>
      <p className={styles.message}>{parts}</p>
      {tags.length > 0 && (
        <ul className={styles.tags}>
          {tags.map((h) => {
            const meta = CATEGORY_TAG[h.category] ?? { tag: h.category, tone: 'attention' };
            const v = toneVars(meta.tone);
            return (
              <li key={h.category}>
                <span className={styles.tag} style={{ background: v.background, borderColor: v.borderColor }}>
                  {meta.tag}
                </span>
                &ldquo;{h.text}&rdquo;
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
