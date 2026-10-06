import { PRESSURE_MODE } from '@escudo/core';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { speak, stopSpeaking } from '@/services/speech';
import { useSettings } from '@/state/settings';

/** E4 · Modo "Não me pressione" — respiração guiada contra a pressa. */
export default function NoPressure() {
  const { settings } = useSettings();
  const scale = useRef(new Animated.Value(0.75)).current;
  const [phase, setPhase] = useState<'inspire' | 'expire'>('inspire');

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.75, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const id = setInterval(() => setPhase((p) => (p === 'inspire' ? 'expire' : 'inspire')), 4000);
    if (settings.voice) speak(`Respire. Não pague agora. ${PRESSURE_MODE.body}`);
    return () => {
      loop.stop();
      clearInterval(id);
      stopSpeaking();
    };
  }, [scale, settings.voice]);

  return (
    <Screen
      bg="#0b2740"
      scroll={false}
      contentStyle={styles.center}
      footer={
        <>
          <Button variant="calm" label={PRESSURE_MODE.primary} onPress={() => router.push('/canal-oficial')} />
          <Button variant="link" label={PRESSURE_MODE.secondary} onPress={() => router.push('/ajuda-familiar')} />
        </>
      }
    >
      <AppText size={56}>🌬️</AppText>
      <AppText size={28} weight="heavy" color="#fff" align="center" lh={1.2} accessibilityRole="header">
        {PRESSURE_MODE.title}
      </AppText>
      <View style={styles.circleWrap}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <AppText size={18} color="#cfe0f0" align="center" accessibilityLiveRegion="polite">
          {phase === 'inspire' ? 'inspire…' : 'expire…'}
        </AppText>
      </View>
      <AppText size={17} color="#cfe0f0" align="center" lh={1.45}>
        Golpes usam{' '}
        <AppText size={17} weight="heavy" color="#ffd97a">
          pressa
        </AppText>{' '}
        para impedir você de pensar. Você tem o direito de checar com calma.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30 },
  circleWrap: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', width: 150, height: 150, borderRadius: 150, borderWidth: 3, borderColor: '#6fa8e0' },
});
