import * as Speech from 'expo-speech';
import type { AnalysisResult } from '@escudo/core';

export type Rate = 'normal' | 'slow';

/** "Ler em voz alta" (G5) em português do Brasil. */
export function speak(text: string, opts: { rate?: Rate; onDone?: () => void } = {}) {
  void Speech.stop();
  Speech.speak(text, {
    language: 'pt-BR',
    rate: opts.rate === 'slow' ? 0.75 : 0.95,
    onDone: opts.onDone,
    onStopped: opts.onDone,
  });
}

export const stopSpeaking = (): void => {
  void Speech.stop();
};
export const pauseSpeaking = (): void => {
  void Speech.pause();
};
export const resumeSpeaking = (): void => {
  void Speech.resume();
};

/** Texto falado para um resultado, na mesma ordem das camadas da tela. */
export function resultToSpeech(r: AnalysisResult): string {
  const parts = [`${r.title}.`, r.summary];
  if (r.signals.length) parts.push(`Sinais encontrados: ${r.signals.map((s) => s.label).join('. ')}.`);
  parts.push(`O que fazer agora: ${r.actions.join('. ')}.`);
  return parts.join(' ');
}
