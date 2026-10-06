/** Semáforo anti-golpe. Nunca existe um nível "seguro". */
export type RiskLevel = 'low' | 'attention' | 'high' | 'unknown';

/** Peso de cada sinal na decisão final. */
export type Severity = 'weak' | 'medium' | 'strong';

export type SignalCategory =
  | 'shortener'
  | 'lookalike'
  | 'typo'
  | 'strange-chars'
  | 'structure'
  | 'insecure'
  | 'suspicious-tld'
  | 'ip-host'
  | 'urgency'
  | 'money'
  | 'credentials'
  | 'documents'
  | 'authority'
  | 'threat'
  | 'promise'
  | 'secrecy'
  | 'remote-access'
  | 'family-impostor'
  | 'hidden-link'
  | 'questionnaire';

export interface Signal {
  /** Identificador estável (útil para testes e analytics). */
  id: string;
  category: SignalCategory;
  severity: Severity;
  /** Frase curta em linguagem simples, sem jargão. */
  label: string;
  /** Trecho que motivou o sinal, quando houver. */
  excerpt?: string;
}

/** Linha de "Ver detalhes técnicos" — o único lugar onde jargão é permitido. */
export interface TechnicalDetail {
  label: string;
  value: string;
}

export type AnalysisMode = 'local' | 'ai';

export type AnalysisKind = 'link' | 'text' | 'questionnaire' | 'checklist';

export interface AnalysisResult {
  kind: AnalysisKind;
  level: RiskLevel;
  /** Título simples: "Alto risco de golpe", "Atenção: sinais suspeitos"... */
  title: string;
  /** Explicação em até 2 frases. */
  summary: string;
  /** No máximo 5 motivos, do mais forte para o mais fraco. */
  signals: Signal[];
  /** Para resultados de baixo risco: o que foi verificado. */
  checked: string[];
  /** Lista "O que fazer agora". */
  actions: string[];
  technical: TechnicalDetail[];
  mode: AnalysisMode;
  /** ISO 8601. */
  analyzedAt: string;
  /** Aviso de modo offline / análise básica, quando aplicável. */
  notice?: string;
}

/** Trecho de texto destacado na tela de resultado do print. */
export interface Highlight {
  start: number;
  end: number;
  category: SignalCategory;
  text: string;
}
