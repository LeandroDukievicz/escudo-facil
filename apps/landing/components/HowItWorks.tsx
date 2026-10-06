import { IDEAL_FLOW } from '@escudo/core';
import styles from './HowItWorks.module.css';

const ACTIONS = [
  {
    icon: '🔗',
    title: 'Verificar link',
    text: 'Cole o link que você recebeu. O app analisa o endereço sem abrir a página e explica o risco em palavras simples.',
    tone: 'var(--c-primary-soft)',
    badges: ['GRÁTIS', 'OFFLINE'],
  },
  {
    icon: '🖼️',
    title: 'Verificar print',
    text: 'Mande a foto da conversa. O app lê o texto no próprio celular e destaca pedidos de Pix, senha, pressa e ameaças.',
    tone: 'var(--risk-low-soft)',
    badges: ['GRÁTIS', 'OCR OFFLINE'],
  },
  {
    icon: '💬',
    title: 'Recebi uma proposta suspeita',
    text: 'Responda até 8 perguntas com Sim, Não ou Não sei. No fim, você recebe uma nota de risco e o que fazer agora.',
    tone: 'var(--risk-attention-soft)',
    badges: ['GRÁTIS', 'OFFLINE'],
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section" aria-labelledby="how-title">
      <div className="container">
        <span className="eyebrow">Vamos verificar juntos.</span>
        <h2 id="how-title" className="section-title">
          Três botões grandes. Nenhum menu complicado.
        </h2>
        <p className="section-lead">
          Abriu o app, já pode usar — sem criar conta, sem tutorial. Tudo pensado para quem tem pressa, medo de
          errar ou pouca intimidade com o celular.
        </p>

        <ul className={styles.cards}>
          {ACTIONS.map((a) => (
            <li key={a.title} className={styles.card} style={{ background: a.tone }} data-hc="surface">
              <span className={styles.icon} aria-hidden="true">
                {a.icon}
              </span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <div className={styles.badges}>
                {a.badges.map((b) => (
                  <span key={b} className={`badge ${b === 'GRÁTIS' ? 'badge-free' : 'badge-offline'}`}>
                    {b}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.flow} data-hc="surface">
          <h3 className={styles.flowTitle}>
            <span aria-hidden="true">✅</span> A experiência ideal, em 7 passos
          </h3>
          <ol className={styles.steps}>
            {IDEAL_FLOW.map((step, i) => (
              <li key={step}>
                <span className={styles.num} aria-hidden="true">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
