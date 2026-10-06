export const radii = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
  phone: 30,
  pill: 999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 9,
  md: 12,
  lg: 14,
  xl: 18,
  xxl: 22,
  xxxl: 30,
} as const;

/** Alturas mínimas de alvo de toque (nunca menos de 48). */
export const touch = {
  min: 48,
  button: 52,
  primary: 56,
  hero: 58,
  answer: 60,
} as const;

export const borderWidth = {
  thin: 1,
  regular: 2,
  strong: 3,
} as const;
