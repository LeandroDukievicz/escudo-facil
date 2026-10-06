import type { AnalysisResult } from '@escudo/core';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resultToSpeech } from '@/services/speech';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { ReadAloudSheet } from './ReadAloudSheet';
import { BackButton } from './Screen';

/**
 * Moldura das telas de resultado: cabeçalho do semáforo, conteúdo rolável,
 * botões fixos e leitura em voz alta (automática se o modo voz estiver ligado).
 */
export function ResultScreen({
  result,
  header,
  children,
  footer,
  statusRight,
  tone,
}: {
  result: AnalysisResult;
  /** Cor do topo quando o cabeçalho usa outro tom (ex.: proposta). */
  tone?: AnalysisResult['level'];
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  statusRight?: string;
}) {
  const t = useTheme();
  const { settings } = useSettings();
  const [reading, setReading] = useState(false);

  useEffect(() => {
    if (settings.voice) setReading(true);
  }, [settings.voice]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.c.bg }]}>
      <View style={[styles.bar, { backgroundColor: t.risk(tone ?? result.level).soft }]}>
        <BackButton />
        {statusRight ? (
          <AppText size={12} weight="bold" color={t.c.subtle} style={styles.flex}>
            {statusRight}
          </AppText>
        ) : (
          <View style={styles.flex} />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ler resultado em voz alta"
          onPress={() => setReading(true)}
          style={styles.voice}
        >
          <AppText size={22}>🔊</AppText>
        </Pressable>
      </View>
      {header}
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      <View style={styles.footer}>{footer}</View>
      <ReadAloudSheet text={resultToSpeech(result)} visible={reading} onClose={() => setReading(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  flex: { flex: 1 },
  voice: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 22, paddingTop: 14, gap: 12 },
  footer: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 8, gap: 9 },
});
