import type { RiskLevel } from '@escudo/core';
import { LEVEL_COPY } from '@escudo/core';
import styles from './RiskMeter.module.css';

/** Barrinhas do semáforo (1, 2 ou 3 preenchidas). Sempre acompanhadas de texto. */
export function RiskMeter({ level }: { level: RiskLevel }) {
  const filled = LEVEL_COPY[level].meter;
  return (
    <span className={styles.meter} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ background: i < filled ? `var(--risk-${level}-solid)` : 'var(--c-divider)' }} />
      ))}
    </span>
  );
}
