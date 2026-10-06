import { LEVEL_COPY, type RiskLevel } from '@escudo/core';
import { RiskMeter } from './RiskMeter';
import styles from './TrafficLight.module.css';

const LEVELS: { level: RiskLevel; text: string }[] = [
  {
    level: 'low',
    text: 'Parece ter baixo risco agora. Mesmo assim, confirme antes de pagar ou enviar dados.',
  },
  { level: 'attention', text: 'Existem sinais suspeitos. Melhor confirmar por outro canal.' },
  { level: 'high', text: 'Não clique, não pague, não envie dados.' },
  {
    level: 'unknown',
    text: 'Não deu para confirmar. Procure a fonte oficial ou uma pessoa de confiança.',
  },
];

export function TrafficLight() {
  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="semaforo-title">
      <div className="container">
        <span className="eyebrow">O semáforo anti-golpe</span>
        <h2 id="semaforo-title" className="section-title">
          Cor, ícone e texto. Sempre juntos.
        </h2>
        <p className="section-lead">
          Quem tem dificuldade para enxergar cores também entende o resultado. E cada resposta vem com a lista
          &ldquo;O que fazer agora&rdquo;.
        </p>
        <ul className={styles.grid}>
          {LEVELS.map(({ level, text }) => {
            const copy = LEVEL_COPY[level];
            return (
              <li
                key={level}
                className={styles.card}
                style={{ background: `var(--risk-${level}-soft)`, borderColor: `var(--risk-${level}-border)` }}
                data-hc="surface"
              >
                <span
                  className={styles.icon}
                  style={{ background: `var(--risk-${level}-solid)` }}
                  aria-hidden="true"
                >
                  {copy.icon}
                </span>
                <span className={styles.short} style={{ color: `var(--risk-${level}-strong)` }}>
                  {copy.short}
                </span>
                <h3 style={{ color: `var(--risk-${level}-strong)` }}>{copy.title}</h3>
                <RiskMeter level={level} />
                <p>{text}</p>
              </li>
            );
          })}
        </ul>

        <aside className={styles.rule} aria-label="Regra de comunicação">
          <p className={styles.ruleTitle}>⚠️ A gente nunca diz &ldquo;link seguro&rdquo;.</p>
          <p>
            Golpes mudam rápido, sites podem ser invadidos depois da análise e links podem redirecionar. Por isso o
            resultado verde diz <strong>&ldquo;Nenhum sinal grave encontrado agora&rdquo;</strong> — é uma avaliação
            de risco no momento da verificação, não uma garantia.
          </p>
        </aside>
      </div>
    </section>
  );
}
