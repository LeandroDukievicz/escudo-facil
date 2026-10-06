import type { AnalysisResult, Highlight, ScamType, scoreQuestionnaire } from '@escudo/core';
import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Estado da análise em andamento, compartilhado entre as telas de um
 * fluxo (entrada → carregando → resultado). Fica só em memória.
 */
export interface LinkSession {
  input: string;
  result: AnalysisResult;
  historyId?: string;
}

export interface PrintSession {
  imageUri?: string;
  /** Texto extraído (OCR) ou colado. */
  text: string;
  maskedText?: string;
  result?: AnalysisResult;
  highlights?: Highlight[];
  explanation?: string[];
  scamType?: ScamType;
  pressure?: boolean;
  historyId?: string;
}

export type QuestionnaireResult = ReturnType<typeof scoreQuestionnaire>;

interface Ctx {
  link?: LinkSession;
  setLink: (s?: LinkSession) => void;
  print?: PrintSession;
  setPrint: (s?: PrintSession) => void;
  questionnaire?: QuestionnaireResult & { historyId?: string };
  setQuestionnaire: (s?: QuestionnaireResult & { historyId?: string }) => void;
}

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [link, setLink] = useState<LinkSession>();
  const [print, setPrint] = useState<PrintSession>();
  const [questionnaire, setQuestionnaire] = useState<Ctx['questionnaire']>();
  const value = useMemo(
    () => ({ link, setLink, print, setPrint, questionnaire, setQuestionnaire }),
    [link, print, questionnaire],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Ctx {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return ctx;
}
