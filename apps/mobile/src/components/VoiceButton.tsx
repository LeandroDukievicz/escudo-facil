import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { speak, stopSpeaking } from '@/services/speech';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

/** Botão 🔊 do cabeçalho: lê o conteúdo da tela em voz alta. */
export function VoiceButton({ text }: { text: string }) {
  const t = useTheme();
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={on ? 'Parar leitura' : 'Ler em voz alta'}
      hitSlop={10}
      onPress={() => {
        if (on) {
          stopSpeaking();
          setOn(false);
        } else {
          setOn(true);
          speak(text, { onDone: () => setOn(false) });
        }
      }}
      style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
    >
      <AppText size={24} color={t.c.title}>
        {on ? '⏸' : '🔊'}
      </AppText>
    </Pressable>
  );
}
