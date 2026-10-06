import { LiveDemo } from './demo/LiveDemo';
import styles from './TryIt.module.css';

export function TryIt() {
  return (
    <section id="experimente" className={`section ${styles.wrap}`} aria-labelledby="try-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">Experimente aqui mesmo</span>
          <h2 id="try-title" className="section-title">
            Recebeu algo estranho? Teste agora.
          </h2>
          <p className="section-lead">
            Esta é a mesma análise básica que o app faz no celular — rodando no seu navegador. Nada é enviado para
            a internet e o link nunca é aberto.
          </p>
          <ul className={styles.points}>
            <li>
              <span aria-hidden="true">🔍</span> Imitação de banco, governo e lojas
            </li>
            <li>
              <span aria-hidden="true">✂️</span> Links encurtados e endereços disfarçados
            </li>
            <li>
              <span aria-hidden="true">⏰</span> Frases de pressa, ameaça e promessa
            </li>
            <li>
              <span aria-hidden="true">🔑</span> Pedidos de Pix, senha, código e documentos
            </li>
          </ul>
          <div className={styles.badges}>
            <span className="badge badge-free">GRÁTIS</span>
            <span className="badge badge-offline">OFFLINE</span>
            <span className="badge badge-online">IA no app (opcional)</span>
          </div>
        </div>
        <LiveDemo />
      </div>
    </section>
  );
}
