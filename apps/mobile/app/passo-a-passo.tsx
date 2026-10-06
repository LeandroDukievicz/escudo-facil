import { SAFE_STEPS } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { VoiceButton } from '@/components/VoiceButton';
import { Box } from '@/components/ui';
import { useTheme } from '@/theme';

/** D4 · "Não sei o que fazer" → passo a passo seguro. */
export default function SafeSteps() {
  const t = useTheme();
  const speech = `Calma. Faça uma coisa de cada vez. ${SAFE_STEPS.map((s, i) => `${i + 1}. ${s}`).join(' ')} Você fez certo em verificar antes de agir.`;
  return (
    <Screen
      back
      title="Passo a passo seguro"
      right={<VoiceButton text={speech} />}
      footer={<Button variant="success" icon="💬" label="Mandar para familiar" onPress={() => router.push('/ajuda-familiar')} />}
    >
      <AppText size={16}>Calma. Faça uma coisa de cada vez:</AppText>
      {SAFE_STEPS.map((s, i) => (
        <View key={s} style={styles.step}>
          <View style={[styles.num, { backgroundColor: t.hc ? t.c.accent : t.c.primary }]}>
            <AppText size={15} weight="heavy" color={t.hc ? '#000' : '#fff'}>
              {i + 1}
            </AppText>
          </View>
          <AppText size={17} color={t.c.title} style={styles.flex}>
            {s}
          </AppText>
        </View>
      ))}
      <Box bg={t.risk('low').soft} border={t.risk('low').solid}>
        <AppText size={15} color={t.hc ? t.c.title : t.risk('low').strong}>
          ✅ <AppText size={15} weight="heavy" color={t.hc ? t.c.title : t.risk('low').strong}>Você fez certo em verificar antes</AppText> de agir.
        </AppText>
      </Box>
      <Button variant="danger-outline" label="Já enviei dinheiro ou dados" height={48} size={15} onPress={() => router.push('/emergencia')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  num: { width: 32, height: 32, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, paddingTop: 3 },
});
