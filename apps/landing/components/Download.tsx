import { Logo } from './Logo';
import styles from './Download.module.css';

export function Download() {
  return (
    <section id="baixar" className={styles.wrap} aria-labelledby="download-title">
      <div className={`container ${styles.inner}`}>
        <Logo size="lg" />
        <h2 id="download-title" className={styles.title}>
          Recebeu algo estranho? Pare. Verifique. Peça ajuda.
        </h2>
        <p className={styles.lead}>
          O app para Android e iPhone está chegando. Enquanto isso, use a verificação gratuita aqui na página — ela
          funciona igualzinho à análise básica do app.
        </p>
        <div className={styles.stores}>
          <span className={styles.store} aria-disabled="true">
            <span aria-hidden="true">▶</span>
            <span>
              <small>Em breve no</small>Google Play
            </span>
          </span>
          <span className={styles.store} aria-disabled="true">
            <span aria-hidden="true"></span>
            <span>
              <small>Em breve na</small>App Store
            </span>
          </span>
        </div>
        <a href="#experimente" className="btn btn-success">
          Verificar agora, grátis
        </a>
      </div>
    </section>
  );
}
