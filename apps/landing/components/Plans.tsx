import { PLANS } from '@escudo/core';
import styles from './Plans.module.css';

export function Plans() {
  return (
    <section id="planos" className={`section ${styles.wrap}`} aria-labelledby="plans-title">
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Ética primeiro, boleto depois.</span>
          <h2 id="plans-title" className="section-title">
            Você pode continuar grátis.
          </h2>
          <p className="section-lead">
            O plano pago adiciona mais proteção, mas <b>não é obrigatório</b>. Sem medo para vender, sem cobrança
            escondida e com cancelamento livre. Login só aparece aqui, no Modo Família e no histórico na nuvem.
          </p>
        </div>
        <div className={styles.grid}>
          {PLANS.map((plan) => {
            const free = plan.id === 'free';
            return (
              <article key={plan.id} className={`${styles.plan} ${free ? styles.free : styles.plus}`} data-hc="surface">
                <header>
                  <h3>
                    {plan.name}
                    {!free && ' ⭐'}
                  </h3>
                  <span className={styles.price}>{free ? plan.price : 'Em breve'}</span>
                </header>
                <div className={styles.badges}>
                  {free ? (
                    <>
                      <span className="badge badge-free">GRÁTIS</span>
                      <span className="badge badge-offline">SEM LOGIN</span>
                    </>
                  ) : (
                    <>
                      <span className="badge badge-plus">PLUS</span>
                      <span className="badge badge-login">LOGIN</span>
                      <span className="badge badge-ai">IA</span>
                    </>
                  )}
                </div>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span aria-hidden="true">{free ? '✓' : '＋'}</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#baixar" className={`btn ${free ? 'btn-primary' : 'btn-ghost'}`}>
                  {free ? 'Começar grátis' : 'Quero saber quando lançar'}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
