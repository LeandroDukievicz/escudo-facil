import { colors, highContrast, radii, risk } from '@escudo/tokens';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * Converte os tokens compartilhados em variáveis CSS, para que landing e
 * app mobile usem exatamente a mesma paleta.
 */
export function buildCssVars(): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(colors)) lines.push(`--c-${kebab(k)}:${v}`);
  for (const [level, palette] of Object.entries(risk)) {
    for (const [k, v] of Object.entries(palette)) lines.push(`--risk-${level}-${k}:${v}`);
  }
  for (const [k, v] of Object.entries(radii)) lines.push(`--r-${k}:${v}px`);
  const hc = Object.entries(highContrast).map(([k, v]) => `--hc-${kebab(k)}:${v}`);
  return `:root{${lines.join(';')};${hc.join(';')}}`;
}
