import styles from './HomeScreenMock.module.css';

/** Réplica da tela B1 (Home, versão clara) do wireframe. */
export function HomeScreenMock() {
  return (
    <div className={styles.screen} aria-hidden="true">
      <div className={styles.top}>
        <span className={styles.brand}>
          <span className={styles.mark}>🛡️</span>Escudo Fácil
        </span>
        <span className={styles.voice}>🔊</span>
      </div>
      <p className={styles.greet}>
        O que você quer
        <br />
        verificar?
      </p>
      <div className={styles.cards}>
        <div className={styles.card} style={{ background: 'var(--c-primary-soft)' }}>
          <span className={styles.icon}>🔗</span>
          <div>
            <strong>Verificar link</strong>
            <small>Cole um link sem abrir</small>
          </div>
        </div>
        <div className={styles.card} style={{ background: 'var(--risk-low-soft)' }}>
          <span className={styles.icon}>🖼️</span>
          <div>
            <strong>Verificar print</strong>
            <small>Mande a foto da conversa</small>
          </div>
        </div>
        <div className={styles.card} style={{ background: 'var(--risk-attention-soft)' }}>
          <span className={styles.icon}>💬</span>
          <div>
            <strong>Recebi proposta suspeita</strong>
            <small>A gente pergunta, você responde</small>
          </div>
        </div>
        <div className={styles.family}>👨‍👩‍👧 Pedir ajuda para familiar</div>
      </div>
      <div className={styles.tabs}>
        <span className={styles.active}>🏠<br />Início</span>
        <span>🕘<br />Histórico</span>
        <span>📚<br />Aprender</span>
        <span>❓<br />Ajuda</span>
      </div>
    </div>
  );
}
