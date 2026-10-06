import { PIX_GUIDANCE } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { VoiceButton } from '@/components/VoiceButton';
import { Notice } from '@/components/ui';
import { useTheme } from '@/theme';

/** Orientação para quem fez Pix para golpista (MED). */
export default function PixGuidance() {
  const t = useTheme();
  return (
    <Screen
      back
      title="Fiz um Pix para o golpista"
      icon="💸"
      right={<VoiceButton text={PIX_GUIDANCE.join(' ')} />}
      footer={<Button label="Gerar lista do que aconteceu" onPress={() => router.push('/resumo-do-caso')} />}
    >
      {PIX_GUIDANCE.map((g, i) => (
        <View key={g} style={styles.step}>
          <View style={[styles.num, { backgroundColor: t.hc ? t.c.accent : t.c.primary }]}>
            <AppText size={13} weight="heavy" color={t.hc ? '#000' : '#fff'}>
              {i + 1}
            </AppText>
          </View>
          <AppText size={16} color={t.c.title} style={styles.flex}>
            {g}
          </AppText>
        </View>
      ))}
      <Notice icon="⏱️">Quanto antes você avisar o banco, maior a chance de recuperar o dinheiro.</Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  num: { width: 28, height: 28, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
