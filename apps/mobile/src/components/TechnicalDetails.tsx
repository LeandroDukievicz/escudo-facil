import type { TechnicalDetail } from '@escudo/core';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

/** "Ver detalhes técnicos" — recolhido por padrão para não assustar. */
export function TechnicalDetails({ items }: { items: TechnicalDetail[] }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.box, { borderColor: t.hc ? t.c.ink : t.c.divider }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={styles.head}
      >
        <AppText size={13} color={t.c.subtle} weight="semibold">
          Ver detalhes técnicos
        </AppText>
        <AppText size={13} color={t.c.subtle}>
          {open ? '▴' : '▾'}
        </AppText>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {items.map((it) => (
            <View key={it.label}>
              <AppText size={12} weight="bold" color={t.c.subtle}>
                {it.label}
              </AppText>
              <AppText size={12} color={t.c.text} selectable>
                {it.value}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10 },
  head: { minHeight: 48, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { paddingHorizontal: 12, paddingBottom: 12, gap: 6 },
});
