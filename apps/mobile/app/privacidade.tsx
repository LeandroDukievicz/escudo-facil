import { PRIVACY_POINTS } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box } from '@/components/ui';
import { useTheme } from '@/theme';

/** A4 · Selo de privacidade — "Você está no controle". */
export default function Privacy() {
  const t = useTheme();
  return (
    <Screen
      back
      title="Sua privacidade"
      footer={<Button variant="secondary" label="Entendi" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />}
    >
      <Box bg={t.risk('low').soft} border={t.risk('low').solid} radius={16} style={styles.seal}>
        <AppText size={40}>🔒</AppText>
        <AppText size={18} weight="heavy" color={t.c.title}>
          Você está no controle
        </AppText>
      </Box>
      {PRIVACY_POINTS.map((p) => (
        <View key={p.title} style={styles.point}>
          <AppText size={22}>{p.icon}</AppText>
          <View style={styles.flex}>
            <AppText size={16} weight="bold" color={t.c.title}>
              {p.title}
            </AppText>
            <AppText size={14} color={t.c.muted}>
              {p.body}
            </AppText>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  seal: { alignItems: 'center', gap: 8, padding: 16 },
  point: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  flex: { flex: 1 },
});
