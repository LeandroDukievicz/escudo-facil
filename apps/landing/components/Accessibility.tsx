import { Phone } from './Phone';
import styles from './Accessibility.module.css';

const FEATURES = [
  { icon: '🔠', title: 'Texto grande', text: 'Ajuste o tamanho do texto. Nada de letra miúda em áreas importantes.' },
  { icon: '🌗', title: 'Alto contraste', text: 'Fundo preto, letras brancas e amarelas. Experimente na barra abaixo.' },
  { icon: '🔊', title: 'Ler em voz alta', text: 'O app lê o resultado e o passo a passo para você.' },
  { icon: '👆', title: 'Botões grandes', text: 'Todo botão tem pelo menos 48px. Sem gestos complicados.' },
  { icon: '🔍', title: 'Leitor de tela', text: 'Tudo descrito para TalkBack e VoiceOver.' },
  { icon: '✋', title: 'Confirmação', text: 'O app sempre pergunta antes de apagar ou compartilhar.' },
];

export function Accessibility() {
  return (
    <section id="acessibilidade" className="section" aria-labelledby="a11y-title">
      <div className={`container ${styles.grid}`}>
        <Phone tone="contrast" label="Tela inicial em alto contraste com texto grande">
          <div className={styles.hc} aria-hidden="true">
            <div className={styles.hcTop}>
              <span>🛡️ Escudo Fácil</span>
              <span>🔊</span>
            </div>
            <p className={styles.hcTitle}>O que você quer verificar?</p>
            <div className={styles.hcCards}>
              <div style={{ background: 'var(--hc-primary)' }}>🔗 Verificar link</div>
              <div style={{ background: 'var(--hc-success)' }}>🖼️ Verificar print</div>
              <div style={{ background: 'var(--hc-warning)' }}>💬 Proposta suspeita</div>
            </div>
            <div className={styles.hcTabs}>
              <span className={styles.on}>🏠<br />Início</span>
              <span>🕘<br />Histórico</span>
              <span>📚<br />Aprender</span>
              <span>❓<br />Ajuda</span>
            </div>
          </div>
        </Phone>
        <div>
          <span className="eyebrow">Feito para quem tem dificuldade</span>
          <h2 id="a11y-title" className="section-title">
            Tão simples que dá para usar sem tutorial.
          </h2>
          <p className="section-lead">
            Frases curtas, linguagem sem jargão e risco sempre mostrado por cor, ícone e texto ao mesmo tempo.
          </p>
          <ul className={styles.list}>
            {FEATURES.map((f) => (
              <li key={f.title} data-hc="surface">
                <span aria-hidden="true">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
