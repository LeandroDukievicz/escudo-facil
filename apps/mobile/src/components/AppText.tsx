import { Text, type TextProps, type TextStyle } from 'react-native';
import { FONT, useTheme, type FontWeight } from '@/theme';

export interface AppTextProps extends TextProps {
  size?: number;
  weight?: FontWeight;
  color?: string;
  align?: TextStyle['textAlign'];
  lh?: number;
}

/** Texto com a fonte Asap, escala do modo "texto grande" e cor do tema. */
export function AppText({ size = 16, weight = 'regular', color, align, lh = 1.35, style, ...rest }: AppTextProps) {
  const t = useTheme();
  const fontSize = t.fs(size);
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      style={[
        { fontFamily: FONT[weight], fontSize, lineHeight: Math.round(fontSize * lh), color: color ?? t.c.text, textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}

export const Title = (p: AppTextProps) => {
  const t = useTheme();
  return <AppText size={22} weight="heavy" color={t.c.title} lh={1.2} accessibilityRole="header" {...p} />;
};
