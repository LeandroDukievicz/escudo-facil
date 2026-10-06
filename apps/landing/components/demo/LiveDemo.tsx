'use client';

import { analyzeLink, analyzeText, type AnalysisResult, type Highlight } from '@escudo/core';
import { useEffect, useId, useRef, useState } from 'react';
import { HighlightedMessage } from './HighlightedMessage';
import { ResultCard } from './ResultCard';
import styles from './LiveDemo.module.css';

type Tab = 'link' | 'text';
type Phase = 'input' | 'loading' | 'result';

const LINK_EXAMPLES = [
  { label: 'Banco falso', value: 'http://itau-seguranca.verifique-conta.xyz/login' },
  { label: 'Link encurtado', value: 'https://bit.ly/regularize-cpf' },
  { label: 'Site oficial', value: 'https://www.gov.br/inss' },
];

const TEXT_EXAMPLES = [
  {
    label: 'Falso banco',
    value:
      'Olá, aqui é do banco. Sua conta será bloqueada hoje. Confirme o código e a senha ou faça um Pix de R$ 250 para regularizar. bit.ly/xy7',
  },
  {
    label: 'Falso parente',
    value: 'Oi mãe, troquei de número, salva esse contato. Preciso pagar um boleto urgente, me manda um pix de R$ 900?',
  },
  { label: 'Mensagem comum', value: 'Oi, tudo bem? Vamos almoçar no domingo na casa da vó? Leva a sobremesa!' },
];

const LOADING_STEPS = [
  'Analisando padrão do endereço',
  'Procurando link encurtado ou disfarçado',
  'Comparando com listas de segurança',
  'Procurando frases de pressa e pedidos de dados',
];

export function LiveDemo() {
  const [tab, setTab] = useState<Tab>('link');
  const [value, setValue] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [analyzedText, setAnalyzedText] = useState('');
  const [pressure, setPressure] = useState(false);
  const [error, setError] = useState('');
  const [canPaste, setCanPaste] = useState(false);
  const inputId = useId();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanPaste(typeof navigator !== 'undefined' && !!navigator.clipboard?.readText);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    if (step >= LOADING_STEPS.length) {
      setPhase('result');
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 380);
    return () => clearTimeout(t);
  }, [phase, step]);

  useEffect(() => {
    if (phase === 'result') resultRef.current?.focus();
  }, [phase]);

  const run = () => {
    if (!value.trim()) {
      setError(tab === 'link' ? 'Cole ou digite um link primeiro.' : 'Cole o texto da mensagem primeiro.');
      return;
    }
    setError('');
    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (tab === 'link') {
      setResult(analyzeLink(value, { offline }));
      setHighlights([]);
      setPressure(false);
    } else {
      const a = analyzeText(value, { offline });
      setResult(a.result);
      setHighlights(a.highlights);
      setPressure(a.pressure && a.result.level !== 'low');
    }
    setAnalyzedText(value);
    setStep(0);
    setPhase('loading');
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setValue(t);
    } catch {
      setError('Não conseguimos acessar a área de transferência. Toque no campo e cole manualmente.');
    }
  };

  const reset = () => {
    setPhase('input');
    setResult(null);
    setValue('');
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    reset();
    setError('');
  };

  const examples = tab === 'link' ? LINK_EXAMPLES : TEXT_EXAMPLES;

  return (
    <div className={styles.demo}>
      <div className={styles.tabs} role="tablist" aria-label="Tipo de verificação">
        <button type="button" role="tab" aria-selected={tab === 'link'} onClick={() => switchTab('link')}>
          🔗 Verificar link
        </button>
        <button type="button" role="tab" aria-selected={tab === 'text'} onClick={() => switchTab('text')}>
          💬 Verificar mensagem
        </button>
      </div>

      {phase === 'input' && (
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <label htmlFor={inputId} className={styles.label}>
            {tab === 'link' ? 'Cole aqui o link que você recebeu:' : 'Cole aqui a mensagem que você recebeu:'}
          </label>
          {tab === 'link' ? (
            <input
              id={inputId}
              className={styles.input}
              inputMode="url"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="http://..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-describedby={`${inputId}-hint`}
            />
          ) : (
            <textarea
              id={inputId}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Ex.: Sua conta será bloqueada..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-describedby={`${inputId}-hint`}
            />
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {canPaste && (
            <button type="button" className={styles.paste} onClick={paste}>
              📋 {tab === 'link' ? 'Colar link copiado' : 'Colar mensagem copiada'}
            </button>
          )}
          <p id={`${inputId}-hint`} className={styles.hint}>
            <span aria-hidden="true">🚫</span>
            <span>
              {tab === 'link' ? (
                <>
                  O app <b>não abre</b> o link durante a análise.
                </>
              ) : (
                <>
                  A análise acontece <b>no seu navegador</b>. Nada é enviado.
                </>
              )}
            </span>
          </p>
          <div className={styles.examples}>
            <span>Teste com um exemplo:</span>
            {examples.map((ex) => (
              <button key={ex.label} type="button" onClick={() => setValue(ex.value)}>
                {ex.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            {tab === 'link' ? 'Verificar sem abrir' : 'Verificar mensagem'}
          </button>
        </form>
      )}

      {phase === 'loading' && (
        <div className={styles.loading} aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.loadingTitle}>Verificando sinais de risco…</p>
          <ul>
            {LOADING_STEPS.map((s, i) => (
              <li key={s} data-state={i < step ? 'done' : i === step ? 'now' : 'todo'}>
                <span aria-hidden="true">{i < step ? '✓' : i === step ? '◐' : '○'}</span> {s}
              </li>
            ))}
          </ul>
          <p className={styles.hint2}>Sem internet? Fazemos a análise básica no aparelho.</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className={styles.result} ref={resultRef} tabIndex={-1}>
          {tab === 'text' && <HighlightedMessage text={analyzedText} highlights={highlights} />}
          {pressure && (
            <div className={styles.pressure}>
              <span aria-hidden="true">🌬️</span>
              <p>
                <strong>Respire. Não pague agora.</strong> Golpes usam pressa para impedir você de pensar.
              </p>
            </div>
          )}
          <ResultCard result={result} onReset={reset} />
        </div>
      )}
    </div>
  );
}
