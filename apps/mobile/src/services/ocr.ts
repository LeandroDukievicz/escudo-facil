import { Platform } from 'react-native';

export interface OcrResult {
  text: string;
  /** false quando o OCR local não está disponível (ex.: Expo Go ou web). */
  available: boolean;
}

/**
 * OCR LOCAL (no aparelho) com Google ML Kit. Nada é enviado para a internet.
 * Requer um development build (`npx expo run:android|ios`); no Expo Go e no
 * web o módulo nativo não existe, e o app pede para colar o texto.
 */
export async function recognizeText(imageUri: string): Promise<OcrResult> {
  if (Platform.OS === 'web') return { text: '', available: false };
  try {
    const mod = require('@react-native-ml-kit/text-recognition') as {
      default: { recognize: (uri: string) => Promise<{ text: string }> };
    };
    const res = await mod.default.recognize(imageUri);
    return { text: res.text ?? '', available: true };
  } catch {
    return { text: '', available: false };
  }
}
