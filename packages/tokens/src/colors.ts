/**
 * Paleta extraída do wireframe (docs/design/wireframe.dc.html).
 * Regra de acessibilidade: risco nunca é comunicado só por cor —
 * sempre cor + ícone + texto.
 */
export const colors = {
  // Base
  ink: '#1f2a37', // bordas e contornos fortes
  title: '#16263a',
  text: '#34404d',
  muted: '#52606d',
  subtle: '#6b7280',
  placeholder: '#9aa5b1',
  white: '#ffffff',
  surface: '#f7f9fb',
  divider: '#dfe5ec',
  track: '#cbd5e1',
  border: '#c7cfd9',
  canvas: '#e8eaed',

  // Azul confiança (ação principal)
  primary: '#2563a8',
  primarySoft: '#e9f1fb',
  primaryBorder: '#a9c6e8',

  // Roxo — telas que usam IA
  ai: '#6d4ea8',
  aiSoft: '#efe9f7',
  aiBorder: '#c8b6e2',
  aiHighlight: '#e3d7f5',

  // Modo "Não me pressione" / leitura em voz alta
  calm: '#0b2740',
  calmText: '#cfe0f0',
  calmAccent: '#6fa8e0',
  calmLink: '#9fc2e6',
  calmHighlight: '#ffd97a',

  // Post-it de anotações
  note: '#fef4a8',
  noteTitle: '#5a4a00',
  noteText: '#4a4310',
} as const;

export type RiskLevel = 'low' | 'attention' | 'high' | 'unknown';

/** Cores do semáforo anti-golpe. */
export const risk: Record<
  RiskLevel,
  {
    solid: string;
    soft: string;
    border: string;
    strong: string; // texto de título sobre fundo `soft`
    chip: string; // borda leve de selos/chips
    highlight: string; // marca-texto em trechos destacados
  }
> = {
  low: {
    solid: '#1f9d57',
    soft: '#e8f6ee',
    border: '#1f9d57',
    strong: '#0d6b35',
    chip: '#a7ddbd',
    highlight: '#d4f0df',
  },
  attention: {
    solid: '#e7b200',
    soft: '#fdf4dc',
    border: '#d9a300',
    strong: '#8a6100',
    chip: '#e7d08a',
    highlight: '#fff0c7',
  },
  high: {
    solid: '#d23b3b',
    soft: '#fbe9e9',
    border: '#d23b3b',
    strong: '#a02020',
    chip: '#e6b3ad',
    highlight: '#ffd5d5',
  },
  unknown: {
    solid: '#9aa5b1',
    soft: '#eef1f4',
    border: '#9aa5b1',
    strong: '#475063',
    chip: '#c7cfd9',
    highlight: '#e5e9ef',
  },
};

/** Texto sobre fundo amarelo precisa ser escuro para manter contraste. */
export const warningText = '#7a5b00';
export const dangerText = '#c0392b';
export const plusText = '#a87a00';

/** Tema alternativo de alto contraste (tela B2 do wireframe). */
export const highContrast = {
  background: '#000000',
  foreground: '#ffffff',
  accent: '#ffe14d',
  border: '#ffffff',
  primary: '#0b3d91',
  success: '#0d6b35',
  warning: '#8a6100',
  danger: '#a02020',
} as const;
