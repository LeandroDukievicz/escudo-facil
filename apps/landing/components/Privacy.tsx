import { PRIVACY_POINTS } from '@escudo/core';
import styles from './Privacy.module.css';

const MATRIX = [
  { feature: 'Verificar link (regras locais)', offline: true, online: false, ai: false },
  { feature: 'Ler o print (OCR no aparelho)', offline: true, online: false, ai: false },
  { feature: 'Perguntas guiadas e checklist', offline: true, online: false, ai: false },
  { feature: 'Histórico no celular', offline: true, online: false, ai: false },
  { feature: 'Consulta de reputação e redirecionamentos', offline: false, online: true, ai: false },
  { feature: 'Análise com IA (explicação em camadas)', offline: false, online: true, ai: true },
  { feature: 'Sincronização com a família', offline: false, online: true, ai: false },
];

const Mark = ({ on, label }: { on: boolean; label: string }) =>
  on ? (
    <span className={styles.yes}>
      ✓<span className="visually-hidden"> {label}</span>
    </span>
  ) : (
    <span className={styles.no}>
      —<span className="visually-hidden"> não usa {label}</span>
    </span>
  );

export function Privacy() {
  return (
    <section id="privacidade" className={`section ${styles.wrap}`} aria-labelledby="privacy-title">
      <div className="container">
        <span className="eyebrow">Selo de privacidade</span>
        <h2 id="privacy-title" className="section-title">
          Você está no controle dos seus dados.
        </h2>

        <ul className={styles.points}>
          {PRIVACY_POINTS.map((p) => (
            <li key={p.title} data-hc="surface">
              <span aria-hidden="true">{p.icon}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.split}>
          <div className={styles.tableWrap} data-hc="surface">
            <table className={styles.table}>
              <caption>O que funciona sem internet, o que precisa de internet e o que usa IA</caption>
              <thead>
                <tr>
                  <th scope="col">Recurso</th>
                  <th scope="col">
                    <span className="badge badge-offline">OFFLINE</span>
                  </th>
                  <th scope="col">
                    <span className="badge badge-online">ONLINE</span>
                  </th>
                  <th scope="col">
                    <span className="badge badge-ai">IA</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row">{r.feature}</th>
                    <td>
                      <Mark on={r.offline} label="funciona offline" />
                    </td>
                    <td>
                      <Mark on={r.online} label="precisa de internet" />
                    </td>
                    <td>
                      <Mark on={r.ai} label="IA" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mask} data-hc="surface">
            <h3>🔒 Máscara antes da IA</h3>
            <p>
              Antes de qualquer envio para a IA, o app esconde no próprio celular seus dados pessoais. <b>Você
              decide</b> se envia ou se fica só no aparelho.
            </p>
            <div className={styles.sample} aria-label="Exemplo de mensagem com dados ocultados">
              Olá, aqui é do banco.
              <br />
              Confirme seu CPF <span className={styles.redact}>███.███.███-██</span>
              <br />e o código <span className={styles.redact}>██████</span> que enviamos.
              <br />
              Tel: <span className={styles.redact}>(██) █████-████</span>
            </div>
            <ul className={styles.chips}>
              {['CPF', 'Telefone', 'E-mail', 'Chave Pix', 'Cartão', 'Endereço'].map((c) => (
                <li key={c}>✓ {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
