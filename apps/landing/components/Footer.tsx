import { NAV } from './Header';
import { Logo } from './Logo';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo size="sm" />
          <p>O app não acusa; ele orienta. Análise de risco no momento da verificação — nunca garantia absoluta.</p>
        </div>
        <nav aria-label="Rodapé">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="#emergencia">Caí em golpe</a>
            </li>
            <li>
              <a href="#duvidas">Dúvidas</a>
            </li>
          </ul>
        </nav>
        <p className={styles.legal}>
          Em caso de golpe, ligue para o número oficial do seu banco e registre um boletim de ocorrência. ©{' '}
          {new Date().getFullYear()} Escudo Fácil.
        </p>
      </div>
    </footer>
  );
}
