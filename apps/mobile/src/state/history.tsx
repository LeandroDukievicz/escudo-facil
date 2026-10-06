import type { AnalysisKind, RiskLevel } from '@escudo/core';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readArray, removeKeys, writeJson } from './storage';

/** Histórico LOCAL — fica apenas neste celular (F1). */
export interface HistoryEntry {
  id: string;
  kind: AnalysisKind | 'print';
  level: RiskLevel;
  title: string;
  /** Trecho curto e já mascarado do que foi verificado. */
  preview: string;
  signals: string[];
  createdAt: string;
  /** Marcado como "prova" (Salvar prova). */
  evidence?: boolean;
}

const KEY = 'escudo:history';
const MAX = 200;

interface Ctx {
  entries: HistoryEntry[];
  add: (e: Omit<HistoryEntry, 'id' | 'createdAt'>) => HistoryEntry;
  markEvidence: (id: string) => void;
  clear: () => Promise<void>;
}

const HistoryContext = createContext<Ctx | null>(null);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    readArray<HistoryEntry>(KEY).then(setEntries);
  }, []);

  const persist = (next: HistoryEntry[]) => {
    void writeJson(KEY, next);
    return next;
  };

  const add = useCallback<Ctx['add']>((e) => {
    const entry: HistoryEntry = {
      ...e,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => persist([entry, ...prev].slice(0, MAX)));
    return entry;
  }, []);

  const markEvidence = useCallback((id: string) => {
    setEntries((prev) => persist(prev.map((x) => (x.id === id ? { ...x, evidence: true } : x))));
  }, []);

  const clear = useCallback(async () => {
    setEntries([]);
    await removeKeys([KEY]);
  }, []);

  const value = useMemo(() => ({ entries, add, markEvidence, clear }), [entries, add, markEvidence, clear]);
  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): Ctx {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory precisa estar dentro de <HistoryProvider>');
  return ctx;
}

/** "Hoje, 14:20" · "Ontem, 19:05" · "2 dias atrás". */
export function relativeDate(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const hm = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (days <= 0) return `Hoje, ${hm}`;
  if (days === 1) return `Ontem, ${hm}`;
  if (days < 30) return `${days} dias atrás`;
  return d.toLocaleDateString('pt-BR');
}
