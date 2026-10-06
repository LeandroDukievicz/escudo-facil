export const fonts = {
  /** Sans-serif extremamente legível usada em todo o app. */
  body: 'Asap',
  /** Fonte "à mão" usada só em anotações/destaques da landing. */
  hand: 'Gaegu',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

/**
 * Escala de tamanhos (px). O app nunca usa menos que `xs` em áreas
 * críticas; o modo "texto grande" multiplica tudo por `largeTextScale`.
 */
export const fontSizes = {
  xs: 12,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 25,
  display: 32,
} as const;

export const largeTextScale = { min: 1, default: 1, max: 1.5 } as const;
