import { PRESSURE_MODE } from '@escudo/core';
import styles from './NoPressure.module.css';

export function NoPressure() {
  return (
    <section className={styles.wrap} aria-labelledby="pressure-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.breath} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.label}>
            inspire
            <br />e expire
          </span>
        </div>
        <div>
          <span className={styles.eyebrow}>Modo &ldquo;Não me pressione&rdquo;</span>
          <h2 id="pressure-title" className={styles.title}>
            {PRESSURE_MODE.title.split('\n').map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className={styles.body}>
            Golpes usam <b>pressa</b> para impedir você de pensar. Quando a mensagem tenta gerar urgência — &ldquo;último
            aviso&rdquo;, &ldquo;sua conta será bloqueada&rdquo; — o app desacelera tudo e lembra: você tem o direito de
            checar com calma.
          </p>
          <ul className={styles.list}>
            <li>🌬️ Uma pausa guiada para respirar</li>
            <li>🏛️ {PRESSURE_MODE.primary}</li>
            <li>👨‍👩‍👧 {PRESSURE_MODE.secondary}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
