import { Logo } from './Logo';
import styles from './Header.module.css';

export const NAV = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#experimente', label: 'Experimente' },
  { href: '#familia', label: 'Família' },
  { href: '#privacidade', label: 'Privacidade' },
  { href: '#planos', label: 'Planos' },
];

export function Header() {
  return (
    <header className={styles.header} data-hc="surface">
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.brand} aria-label="Escudo Fácil — início">
          <Logo />
        </a>
        {/* Navegação sempre visível (sem menu escondido): rola na horizontal no celular. */}
        <nav aria-label="Seções da página" className={styles.nav}>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#baixar" className={`btn btn-primary ${styles.cta}`}>
          Baixar o app
        </a>
      </div>
    </header>
  );
}
