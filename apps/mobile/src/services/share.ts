import { SHARE_MESSAGE, type AnalysisResult } from '@escudo/core';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';

/** Mensagem pronta para mandar ao familiar (B3). */
export function buildShareText(result?: Pick<AnalysisResult, 'title' | 'signals'>, extra?: string): string {
  const lines = [SHARE_MESSAGE];
  if (result) {
    lines.push('', `Resultado do Escudo Fácil: ${result.title}.`);
    result.signals.forEach((s) => lines.push(`• ${s.label}`));
  }
  if (extra) lines.push('', extra);
  return lines.join('\n');
}

/** Abre o WhatsApp com a mensagem; se não houver WhatsApp, usa o compartilhar do sistema. */
export async function shareViaWhatsApp(text: string, phone?: string): Promise<void> {
  const digits = phone?.replace(/\D/g, '');
  const url = `whatsapp://send?text=${encodeURIComponent(text)}${digits ? `&phone=${digits}` : ''}`;
  try {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
      return;
    }
  } catch {
    /* cai para o share do sistema */
  }
  await Share.share({ message: text });
}

export async function shareSystem(text: string): Promise<void> {
  await Share.share({ message: text });
}
