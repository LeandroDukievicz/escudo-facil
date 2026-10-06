import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from './storage';

export interface Settings {
  onboarded: boolean;
  largeText: boolean;
  /** 1 a 1.5 — slider "Tamanho do texto" (A3). */
  textScale: number;
  highContrast: boolean;
  /** Ler resultados em voz alta automaticamente. */
  voice: boolean;
  /** Ocultar CPF/telefone/e-mail automaticamente nos prints (D1). */
  autoMask: boolean;
  /** Contato de confiança salvo no aparelho (B3). */
  trustedContact?: { name: string; relation: string; phone?: string };
}

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  largeText: false,
  textScale: 1.2,
  highContrast: false,
  voice: false,
  autoMask: true,
};

const KEY = 'escudo:settings';

interface Ctx {
  settings: Settings;
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readJson(KEY, DEFAULT_SETTINGS).then((s) => {
      setSettings(s);
      setReady(true);
    });
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void writeJson(KEY, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, onboarded: true });
    void writeJson(KEY, { ...DEFAULT_SETTINGS, onboarded: true });
  }, []);

  const value = useMemo(() => ({ settings, ready, update, reset }), [settings, ready, update, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings precisa estar dentro de <SettingsProvider>');
  return ctx;
}
