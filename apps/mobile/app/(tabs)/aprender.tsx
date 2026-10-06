import { LEARN_CARDS } from '@escudo/core';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { tap } from '@/services/haptics';
import { useLearned } from '@/state/learn';
import { useTheme } from '@/theme';

/** F3 · Aprender — cards curtos com checklist de aprendizado. */
export default function Learn() {
  const t = useTheme();
  const { learned } = useLearned();
  return (
    <Screen
      edges={['top']}
      title="Aprender"
      icon="📚"
      right={
        <AppText size={13} weight="bold" color={t.hc ? t.c.accent : t.risk('low').solid}>
          {learned.length} de {LEARN_CARDS.length} ✓
        </AppText>
      }
    >
      {LEARN_CARDS.map((c) => {
        const done = learned.includes(c.id);
        return (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={`${c.title}${done ? ', já aprendido' : ''}`}
            onPress={() => {
              tap();
              router.push({ pathname: '/aprender/[id]', params: { id: c.id } });
            }}
            style={[styles.card, { borderColor: t.c.ink, borderWidth: t.hc ? 3 : 2, backgroundColor: done && !t.hc ? t.risk('low').soft : t.c.card }]}
          >
            <AppText size={28}>{c.icon}</AppText>
            <View style={styles.flex}>
              <AppText size={16} weight="heavy" color={t.c.title}>
                {c.title}
              </AppText>
            </View>
            <AppText size={20} color={done ? (t.hc ? t.c.accent : t.risk('low').solid) : t.c.placeholder}>
              {done ? '✓' : '›'}
            </AppText>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 },
  flex: { flex: 1 },
});
