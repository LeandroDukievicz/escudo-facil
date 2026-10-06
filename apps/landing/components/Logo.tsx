import styles from './Logo.module.css';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <span className={styles.mark} aria-hidden="true">
        🛡️
      </span>
      <span className={styles.name}>Escudo Fácil</span>
    </span>
  );
}
