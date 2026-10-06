import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { pauseSpeaking, resumeSpeaking, speak, stopSpeaking, type Rate } from '@/services/speech';
import { AppText } from './AppText';

/** G5 · "Ler em voz alta" — sobreposição com pausar, mais devagar e fechar. */
export function ReadAloudSheet({ text, visible, onClose }: { text: string; visible: boolean; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState<Rate>('normal');
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    setPaused(false);
    speak(text, { rate });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, rate]);

  const preview = text.length > 60 ? `${text.slice(0, 60)}…` : text;
  const bars = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.35, 0.7];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.row}>
            <View style={styles.speaker}>
              <AppText size={26}>🔊</AppText>
            </View>
            <View style={styles.flex}>
              <AppText size={16} weight="heavy" color="#fff">
                {paused ? 'Leitura pausada' : 'Lendo o resultado…'}
              </AppText>
              <AppText size={12} color="#9fc2e6" numberOfLines={1}>
                “{preview}”
              </AppText>
            </View>
          </View>
          <View style={styles.wave} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {bars.map((h, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: `${h * 100}%`,
                    opacity: paused ? 0.4 : pulse.interpolate({ inputRange: [0, 1], outputRange: [i % 2 ? 0.5 : 1, i % 2 ? 1 : 0.5] }),
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (paused) resumeSpeaking();
                else pauseSpeaking();
                setPaused((p) => !p);
              }}
              style={styles.primary}
            >
              <AppText size={15} weight="heavy" color="#0b2740">
                {paused ? '▶ Continuar' : '⏸ Pausar'}
              </AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={rate === 'slow' ? 'Velocidade normal' : 'Ler mais devagar'}
              accessibilityState={{ selected: rate === 'slow' }}
              onPress={() => setRate((r) => (r === 'slow' ? 'normal' : 'slow'))}
              style={[styles.square, rate === 'slow' && styles.squareOn]}
            >
              <AppText size={18}>🐢</AppText>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar leitura" onPress={onClose} style={styles.square}>
              <AppText size={16} color="#fff">
                ✕
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(255,255,255,0.6)', padding: 18 },
  sheet: { backgroundColor: '#0b2740', borderWidth: 2, borderColor: '#1f2a37', borderRadius: 18, padding: 18, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  speaker: { width: 50, height: 50, borderRadius: 50, backgroundColor: '#2563a8', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  wave: { flexDirection: 'row', gap: 3, alignItems: 'center', height: 26 },
  bar: { flex: 1, backgroundColor: '#6fa8e0', borderRadius: 2 },
  primary: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  square: { width: 48, height: 48, borderRadius: 12, borderWidth: 2, borderColor: '#6fa8e0', alignItems: 'center', justifyContent: 'center' },
  squareOn: { backgroundColor: '#2563a8' },
});
