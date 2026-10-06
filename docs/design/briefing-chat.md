# Escudo Fácil: App anti-golpe

_Started 2026-06-27 23:50 UTC_

---

## User

Você é um designer sênior de produto, especialista em UX para idosos, acessibilidade, mobile apps, segurança digital, prevenção de golpes, fintech, GovTech e design de interfaces extremamente simples para pessoas leigas.

Crie um wireframe de alta resolução para um aplicativo mobile chamado provisoriamente **Escudo Fácil**.

## 1. Contexto do produto

O app tem como objetivo ajudar pessoas totalmente leigas, idosos e familiares a identificar possíveis golpes digitais antes de clicar em links, pagar boletos, fazer Pix, enviar documentos, passar senhas ou responder mensagens suspeitas.

O app deve ser simples, direto e acolhedor. A pessoa não pode se sentir burra, culpada ou assustada demais. A experiência deve transmitir:

* “Pare um pouco antes de agir.”
* “Vamos verificar juntos.”
* “Não clique ainda.”
* “Você não está sozinho.”
* “O app não acusa; ele orienta.”

A interface precisa ser extremamente acessível para pessoas idosas: botões grandes, textos curtos, alto contraste, poucos elementos por tela, navegação óbvia, ícones claros, leitura fácil, opção de voz e modo ajuda.

Não deve exigir login inicial. O usuário deve conseguir abrir o app e usar as funções principais imediatamente. Login só deve aparecer se a pessoa quiser pagar, salvar histórico, sincronizar com familiar/cuidador ou usar IA avançada.

## 2. Público-alvo

Crie a interface considerando três perfis principais:

### Persona 1: Pessoa idosa leiga

* Usa WhatsApp, banco, Pix e redes sociais.
* Tem medo de cair em golpe.
* Pode ter dificuldade com menus complexos.
* Precisa de frases simples, botões grandes e confirmação antes de qualquer ação.

### Persona 2: Filho, neto ou cuidador

* Quer ajudar um familiar idoso a se proteger.
* Pode configurar contatos confiáveis.
* Pode receber alertas quando o idoso marcar algo como “muito suspeito”.

### Persona 3: Pessoa comum não técnica

* Recebe links, promoções, mensagens de banco, SMS, boleto, anúncio, oferta de emprego ou cobrança.
* Quer saber rapidamente se deve confiar ou não.

## 3. Conceito central do app

O app deve funcionar como um “semáforo anti-golpe”:

* **Verde:** Parece seguro, mas ainda assim confira antes de pagar ou enviar dados.
* **Amarelo:** Atenção. Existem sinais suspeitos.
* **Vermelho:** Alto risco. Não clique, não pague, não envie dados.
* **Cinza:** Não foi possível confirmar. Procure uma fonte oficial ou pessoa confiável.

Nunca use linguagem absoluta como “100% seguro”. Segurança digital não é adivinhação com bola de cristal; é análise de risco.

## 4. Funcionalidades principais

A tela inicial deve ter apenas 3 ações grandes:

1. **Verificar um link**

   * Usuário cola ou digita um link.
   * O app analisa sem abrir o link.
   * Mostra risco em linguagem simples.
   * Mostra por que parece suspeito.
   * Mostra próximos passos.

2. **Verificar print da conversa**

   * Usuário envia uma imagem da galeria ou tira print.
   * O app usa OCR para extrair o texto.
   * O app identifica frases suspeitas, urgência, pedido de dinheiro, links escondidos, Pix, senha, código de banco, falsa autoridade, ameaça ou promessa exagerada.
   * Deve mostrar trechos destacados do print.

3. **Recebi uma proposta suspeita**

   * Fluxo guiado com perguntas simples:

     * “Estão pedindo dinheiro?”
     * “Pedem Pix, boleto, cartão ou senha?”
     * “Dizem que é urgente?”
     * “A pessoa se passou por banco, governo, parente ou empresa?”
     * “Você conhece pessoalmente quem mandou?”
     * “O link termina com site oficial?”
   * Ao final, mostra uma nota de risco e orientações.

## 5. Funcionalidade offline

O app deve funcionar offline com análise básica.

No modo offline, o app deve usar regras locais e listas internas para detectar sinais de golpe:

* Link encurtado.
* Domínio parecido com banco, governo ou loja famosa.
* Domínio com erro de digitação.
* Uso de caracteres estranhos ou parecidos com letras comuns.
* Muitas subpastas ou parâmetros estranhos.
* Pedido de Pix, senha, token, código SMS, CPF, RG, CNH, foto de cartão.
* Frases de urgência:

  * “último aviso”
  * “sua conta será bloqueada”
  * “regularize agora”
  * “clique imediatamente”
  * “prazo final”
  * “multa”
  * “processo judicial”
  * “benefício liberado”
  * “ganhou um prêmio”
  * “confirme seus dados”
* Falsas instituições:

  * banco
  * Receita Federal
  * gov.br
  * Correios
  * INSS
  * operadora
  * marketplace
  * loja famosa
  * suporte técnico
* Golpes comuns:

  * falso Pix
  * falso boleto
  * falso empréstimo
  * falso benefício
  * falso suporte
  * falso parente pedindo dinheiro
  * falso entregador
  * falso emprego
  * falso investimento
  * falso prêmio
  * golpe do amor/relacionamento
  * golpe da mão fantasma/acesso remoto
  * falso anúncio em marketplace

No offline, mostrar um aviso claro:

“Análise básica feita no aparelho. Para uma verificação mais completa, conecte-se à internet.”

## 6. Funcionalidade online com IA

Quando conectado, o app pode oferecer uma análise mais assertiva com IA e serviços externos.

Crie no wireframe um modo chamado:

**Análise com IA**

A IA deve:

* Explicar o risco em linguagem simples.
* Identificar sinais de engenharia social.
* Resumir o que o golpista está tentando fazer.
* Separar “o que sabemos” de “o que não dá para confirmar”.
* Sugerir o que fazer agora.
* Evitar linguagem técnica.
* Nunca incentivar clicar no link.
* Nunca prometer certeza absoluta.

A IA deve analisar:

* Texto extraído de prints.
* Links colados.
* Mensagens copiadas do WhatsApp/SMS/e-mail.
* Propostas de compra/venda/investimento.
* Supostas cobranças.
* Supostos comunicados de banco/governo.

Inclua no design uma tela de resultado com explicação em camadas:

1. Resultado simples:

   * “Alto risco de golpe”
   * “Atenção: sinais suspeitos”
   * “Parece legítimo, mas confira”
   * “Não foi possível confirmar”

2. Por que deu esse resultado:

   * Lista curta com no máximo 5 motivos.

3. O que fazer agora:

   * Não clique.
   * Não pague.
   * Não envie senha/código.
   * Ligue para o banco pelo número oficial.
   * Fale com familiar confiável.
   * Procure canal oficial.
   * Registre evidências se já enviou dinheiro.

4. Botões de ação:

   * “Mandar para familiar”
   * “Salvar prova”
   * “Ver passo a passo”
   * “Analisar de novo”
   * “Denunciar/Orientações”

## 7. Fluxos obrigatórios do wireframe

Crie wireframes de alta resolução para as seguintes telas:

### 7.1 Onboarding sem cadastro

Tela 1:

* Logo simples.
* Frase: “Antes de clicar, verifique.”
* Subfrase: “Analise links, prints e mensagens suspeitas em poucos segundos.”
* Botão grande: “Começar agora”
* Link discreto: “Como funciona?”

Tela 2:

* “Você não precisa criar conta.”
* “As verificações básicas funcionam sem login.”
* “Login só é necessário para plano pago, histórico e recursos familiares.”
* Botão: “Usar sem conta”

### 7.2 Home

A home deve ter:

* Saudação simples: “O que você quer verificar?”
* Três cards enormes:

  * “Verificar link”
  * “Verificar print”
  * “Recebi uma proposta suspeita”
* Um botão secundário:

  * “Pedir ajuda para familiar”
* Rodapé com:

  * Início
  * Histórico
  * Aprender
  * Ajuda

Não coloque muitas opções na home. O app é para pessoas leigas, não para analista de SOC tomando café frio às 3 da manhã.

### 7.3 Verificar link

Tela com:

* Campo grande para colar link.
* Botão “Colar link copiado”.
* Botão “Verificar sem abrir”.
* Aviso: “O app não abre o link durante a análise.”
* Exemplo visual de link suspeito.
* Estado de carregamento:

  * “Verificando sinais de risco…”
  * “Comparando com listas de segurança…”
  * “Analisando padrão do endereço…”

### 7.4 Resultado de link

Criar 4 variações:

* Verde: baixo risco.
* Amarelo: atenção.
* Vermelho: alto risco.
* Cinza: inconclusivo.

Cada resultado deve ter:

* Ícone grande.
* Título simples.
* Explicação em 2 frases.
* Lista “Sinais encontrados”.
* Lista “O que fazer agora”.
* Botões:

  * “Compartilhar resultado”
  * “Salvar”
  * “Ver detalhes técnicos”
  * “Nova análise”

A área “Ver detalhes técnicos” deve ficar recolhida por padrão, para não assustar o usuário.

### 7.5 Verificar print

Tela com:

* Botão grande “Escolher print da galeria”.
* Botão “Tirar foto da tela de outro celular”.
* Instrução visual:

  * “Envie uma imagem nítida da conversa.”
  * “Não precisa cortar a imagem.”
  * “Você pode esconder dados pessoais se quiser.”
* Botão de privacidade:

  * “Ocultar CPF, telefone e e-mail automaticamente”

### 7.6 Resultado do print

Tela com:

* Preview do print.
* Trechos destacados em caixas:

  * Pedido de dinheiro.
  * Urgência.
  * Link suspeito.
  * Ameaça.
  * Pedido de senha/código.
  * Promessa exagerada.
* Resultado geral em semáforo.
* Explicação simples:

  * “A mensagem tenta fazer você agir com pressa.”
  * “Ela pede dados que bancos e órgãos oficiais normalmente não pedem por mensagem.”
* Botão:

  * “Não sei o que fazer”
* Ao clicar:

  * Mostrar passo a passo de segurança.

### 7.7 Fluxo “proposta suspeita”

Criar uma sequência de perguntas com botões grandes “Sim”, “Não”, “Não sei”.

Perguntas:

1. “Estão pedindo dinheiro, Pix ou boleto?”
2. “Estão pedindo senha, código SMS ou token?”
3. “Dizem que é urgente?”
4. “A pessoa se passou por banco, governo, parente ou empresa?”
5. “Você recebeu um link?”
6. “A oferta parece boa demais?”
7. “Você conhece essa pessoa fora da internet?”
8. “Pedem para instalar algum aplicativo?”

Resultado:

* Score de risco simples.
* Frase principal:

  * “Melhor parar antes de continuar.”
* Botões:

  * “Ver orientação”
  * “Mandar para familiar”
  * “Salvar como prova”

### 7.8 Tela “Pedir ajuda para familiar”

Sem login inicial, permitir:

* Compartilhar resultado por WhatsApp.
* Escolher contato confiável.
* Gerar mensagem pronta:

  * “Oi, pode me ajudar a verificar isso? O app marcou como suspeito.”
* Modo pago/familiar:

  * “Adicionar familiar de confiança”
  * Exige login apenas aqui.

### 7.9 Histórico

Histórico deve ser opcional.
Sem login:

* Histórico local no aparelho.
* Botão para apagar tudo.
* Aviso claro:

  * “Seu histórico fica apenas neste celular.”

Com login/plano pago:

* Sincronização.
* Alertas para familiar.
* Relatórios mensais.
* Proteção em nuvem.

### 7.10 Tela “Aprender”

Conteúdo educativo em cards simples:

* “Nunca envie código do banco.”
* “Banco não pede senha por WhatsApp.”
* “Desconfie de urgência.”
* “Confira o endereço do site.”
* “Promoção boa demais merece pausa.”
* “Golpista usa medo, pressa e promessa.”

Cada card deve ter:

* Ilustração simples.
* Texto curto.
* Botão “Entendi”.
* Checklist de aprendizado.

### 7.11 Tela de emergência: “Acho que caí em golpe”

Essa tela é essencial.

Deve ter:

* Título: “Acho que caí em golpe. O que faço agora?”
* Passos claros:

  1. Pare de conversar com a pessoa.
  2. Não envie mais dinheiro.
  3. Tire prints e salve comprovantes.
  4. Ligue para o banco pelo número oficial.
  5. Troque senhas se enviou dados.
  6. Registre boletim de ocorrência.
  7. Avise um familiar de confiança.
* Botão grande:

  * “Gerar lista do que aconteceu”
* Botão:

  * “Compartilhar com familiar”
* Botão:

  * “Abrir orientação para Pix”
* Botão:

  * “Apagar dados sensíveis do app”

### 7.12 Tela de planos/pagamento

Login e pagamento só podem aparecer depois que o usuário já entendeu valor do app.

Plano grátis:

* Verificação básica offline.
* Análise limitada de links.
* Análise de prints com regras locais.
* Histórico local.

Plano Plus:

* IA avançada.
* Mais análises por mês.
* Histórico protegido.
* Alertas para familiar.
* Relatório de risco.
* Explicações por voz.
* Modo cuidador.

A tela de pagamento deve ser simples:

* “Você pode continuar usando grátis.”
* “O plano pago adiciona mais proteção, mas não é obrigatório.”
* Botão principal: “Ver planos”
* Botão secundário: “Continuar grátis”

Não usar dark patterns. Nada de assustar idoso para vender. Ética primeiro, boleto depois.

## 8. Requisitos visuais

Estilo visual:

* Interface clara, humana e confiável.
* Fundo preferencialmente claro ou azul muito suave.
* Alto contraste.
* Botões grandes.
* Tipografia grande.
* Ícones óbvios.
* Evitar excesso de neon, glitch, cyberpunk ou aparência hacker.
* Pode usar pequenos detalhes modernos, mas o app deve parecer seguro e familiar.

Paleta sugerida:

* Azul confiança.
* Verde segurança.
* Amarelo atenção.
* Vermelho alerta.
* Cinza neutro.
* Branco/off-white para fundo.

Tipografia:

* Sans-serif extremamente legível.
* Tamanho mínimo generoso.
* Títulos grandes.
* Nada de texto pequeno em áreas críticas.

Componentes:

* Cards grandes.
* Botões de no mínimo 48px de altura.
* Espaçamento amplo.
* Estados visuais claros.
* Feedback tátil/visual.
* Ícones com texto, nunca ícone sozinho.
* Bottom navigation simples.

## 9. Acessibilidade

O wireframe deve seguir boas práticas de acessibilidade:

* Contraste forte.
* Texto redimensionável.
* Suporte a leitor de tela.
* Linguagem simples.
* Botões grandes.
* Não depender apenas de cor para indicar risco.
* Sempre combinar cor + ícone + texto.
* Evitar gestos complexos.
* Evitar menus escondidos.
* Evitar jargão técnico.
* Permitir modo “texto grande”.
* Permitir modo “voz”.
* Permitir modo “alto contraste”.
* Permitir confirmação antes de apagar ou compartilhar.

## 10. Microcopy e tom de voz

Use português do Brasil.

Tom:

* Calmo.
* Direto.
* Respeitoso.
* Sem julgamento.
* Sem tecnicismo.
* Sem alarmismo desnecessário.

Exemplos de frases:

* “Não clique ainda.”
* “Vamos verificar primeiro.”
* “Essa mensagem tem sinais de golpe.”
* “Pode ser golpe. Melhor confirmar por outro canal.”
* “Nenhum banco deve pedir sua senha por mensagem.”
* “Se estiver em dúvida, fale com alguém de confiança.”
* “Não conseguimos confirmar. Procure o canal oficial.”
* “Você fez certo em verificar antes.”

Evite:

* “Você caiu em golpe.”
* “Link malicioso detectado com 100% de certeza.”
* “Phishing heurístico baseado em reputação de domínio.”
* “Threat intelligence.”
* “Sandbox.”
* “IOC.”
* “Hash.”
* “Score probabilístico.”

Esses termos podem existir apenas na área “detalhes técnicos”, que deve ficar escondida.

## 11. Diferenciais que devem aparecer no wireframe

Inclua elementos que tornem o app especial:

### Modo “Família”

* Um familiar confiável pode receber alertas.
* O idoso pode enviar a análise com um toque.
* Deve exigir consentimento claro.

### Modo “Não me pressione”

Uma tela especial para quando a mensagem tenta gerar urgência:

* “Golpes usam pressa para impedir você de pensar.”
* “Respire. Não pague agora.”
* “Verifique pelo canal oficial.”

### Modo “Ler em voz alta”

* O app lê o resultado.
* Útil para idosos com dificuldade visual.

### Máscara de dados sensíveis

* Antes de enviar print para IA, o app pode ocultar CPF, telefone, e-mail, endereço, chave Pix e números de documento.

### Selo de privacidade

* “Análise básica feita no aparelho.”
* “Você escolhe quando usar IA.”
* “Você pode apagar seus dados.”

### Checklist anti-golpe

Criar uma tela com checklist:

* Pediram senha?
* Pediram código?
* Pediram Pix urgente?
* O link parece estranho?
* A pessoa quer segredo?
* A oferta parece boa demais?
* Veio de número desconhecido?

## 12. Arquitetura conceitual para refletir no design

O wireframe não precisa ter código, mas deve considerar os módulos:

### Offline

* OCR local para prints.
* Extração local de links.
* Regras anti-golpe.
* Lista local de palavras de risco.
* Histórico local.
* Checklist guiado.

### Online

* Consulta de reputação de URL.
* Consulta de domínio.
* Análise de IA.
* Verificação de redirecionamentos.
* Análise de marca falsa.
* Atualização de regras.
* Sincronização familiar opcional.

### Segurança

* Não abrir links no celular do usuário.
* Não tornar links suspeitos clicáveis.
* Redigir dados sensíveis antes de enviar para IA.
* Explicar quando algo vai para nuvem.
* Permitir exclusão de histórico.
* Nunca vender certeza absoluta.

## 13. Entregável esperado

Gere um wireframe mobile de alta resolução com:

* Fluxo completo.
* Telas principais.
* Estados de alerta.
* Componentes reutilizáveis.
* Navegação clara.
* Microcopy em português.
* Layout acessível para idosos.
* Versão clara principal.
* Uma versão alternativa em alto contraste.
* Anotações de UX explicando decisões importantes.
* Indicação de onde login aparece e onde não aparece.
* Indicação de quais recursos funcionam offline e quais precisam de internet.
* Indicação de quais telas usam IA.
* Indicação de quais ações são gratuitas e quais entram no plano pago.

## 14. Prioridade máxima

A prioridade não é parecer futurista. A prioridade é salvar a pessoa de clicar, pagar, enviar senha ou cair em manipulação.

O app deve ser tão simples que uma pessoa idosa consiga usar sem tutorial.

A experiência ideal é:

1. Recebi algo estranho.
2. Abri o app.
3. Toquei em uma opção grande.
4. Colei link ou mandei print.
5. Entendi o risco.
6. Soube exatamente o que fazer.
7. Pedi ajuda se precisei.

Crie o wireframe com essa lógica.
## Regra adicional obrigatória: nunca declarar “link seguro”

Adicione uma regra de comunicação crítica em todo o app:

O aplicativo **nunca deve exibir frases absolutas como “link seguro”, “site seguro”, “mensagem segura”, “100% confiável” ou “sem risco”**.

Em segurança digital, a análise deve sempre ser apresentada como **avaliação de risco no momento da verificação**, nunca como garantia definitiva.

Substitua qualquer linguagem absoluta por frases prudentes, claras e responsáveis:

### Frases proibidas

* “Link seguro”
* “Site seguro”
* “Mensagem segura”
* “Pode clicar”
* “Sem risco”
* “100% confiável”
* “Golpe confirmado com certeza”
* “Totalmente confiável”
* “Você está protegido”

### Frases corretas

* “Nenhum sinal grave encontrado agora.”
* “Não encontramos sinais fortes de golpe nesta análise.”
* “Parece ter baixo risco, mas confirme antes de enviar dados ou pagar.”
* “A análise atual não encontrou indícios críticos.”
* “Ainda assim, não envie senha, código ou dinheiro sem confirmar pelo canal oficial.”
* “O risco parece baixo neste momento.”
* “Não foi possível garantir segurança total.”

## Aplicação no wireframe

Essa regra deve aparecer em todas as telas de resultado, especialmente nas variações verdes ou de baixo risco.

Mesmo quando o resultado for positivo, o app deve manter uma comunicação responsável:

### Exemplo de resultado verde correto

Título:
“Nenhum sinal grave encontrado agora”

Texto:
“A análise não encontrou indícios fortes de golpe neste link. Mesmo assim, confirme se o endereço pertence ao site oficial antes de informar dados, fazer login ou pagar.”

Botões:

* “Ver o que foi analisado”
* “Confirmar canal oficial”
* “Nova análise”
* “Compartilhar resultado”

## Justificativa de UX e segurança

O app deve evitar falsa sensação de segurança. Golpes digitais mudam rapidamente, sites podem ser comprometidos depois da análise e links podem redirecionar para novos destinos.

A função do produto não é prometer certeza absoluta, mas ajudar o usuário a tomar uma decisão mais segura.

Use sempre linguagem de probabilidade, risco e orientação prática.

## Regra de tom

A interface deve ser cuidadosa, simples e responsável. A comunicação precisa proteger o usuário sem criar pânico e sem dar garantias impossíveis.

O app deve transmitir:

“Verificamos sinais de risco. Não encontramos nada grave agora, mas continue atento.”

## Assistant

I'll start by exploring the design system, since it's a binding visual reference.

_[tool: list_files]_

The design system folder is empty, so there's no binding visual style to follow — I'll use a clean, accessible wireframe aesthetic per the Wireframe approach. Your brief is extremely detailed and complete, so I'll build rather than ask questions.

Let me lay out the full plan, then build it as a pannable canvas of mobile frames.

_[tool: update_todos]_

_[tool: dc_write]_

## Assistant

Now building the canvas shell plus Section A (onboarding & accessibility).

_[tool: dc_write]_

_[tool: show_html]_

Renders. Appending Section B (Home + alto contraste + ajuda familiar).

_[tool: dc_html_str_replace]_

Section C — Verificar link + loading + 4 result states (semáforo).

_[tool: dc_html_str_replace]_

I need to add the `spin` keyframe I referenced. Let me add it to the helmet.

_[tool: dc_html_str_replace]_

Section D — Verificar print + máscara de dados + resultado + passo a passo.

_[tool: dc_html_str_replace]_

Section E — Proposta suspeita (perguntas guiadas + resultado + "Não me pressione" + checklist).

_[tool: dc_html_str_replace]_

Section F — Histórico (sem/com login) + Aprender + card detalhe.

_[tool: dc_html_str_replace]_

Section G — Emergência + lista gerada + planos + pagamento + ler em voz alta.

_[tool: dc_html_str_replace]_

Adding UX annotation post-its (login boundaries, offline/online, IA, free/paid, copy rules).

_[tool: dc_html_str_replace]_

_[tool: update_todos]_

O wireframe completo está pronto. Vou abrir para você e rodar a verificação.

_[tool: ready_for_verification]_

Pronto. Criei o wireframe completo do **Escudo Fácil** numa tela navegável (arraste para mover, role para dar zoom), organizado em 7 seções com 28 telas de celular:

- **A** Entrada sem cadastro · onboarding, acessibilidade, selo de privacidade
- **B** Home (clara + alto contraste) · ajuda familiar · Modo Família
- **C** Verificar link · loading + os 4 resultados em semáforo (verde, amarelo, vermelho, cinza)
- **D** Verificar print · máscara de dados antes da IA · resultado com trechos destacados · passo a passo
- **E** Proposta suspeita · perguntas Sim/Não/Não sei · resultado · Modo "Não me pressione" · checklist
- **F** Histórico (local grátis / nuvem Plus) · Aprender + card
- **G** Emergência "caí em golpe" · resumo do caso · planos · pagamento · ler em voz alta

Decisões-chave marcadas em post-its: **login só** em Modo Família, Histórico na nuvem e Pagamento; selos OFFLINE/ONLINE/IA/GRÁTIS/PLUS/LOGIN em cada tela; risco sempre por **cor + ícone + texto**; e a regra de copy aplicada — o resultado verde diz *"Nenhum sinal grave encontrado agora"*, nunca "seguro".

Próximos passos possíveis, se quiser: subir a fidelidade de 1–2 fluxos para protótipo clicável, ou trocar os placeholders de ilustração da tela Aprender por arte real.

