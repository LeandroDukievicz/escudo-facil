import styles from './Phone.module.css';

interface PhoneProps {
  children: React.ReactNode;
  /** Variação escura (Modo "Não me pressione" / alto contraste). */
  tone?: 'light' | 'calm' | 'contrast';
  label?: string;
  className?: string;
}

/** Moldura de celular no estilo do wireframe (320px, borda 2px, raio 30). */
export function Phone({ children, tone = 'light', label, className }: PhoneProps) {
  return (
    <figure className={`${styles.phone} ${styles[tone]} ${className ?? ''}`} aria-label={label}>
      <div className={styles.status} aria-hidden="true">
        <span>9:41</span>
        <span>▮▮▮ 100%</span>
      </div>
      <div className={styles.screen}>{children}</div>
    </figure>
  );
}
