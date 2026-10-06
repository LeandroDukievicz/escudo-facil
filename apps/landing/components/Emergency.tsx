import { EMERGENCY_STEPS, PIX_GUIDANCE } from '@escudo/core';
import styles from './Emergency.module.css';

export function Emergency() {
  return (
    <section id="emergencia" className="section" aria-labelledby="sos-title">
      <div className="container">
        <div className={styles.card} data-hc="surface">
          <div className={styles.head}>
            <span aria-hidden="true">🆘</span>
            <div>
              <h2 id="sos-title">Acho que caí em golpe. O que faço agora?</h2>
              <p>
                Respire. Isso acontece com muita gente — e não é culpa sua. Faça uma coisa de cada vez.
                <span className={`badge badge-free ${styles.badge}`}>SEMPRE GRÁTIS</span>
              </p>
            </div>
          </div>
          <div className={styles.body}>
            <ol className={styles.steps}>
              {EMERGENCY_STEPS.map((s, i) => (
                <li key={s}>
                  <span aria-hidden="true">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className={styles.side}>
              <details className={styles.pix} open>
                <summary>💸 Fiz um Pix para o golpista</summary>
                <ul>
                  {PIX_GUIDANCE.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </details>
              <div className={styles.tool}>
                <h3>📄 No app: &ldquo;Gerar lista do que aconteceu&rdquo;</h3>
                <p>
                  O app monta um resumo do caso (o que houve, canal, valor, sinais e provas) para levar ao banco e ao
                  boletim de ocorrência — e permite apagar dados sensíveis do celular depois.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
