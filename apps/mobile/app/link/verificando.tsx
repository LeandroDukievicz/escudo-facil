import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { Badge } from '@/components/ui';
import { useOnline } from '@/services/network';
import { useTheme } from '@/theme';

const STEPS = [
  'Analisando padrão do endereço',
  'Procurando link encurtado / disfarçado',
  'Comparando com listas de segurança',
  'Verificando redirecionamentos',
];

/** C2 · Verificando… — mostra o que está sendo checado, passo a passo. */
export default function Checking() {
  const t = useTheme();
  const online = useOnline();
  const [step, setStep] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    if (step >= STEPS.length) {
      router.replace('/link/resultado');
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), 450);
    return () => clearTimeout(id);
  }, [step]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Screen scroll={false} contentStyle={styles.center} footer={
      <AppText size={13} color={t.c.subtle} align="center">
        Sem internet? Fazemos a análise básica no aparelho.
      </AppText>
    }>
      <Animated.View
        style={[styles.spinner, { borderColor: t.hc ? '#333' : t.c.primarySoft, borderTopColor: t.hc ? t.c.accent : t.c.primary, transform: [{ rotate }] }]}
      />
      <AppText size={22} weight="heavy" color={t.c.title} align="center" accessibilityLiveRegion="polite">
        Verificando sinais{'\n'}de risco…
      </AppText>
      {online === false && <Badge kind="offline" label="ANÁLISE NO APARELHO" />}
      <View style={styles.steps}>
        {STEPS.map((s, i) => {
          const done = i < step;
          const now = i === step;
          return (
            <AppText
              key={s}
              size={15}
              weight={now ? 'bold' : 'regular'}
              color={done ? t.risk('low').solid : now ? (t.hc ? t.c.accent : t.c.primary) : t.c.placeholder}
            >
              {done ? '✓' : now ? '◐' : '○'}  {s}
            </AppText>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, padding: 30 },
  spinner: { width: 88, height: 88, borderRadius: 88, borderWidth: 6 },
  steps: { gap: 12, alignSelf: 'stretch' },
});
