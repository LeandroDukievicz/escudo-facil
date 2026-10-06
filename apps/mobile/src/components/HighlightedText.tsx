import type { Highlight, SignalCategory } from '@escudo/core';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export const CATEGORY_TAG: Partial<Record<SignalCategory, { tag: string; tone: 'high' | 'attention' | 'ai' }>> = {
  urgency: { tag: 'URGÊNCIA', tone: 'high' },
  threat: { tag: 'AMEAÇA', tone: 'high' },
  money: { tag: 'PEDE PIX', tone: 'high' },
  credentials: { tag: 'SENHA/CÓDIGO', tone: 'attention' },
  documents: { tag: 'DOCUMENTOS', tone: 'attention' },
  authority: { tag: 'FALSA AUTORIDADE', tone: 'attention' },
  promise: { tag: 'PROMESSA EXAGERADA', tone: 'attention' },
  secrecy: { tag: 'SEGREDO', tone: 'attention' },
  'remote-access': { tag: 'ACESSO REMOTO', tone: 'high' },
  'family-impostor': { tag: 'FALSO PARENTE', tone: 'attention' },
  'hidden-link': { tag: 'LINK OCULTO', tone: 'ai' },
};

function useTone() {
  const t = useTheme();
  return (tone: 'high' | 'attention' | 'ai') =>
    tone === 'ai'
      ? { bg: t.hc ? '#333' : '#e3d7f5', border: t.hc ? t.c.accent : t.c.ai, fg: t.hc ? t.c.accent : t.c.ai, chipBg: t.hc ? '#000' : t.c.aiSoft }
      : { bg: t.hc ? '#333' : t.risk(tone).highlight, border: t.hc ? t.c.accent : t.risk(tone).border, fg: t.hc ? t.c.accent : tone === 'high' ? '#c0392b' : '#a87a00', chipBg: t.hc ? '#000' : t.risk(tone).soft };
}

/** Texto do print com trechos suspeitos destacados (D3). Links nunca clicáveis. */
export function HighlightedText({ text, highlights, size = 13 }: { text: string; highlights: Highlight[]; size?: number }) {
  const t = useTheme();
  const tone = useTone();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  highlights.forEach((h, i) => {
    if (h.start > cursor) parts.push(text.slice(cursor, h.start));
    const meta = CATEGORY_TAG[h.category] ?? { tag: h.category, tone: 'attention' as const };
    const v = tone(meta.tone);
    parts.push(
      <AppText
        key={i}
        size={size}
        weight="semibold"
        color={t.c.title}
        style={{ backgroundColor: v.bg, textDecorationLine: 'underline', textDecorationColor: v.border }}
        accessibilityLabel={`${h.text}, marcado como ${meta.tag}`}
      >
        {h.text}
      </AppText>,
    );
    cursor = h.end;
  });
  parts.push(text.slice(cursor));
  return (
    <View style={[styles.box, { borderColor: t.c.ink, backgroundColor: t.c.surface, borderWidth: t.hc ? 3 : 2 }]}>
      <AppText size={size} color={t.hc ? t.c.text : '#475063'} lh={1.6}>
        {parts}
      </AppText>
    </View>
  );
}

/** Lista "SELO + trecho" abaixo do print. */
export function HighlightTags({ highlights }: { highlights: Highlight[] }) {
  const t = useTheme();
  const tone = useTone();
  const unique = Array.from(new Map(highlights.map((h) => [h.category, h])).values());
  return (
    <View style={styles.tags}>
      {unique.map((h) => {
        const meta = CATEGORY_TAG[h.category] ?? { tag: h.category, tone: 'attention' as const };
        const v = tone(meta.tone);
        return (
          <View key={h.category} style={styles.tagRow}>
            <View style={[styles.chip, { backgroundColor: v.chipBg, borderColor: v.border }]}>
              <AppText size={10} weight="heavy" color={v.fg}>
                {meta.tag}
              </AppText>
            </View>
            <AppText size={13} color={t.c.text} style={styles.flex} numberOfLines={2}>
              “{h.text}”
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 12, padding: 12 },
  tags: { gap: 7 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 7, paddingVertical: 2 },
  flex: { flex: 1 },
});
