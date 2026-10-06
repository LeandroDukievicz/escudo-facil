import { colors, highContrast, risk, type RiskLevel } from '@escudo/tokens';
import { useMemo } from 'react';
import { useSettings } from '@/state/settings';

export interface Theme {
  hc: boolean;
  scale: number;
  /** Escala um tamanho de fonte de acordo com o modo "texto grande". */
  fs: (size: number) => number;
  c: {
    bg: string;
    card: string;
    surface: string;
    ink: string;
    title: string;
    text: string;
    muted: string;
    subtle: string;
    placeholder: string;
    divider: string;
    border: string;
    primary: string;
    primarySoft: string;
    onPrimary: string;
    ai: string;
    aiSoft: string;
    accent: string;
  };
  risk: (level: RiskLevel) => (typeof risk)[RiskLevel];
}

const LIGHT: Theme['c'] = {
  bg: colors.white,
  card: colors.white,
  surface: colors.surface,
  ink: colors.ink,
  title: colors.title,
  text: colors.text,
  muted: colors.muted,
  subtle: colors.subtle,
  placeholder: colors.placeholder,
  divider: colors.divider,
  border: colors.border,
  primary: colors.primary,
  primarySoft: colors.primarySoft,
  onPrimary: colors.white,
  ai: colors.ai,
  aiSoft: colors.aiSoft,
  accent: colors.primary,
};

/** Tema alternativo de alto contraste (tela B2). */
const HC: Theme['c'] = {
  bg: highContrast.background,
  card: highContrast.background,
  surface: '#111111',
  ink: highContrast.border,
  title: highContrast.foreground,
  text: highContrast.foreground,
  muted: highContrast.foreground,
  subtle: '#e5e5e5',
  placeholder: '#bbbbbb',
  divider: '#555555',
  border: highContrast.border,
  primary: highContrast.primary,
  primarySoft: '#111111',
  onPrimary: highContrast.foreground,
  ai: '#4b2a8a',
  aiSoft: '#111111',
  accent: highContrast.accent,
};

const HC_RISK: (typeof risk)[RiskLevel] = {
  solid: highContrast.background,
  soft: highContrast.background,
  border: highContrast.border,
  strong: highContrast.accent,
  chip: highContrast.border,
  highlight: '#333333',
};

export function useTheme(): Theme {
  const { settings } = useSettings();
  const hc = settings.highContrast;
  const scale = settings.largeText ? settings.textScale : 1;
  return useMemo<Theme>(
    () => ({
      hc,
      scale,
      fs: (n: number) => Math.round(n * scale),
      c: hc ? HC : LIGHT,
      risk: (level) =>
        hc ? { ...HC_RISK, solid: level === 'high' ? highContrast.danger : level === 'attention' ? highContrast.warning : level === 'low' ? highContrast.success : '#333333' } : risk[level],
    }),
    [hc, scale],
  );
}

export const FONT = {
  regular: 'Asap_400Regular',
  medium: 'Asap_500Medium',
  semibold: 'Asap_600SemiBold',
  bold: 'Asap_700Bold',
  heavy: 'Asap_800ExtraBold',
} as const;

export type FontWeight = keyof typeof FONT;
