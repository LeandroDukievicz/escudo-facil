import { SHARE_MESSAGE } from '@escudo/core';
import { Phone } from './Phone';
import styles from './Family.module.css';

export function Family() {
  return (
    <section id="familia" className="section" aria-labelledby="family-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <span className="eyebrow">Você não está sozinho.</span>
          <h2 id="family-title" className="section-title">
            Na dúvida, chame alguém de confiança — com um toque.
          </h2>
          <p className="section-lead">
            Filhos, netos e cuidadores podem ajudar sem precisar estar do lado. A pessoa manda a análise pelo
            WhatsApp com uma mensagem pronta, e ninguém precisa criar conta para isso.
          </p>

          <div className={styles.cols}>
            <div className={styles.col} data-hc="surface">
              <div className={styles.colHead}>
                <h3>Pedir ajuda</h3>
                <span className="badge badge-free">GRÁTIS · SEM LOGIN</span>
              </div>
              <ul>
                <li>Compartilhar o resultado pelo WhatsApp</li>
                <li>Escolher um contato de confiança</li>
                <li>Mensagem pronta, sem precisar digitar</li>
              </ul>
            </div>
            <div className={`${styles.col} ${styles.plus}`} data-hc="surface">
              <div className={styles.colHead}>
                <h3>Modo Família</h3>
                <span className="badge badge-plus">PLUS</span>
                <span className="badge badge-login">LOGIN</span>
              </div>
              <ul>
                <li>Familiar recebe alerta quando algo é marcado como &ldquo;muito suspeito&rdquo;</li>
                <li>Relatório mensal para a família (opcional)</li>
                <li>
                  <b>Só com consentimento dos dois</b> — o familiar precisa aceitar o convite
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Phone label="Tela 'Pedir ajuda' do app">
          <div className={styles.screen} aria-hidden="true">
            <p className={styles.screenTitle}>
              <span>‹</span> Pedir ajuda
            </p>
            <p className={styles.screenText}>
              Você pode mandar essa análise para alguém de confiança verificar com você.
            </p>
            <div className={styles.message}>
              <small>Mensagem pronta</small>
              &ldquo;{SHARE_MESSAGE}&rdquo;
            </div>
            <small className={styles.pick}>Escolher contato de confiança</small>
            <div className={styles.contacts}>
              <div className={styles.contact}>
                👩 Filha
                <small>Ana</small>
              </div>
              <div className={`${styles.contact} ${styles.add}`}>
                ＋<small>Adicionar</small>
              </div>
            </div>
            <div className={styles.spacer} />
            <div className={styles.send}>💬 Enviar pelo WhatsApp</div>
            <small className={styles.foot}>Modo Família com alertas → exige login (Plus)</small>
          </div>
        </Phone>
      </div>
    </section>
  );
}
