import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { tap } from '@/services/haptics';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'danger-outline' | 'ai' | 'link' | 'calm';

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  /** Altura: botões nunca têm menos de 48px. */
  height?: number;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export function Button({ label, onPress, variant = 'primary', icon, height = 56, size = 17, disabled, style, accessibilityHint }: Props) {
  const t = useTheme();
  const v = (() => {
    const lowRisk = t.risk('low');
    const high = t.risk('high');
    switch (variant) {
      case 'primary':
        return { bg: t.c.primary, fg: t.c.onPrimary, border: t.c.ink };
      case 'success':
        return { bg: lowRisk.solid, fg: '#fff', border: t.c.ink };
      case 'danger':
        return { bg: high.solid, fg: '#fff', border: t.c.ink };
      case 'danger-outline':
        return { bg: t.c.card, fg: t.hc ? t.c.title : '#c0392b', border: t.hc ? t.c.ink : high.solid };
      case 'ai':
        return { bg: t.c.ai, fg: '#fff', border: t.c.ink };
      case 'calm':
        return { bg: '#2563a8', fg: '#fff', border: '#6fa8e0' };
      case 'link':
        return { bg: 'transparent', fg: t.hc ? t.c.accent : t.c.primary, border: 'transparent' };
      default:
        return { bg: t.c.card, fg: t.c.title, border: t.c.ink };
    }
  })();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: Math.max(48, height),
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'link' ? 0 : t.hc ? 3 : 2,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <AppText size={size + 1}>{icon}</AppText> : null}
        <AppText
          size={size}
          weight={variant === 'link' ? 'semibold' : 'heavy'}
          color={v.fg}
          align="center"
          style={variant === 'link' ? styles.underline : undefined}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Dois botões lado a lado (padrão das telas de resultado). */
export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.pair}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  underline: { textDecorationLine: 'underline' },
  pair: { flexDirection: 'row', gap: 9 },
});
