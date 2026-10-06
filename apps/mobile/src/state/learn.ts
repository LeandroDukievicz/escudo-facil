import { useCallback, useEffect, useState } from 'react';
import { readArray, writeJson } from './storage';

const KEY = 'escudo:learned';

/** Checklist de aprendizado: cards marcados com "Entendi". */
export function useLearned() {
  const [learned, setLearned] = useState<string[]>([]);
  const reload = useCallback(() => {
    void readArray<string>(KEY).then(setLearned);
  }, []);
  useEffect(reload, [reload]);
  const markLearned = useCallback((id: string) => {
    setLearned((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      void writeJson(KEY, next);
      return next;
    });
  }, []);
  return { learned, markLearned, reload };
}
