import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';

/** Indicador de passos (onboarding e cards do Aprender). */
export function Dots({ active, total = 3 }: { active: number; total?: number }) {
  const t = useTheme();
  return (
    <View style={styles.dots} accessibilityLabel={`Passo ${active + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: i === active ? (t.hc ? t.c.accent : t.c.primary) : '#cbd5e1', width: i === active ? 22 : 9 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 2 },
  dot: { height: 9, borderRadius: 9 },
});
