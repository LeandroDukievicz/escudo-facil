import { CHECKLIST, evaluateChecklist } from '@escudo/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { tap } from '@/services/haptics';
import { useTheme } from '@/theme';

/** E5 · Checklist anti-golpe. */
export default function Checklist() {
  const t = useTheme();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const verdict = evaluateChecklist(checked);
  const r = t.risk(verdict.level === 'low' ? 'low' : verdict.level);

  const toggle = (id: string) => {
    tap();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Screen
      back
      title="Checklist anti-golpe"
      icon="✅"
      footer={
        <>
          <View
            accessibilityLiveRegion="polite"
            style={[styles.verdict, { backgroundColor: r.soft, borderColor: t.hc ? t.c.ink : r.border }]}
          >
            <AppText size={15} weight="bold" color={t.hc ? t.c.title : r.strong} align="center">
              {verdict.message}
            </AppText>
          </View>
          {verdict.count > 0 && <Button label="O que eu faço agora?" height={52} onPress={() => router.push('/passo-a-passo')} />}
        </>
      }
    >
      <AppText size={14} color={t.c.subtle}>
        Marque o que está acontecendo:
      </AppText>
      {CHECKLIST.map((item) => {
        const on = checked.has(item.id);
        const red = t.risk('high');
        return (
          <Pressable
            key={item.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={item.text}
            onPress={() => toggle(item.id)}
            style={[
              styles.item,
              {
                borderColor: on ? (t.hc ? t.c.accent : red.solid) : t.hc ? '#fff' : t.c.border,
                backgroundColor: on ? red.soft : t.c.card,
                borderWidth: t.hc ? 3 : 2,
              },
            ]}
          >
            <View
              style={[
                styles.box,
                on
                  ? { backgroundColor: t.hc ? t.c.accent : red.solid, borderColor: t.hc ? t.c.accent : red.solid }
                  : { borderColor: t.hc ? '#fff' : t.c.border },
              ]}
            >
              {on && (
                <AppText size={15} weight="heavy" color={t.hc ? '#000' : '#fff'}>
                  ✓
                </AppText>
              )}
            </View>
            <AppText size={16} weight="semibold" color={t.c.title} style={styles.flex}>
              {item.text}
            </AppText>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 12, padding: 11, minHeight: 52 },
  box: { width: 28, height: 28, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  verdict: { borderWidth: 2, borderRadius: 12, padding: 12 },
});
