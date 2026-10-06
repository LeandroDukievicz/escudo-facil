import { Pressable, StyleSheet, View } from 'react-native';
import { speak } from '@/services/speech';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { Box, Toggle } from './ui';

const STEPS = [1, 1.1, 1.2, 1.35, 1.5];

/** Preferências de acessibilidade (A3) — usadas no onboarding e na Ajuda. */
export function AccessibilitySettings() {
  const t = useTheme();
  const { settings, update } = useSettings();
  return (
    <View style={styles.wrap}>
      <Toggle icon="🔠" label="Texto grande" value={settings.largeText} onChange={(v) => update({ largeText: v })} />
      <Toggle icon="🌗" label="Alto contraste" value={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
      <Toggle
        icon="🔊"
        label="Ler em voz alta"
        hint="O app lê os resultados para você"
        value={settings.voice}
        onChange={(v) => {
          update({ voice: v });
          if (v) speak('Pronto. Vou ler os resultados em voz alta para você.');
        }}
      />
      <Box dashed border={t.c.border} bg={t.c.surface}>
        <AppText size={13} color={t.c.subtle} style={styles.mb8}>
          Tamanho do texto
        </AppText>
        <View style={styles.scale} accessibilityRole="adjustable" accessibilityLabel="Tamanho do texto">
          <AppText size={13} color={t.c.muted}>
            A
          </AppText>
          {STEPS.map((s) => {
            const on = settings.largeText && Math.abs(settings.textScale - s) < 0.01;
            const base = !settings.largeText && s === 1;
            return (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityLabel={`${Math.round(s * 100)} por cento`}
                accessibilityState={{ selected: on || base }}
                onPress={() => update(s === 1 ? { largeText: false, textScale: 1 } : { largeText: true, textScale: s })}
                style={[
                  styles.step,
                  { borderColor: t.c.ink, backgroundColor: on || base ? (t.hc ? t.c.accent : t.c.primary) : t.c.card },
                ]}
              />
            );
          })}
          <AppText size={24} weight="heavy" color={t.c.muted}>
            A
          </AppText>
        </View>
        <AppText size={16} color={t.c.title} style={styles.mt10}>
          Exemplo: Não clique ainda. Vamos verificar primeiro.
        </AppText>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  mb8: { marginBottom: 8 },
  mt10: { marginTop: 10 },
  scale: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  step: { width: 34, height: 34, borderRadius: 34, borderWidth: 2 },
});
