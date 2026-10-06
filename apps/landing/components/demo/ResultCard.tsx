'use client';

import { LEVEL_COPY, SHARE_MESSAGE, type AnalysisResult } from '@escudo/core';
import { useState } from 'react';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { RiskMeter } from '../RiskMeter';
import styles from './ResultCard.module.css';

function actionIcon(a: string) {
  const t = a.toLowerCase();
  if (t.includes('ligue') || t.includes('telefone')) return '📞';
  if (t.includes('familiar') || t.includes('pessoa de confiança')) return '👨‍👩‍👧';
  if (t.includes('oficial')) return '🏛️';
  if (t.includes('senha') || t.includes('código')) return '🔒';
  return '🚫';
}

function toSpeech(r: AnalysisResult) {
  const parts = [r.title + '.', r.summary];
  if (r.signals.length) parts.push('Sinais encontrados: ' + r.signals.map((s) => s.label).join('. ') + '.');
  parts.push('O que fazer agora: ' + r.actions.join('. ') + '.');
  return parts.join(' ');
}

export function ResultCard({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const [speaking, setSpeaking] = useState(false);
  const copy = LEVEL_COPY[result.level];
  const lvl = result.level;

  const share = async () => {
    const text = `${SHARE_MESSAGE}\n\nResultado do Escudo Fácil: ${result.title}.\n${result.signals
      .map((s) => `• ${s.label}`)
      .join('\n')}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Escudo Fácil', text });
        return;
      } catch {
        /* usuário cancelou: cai para o WhatsApp */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(toSpeech(result));
      setSpeaking(true);
    }
  };

  return (
    <div className={styles.card} role="status" aria-live="polite">
      <div
        className={styles.head}
        style={{ background: `var(--risk-${lvl}-soft)`, borderColor: `var(--risk-${lvl}-border)` }}
      >
        <span className={styles.icon} style={{ background: `var(--risk-${lvl}-solid)` }} aria-hidden="true">
          {copy.icon}
        </span>
        <h3 style={{ color: `var(--risk-${lvl}-strong)` }}>{result.title}</h3>
        {lvl === 'high' && copy.reminder && (
          <p className={styles.headline} style={{ color: `var(--risk-${lvl}-strong)` }}>
            {copy.reminder}
          </p>
        )}
        <RiskMeter level={lvl} />
        <span className="visually-hidden">Nível: {copy.short}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.summary}>{result.summary}</p>

        {result.signals.length > 0 && (
          <div>
            <h4>Sinais encontrados</h4>
            <ul className={styles.list}>
              {result.signals.map((s) => (
                <li key={s.id}>
                  <span style={{ color: `var(--risk-${lvl === 'low' ? 'attention' : lvl}-solid)` }} aria-hidden="true">
                    {lvl === 'high' ? '●' : '⚠'}
                  </span>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.checked.length > 0 && (
          <div>
            <h4>O que foi analisado</h4>
            <ul className={styles.list}>
              {result.checked.map((c) => (
                <li key={c}>
                  <span style={{ color: 'var(--risk-low-solid)' }} aria-hidden="true">
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lvl === 'low' && copy.reminder && (
          <p className={styles.reminder}>
            <strong>Continue atento.</strong> {copy.reminder.replace('Continue atento. ', '')}
          </p>
        )}

        {result.notice && (
          <p className={styles.reminder}>
            <span aria-hidden="true">📶</span> {result.notice}
          </p>
        )}

        <div>
          <h4>O que fazer agora</h4>
          <ul className={styles.list}>
            {result.actions.map((a) => (
              <li key={a}>
                <span aria-hidden="true">{actionIcon(a)}</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        <details className={styles.details}>
          <summary>Ver detalhes técnicos</summary>
          <dl>
            {result.technical.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>{t.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>

      <div className={styles.actions}>
        {lvl === 'high' ? (
          <p className={`${styles.stop}`}>🚫 Não clique nesse link</p>
        ) : null}
        <div className={styles.row}>
          <button type="button" className="btn btn-primary" onClick={share}>
            👨‍👩‍👧 Mandar para familiar
          </button>
          {canSpeak() && (
            <button type="button" className="btn btn-ghost" onClick={toggleSpeech} aria-pressed={speaking}>
              {speaking ? '⏸ Parar leitura' : '🔊 Ouvir resultado'}
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Nova análise
          </button>
        </div>
      </div>
    </div>
  );
}
