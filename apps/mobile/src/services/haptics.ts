import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Feedback tátil leve em toques (não existe no web). */
export function tap() {
  if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => undefined);
}

export function warn() {
  if (Platform.OS !== 'web') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
}
