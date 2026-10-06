'use client';

import { useEffect, useState } from 'react';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import styles from './A11yBar.module.css';

const SCALES = [1, 1.15, 1.3];
const KEY = 'escudo:a11y';

interface Prefs {
  scale: number;
  contrast: boolean;
}

function load(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { scale: 1, contrast: false, ...JSON.parse(raw) };
  } catch {
    /* armazenamento indisponível: usa padrão */
  }
  return { scale: 1, contrast: false };
}

/** Lê os títulos e textos principais da seção visível. */
function readVisibleSection(): string {
  const sections = Array.from(document.querySelectorAll('main section'));
  const mid = window.innerHeight / 2;
  const current =
    sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    }) ?? sections[0];
  if (!current) return '';
  return Array.from(current.querySelectorAll('h1, h2, h3, p, li'))
    .map((el) => el.textContent?.trim())
    .filter(Boolean)
    .slice(0, 14)
    .join('. ');
}

/**
 * Barra de acessibilidade sempre visível (sem menu escondido):
 * texto grande, alto contraste e ler em voz alta.
 */
export function A11yBar() {
  const [prefs, setPrefs] = useState<Prefs>({ scale: 1, contrast: false });
  const [speaking, setSpeaking] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);

  useEffect(() => {
    setPrefs(load());
    setVoiceOk(canSpeak());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--text-scale', String(prefs.scale));
    if (prefs.contrast) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignora */
    }
  }, [prefs]);

  const nextScale = () => {
    const i = SCALES.indexOf(prefs.scale);
    setPrefs((p) => ({ ...p, scale: SCALES[(i + 1) % SCALES.length] ?? 1 }));
  };

  const toggleVoice = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speak(readVisibleSection());
    setSpeaking(true);
  };

  return (
    <div className={styles.bar} role="toolbar" aria-label="Acessibilidade">
      <button type="button" onClick={nextScale} aria-label={`Tamanho do texto: ${Math.round(prefs.scale * 100)}%`}>
        <span aria-hidden="true">🔠</span>
        <span>{prefs.scale > 1 ? `Texto ${Math.round(prefs.scale * 100)}%` : 'Texto A+'}</span>
      </button>
      <button
        type="button"
        aria-pressed={prefs.contrast}
        aria-label="Alto contraste"
        onClick={() => setPrefs((p) => ({ ...p, contrast: !p.contrast }))}
      >
        <span aria-hidden="true">🌗</span>
        <span>Contraste</span>
      </button>
      {voiceOk && (
        <button type="button" aria-pressed={speaking} onClick={toggleVoice}>
          <span aria-hidden="true">{speaking ? '⏸' : '🔊'}</span>
          <span>{speaking ? 'Parar' : 'Ouvir'}</span>
        </button>
      )}
    </div>
  );
}
