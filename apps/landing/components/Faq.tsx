import styles from './Faq.module.css';

const FAQ = [
  {
    q: 'Preciso criar conta para usar?',
    a: 'Não. Abriu, já pode verificar links, prints e propostas. Login só é necessário para o plano Plus, o histórico na nuvem e o Modo Família.',
  },
  {
    q: 'O app abre o link que eu colo?',
    a: 'Nunca. Ele analisa apenas o texto do endereço. Links suspeitos também não ficam clicáveis no app, para evitar toque sem querer.',
  },
  {
    q: 'Funciona sem internet?',
    a: 'Sim. A análise básica (regras locais, leitura do print e perguntas guiadas) roda no celular. Com internet, dá para fazer uma verificação mais completa e usar a Análise com IA.',
  },
  {
    q: 'Se der verde, então é seguro?',
    a: 'O verde quer dizer "Nenhum sinal grave encontrado agora". Ninguém consegue garantir 100%: sites podem ser invadidos e links podem mudar de destino. Por isso o app sempre lembra de confirmar pelo canal oficial antes de pagar ou enviar dados.',
  },
  {
    q: 'Meus prints vão para a internet?',
    a: 'Só se você escolher usar a IA. Antes disso, o app esconde CPF, telefone, e-mail, chave Pix e outros dados no próprio aparelho. Você também pode apagar tudo quando quiser.',
  },
  {
    q: 'Meu familiar vai ver tudo que eu verifico?',
    a: 'Não. O familiar só recebe o que você decidir mandar. No Modo Família (Plus), ele recebe alerta apenas quando algo for marcado como "muito suspeito", e só depois que os dois aceitarem.',
  },
  {
    q: 'O Escudo Fácil substitui o meu banco?',
    a: 'Não. O app ajuda você a parar e pensar antes de agir. Em caso de dúvida ou golpe, ligue sempre para o número oficial que está no seu cartão ou no app do banco.',
  },
];

export function Faq() {
  return (
    <section id="duvidas" className="section" aria-labelledby="faq-title">
      <div className={`container ${styles.container}`}>
        <span className="eyebrow">Perguntas frequentes</span>
        <h2 id="faq-title" className="section-title">
          Dúvidas comuns, respostas diretas.
        </h2>
        <div className={styles.list}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.item} data-hc="surface">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
