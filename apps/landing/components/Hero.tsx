import { HomeScreenMock } from './HomeScreenMock';
import { Phone } from './Phone';
import styles from './Hero.module.css';

const TRUST = [
  { icon: '🔓', text: 'Sem cadastro' },
  { icon: '📵', text: 'Funciona sem internet' },
  { icon: '🚫', text: 'Nunca abre o link' },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">Pare um pouco antes de agir.</span>
          <h1 id="hero-title" className={styles.title}>
            Antes de clicar, <span className={styles.mark}>verifique.</span>
          </h1>
          <p className={styles.lead}>
            Analise links, prints e mensagens suspeitas em poucos segundos. O Escudo Fácil não acusa: ele
            orienta — e mostra exatamente o que fazer.
          </p>
          <div className={styles.actions}>
            <a href="#experimente" className="btn btn-primary">
              Experimentar agora
            </a>
            <a href="#como-funciona" className="btn btn-link">
              Como funciona?
            </a>
          </div>
          <ul className={styles.trust} aria-label="Garantias do app">
            {TRUST.map((t) => (
              <li key={t.text}>
                <span aria-hidden="true">{t.icon}</span> {t.text}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.visual}>
          <div className={styles.note} aria-hidden="true">
            só 3 botões grandes ↓
          </div>
          <Phone label="Tela inicial do app Escudo Fácil">
            <HomeScreenMock />
          </Phone>
          <div className={styles.bubble} aria-hidden="true">
            <span>🛑</span>
            <div>
              <strong>Alto risco de golpe</strong>
              <small>Não clique · Não pague</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
