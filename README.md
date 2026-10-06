# 🛡️ Escudo Fácil

> **Antes de clicar, verifique.**

App anti-golpe para pessoas leigas, idosos e familiares. Ajuda a identificar possíveis golpes digitais **antes** de clicar em links, pagar boletos, fazer Pix, enviar documentos ou passar senhas, com linguagem simples, botões grandes e sem exigir cadastro.

O app funciona como um **semáforo anti-golpe**:

| Nível | Cor | Ícone | O que o app diz |
|---|---|---|---|
| Baixo risco | 🟩 verde | ✓ | "Nenhum sinal grave encontrado agora" |
| Atenção | 🟨 amarelo | ⚠️ | "Atenção: sinais suspeitos" |
| Alto risco | 🟥 vermelho | 🛑 | "Alto risco de golpe" |
| Inconclusivo | ⬜ cinza | ❔ | "Não foi possível confirmar" |

> ⚠️ **Regra de ouro:** o app **nunca** diz "link seguro", "100% confiável", "pode clicar" ou "sem risco". Toda análise é uma avaliação de risco no momento da verificação. Essa regra é verificada automaticamente pelos testes (`packages/core/test/copy.test.ts`).

---

## Sumário

- [Visão geral do monorepo](#visão-geral-do-monorepo)
- [Arquitetura](#arquitetura)
- [Como rodar](#como-rodar)
- [Landing page (`apps/landing`)](#landing-page-appslanding)
- [App mobile (`apps/mobile`)](#app-mobile-appsmobile)
- [Motor anti-golpe (`packages/core`)](#motor-anti-golpe-packagescore)
- [Design tokens (`packages/tokens`)](#design-tokens-packagestokens)
- [Deploy na Vercel](#deploy-na-vercel)
- [Acessibilidade](#acessibilidade)
- [Privacidade e segurança](#privacidade-e-segurança)
- [Fluxo de branches e versões](#fluxo-de-branches-e-versões)
- [Referências de design](#referências-de-design)

---

## Visão geral do monorepo

```
escudo-facil/
├── apps/
│   ├── landing/        # Landing page em Next.js 16 (export estático)
│   └── mobile/         # App em React Native + Expo (expo-router)
├── packages/
│   ├── core/           # Motor anti-golpe offline (TypeScript puro + testes)
│   └── tokens/         # Design tokens compartilhados (cores, tipografia, espaçamento)
├── docs/design/        # Wireframe e briefing originais (Claude Design)
└── .github/workflows/  # CI: testes, typecheck e build
```

Gerenciado com **npm workspaces** (Node ≥ 20.19, ver `.nvmrc`).

## Arquitetura

```
                ┌──────────────────────────┐
                │     packages/tokens      │  cores do semáforo, alto contraste,
                │  (design tokens em TS)   │  tipografia, raios, alvos de toque
                └────────────┬─────────────┘
                             │
                ┌────────────┴─────────────┐
                │      packages/core       │  analyzeLink · analyzeText
                │  motor anti-golpe local  │  questionário · checklist
                │  (sem dependências, sem  │  maskSensitive · regras de copy
                │   rede, 100% testável)   │  conteúdo educativo · contrato IA
                └──────┬────────────┬──────┘
                       │            │
          ┌────────────┴───┐   ┌────┴─────────────────┐
          │  apps/landing  │   │     apps/mobile      │
          │  Next.js SSG   │   │  Expo + RN + router  │
          │  demo ao vivo  │   │  offline-first       │
          │  no navegador  │   │  AsyncStorage, voz,  │
          └────────────────┘   │  OCR, compartilhar   │
                               └──────────┬───────────┘
                                          │ (opcional, quando o usuário escolhe)
                                          ▼
                               ┌──────────────────────┐
                               │  API de IA (backend) │  recebe só texto
                               │  contrato em core/ai │  JÁ MASCARADO
                               └──────────────────────┘
```

**Decisões principais**

1. **Regras de negócio em um pacote puro (`@escudo/core`)**. A mesma análise roda na landing (navegador), no app (offline) e pode rodar num backend. Sem dependências e sem acesso à rede: o link **nunca** é aberto, só o texto do endereço é lido.
2. **Offline-first**. Toda a análise básica acontece no aparelho. A internet só é usada para recursos que de fato precisam dela (IA, reputação de URL, sincronização familiar).
3. **IA como camada opcional**. O contrato (`AiAnalysisRequest/Response`) e o prompt de sistema vivem no core, versionados junto com as regras de copy. A chave do provedor de IA fica **sempre no backend**, nunca no app.
4. **Tokens compartilhados**. Landing (variáveis CSS geradas no build) e app (StyleSheet) usam a mesma paleta, então o semáforo é idêntico nas duas pontas.
5. **TypeScript estrito em tudo**. Os pacotes internos são publicados como TS fonte (transpilados por Next/Metro), o que dispensa etapa de build nos pacotes.

## Como rodar

```bash
# 1. Node 22 (ou >= 20.19)
nvm use

# 2. Dependências de todo o monorepo
npm install

# 3. Testes do motor anti-golpe
npm test

# 4. Landing page em modo desenvolvimento → http://localhost:3000
npm run dev:landing

# 5. Build estático da landing → apps/landing/out
npm run build:landing

# 6. App mobile (Expo) → Expo Go, emulador ou navegador
npm run dev:mobile

# 7. Typecheck de todos os pacotes
npm run typecheck
```

## Landing page (`apps/landing`)

Next.js 16 (App Router) com `output: 'export'`: gera HTML estático que pode ser hospedado em qualquer CDN.

| Seção | Componente | O que mostra |
|---|---|---|
| Cabeçalho | `Header` | Navegação sempre visível (sem menu escondido), rolável no celular |
| Hero | `Hero` | "Antes de clicar, verifique." + réplica da Home do app |
| Como funciona | `HowItWorks` | As 3 ações grandes e o fluxo ideal em 7 passos |
| **Experimente** | `TryIt` + `demo/LiveDemo` | **Demonstração real**: verifica link ou mensagem no navegador com o `@escudo/core` |
| Semáforo | `TrafficLight` | Os 4 níveis (cor + ícone + texto) e a regra "nunca dizer seguro" |
| Não me pressione | `NoPressure` | Respiração guiada contra a pressa do golpista |
| Família | `Family` | Pedir ajuda grátis via WhatsApp e Modo Família (Plus, com consentimento) |
| Privacidade | `Privacy` | Selo de privacidade, matriz offline/online/IA e máscara de dados |
| Acessibilidade | `Accessibility` + `A11yBar` | Recursos e barra fixa com texto grande, alto contraste e leitura em voz alta |
| Emergência | `Emergency` | "Acho que caí em golpe" + orientação para Pix (MED) |
| Planos | `Plans` | Grátis × Plus, sem dark pattern |
| Dúvidas | `Faq` | Perguntas frequentes com `<details>` |
| Baixar / Rodapé | `Download`, `Footer` | Chamada final e links |

**Demonstração ao vivo:** abas "Verificar link" e "Verificar mensagem", botão "Colar", exemplos prontos, carregamento em etapas, resultado em camadas (título → explicação → sinais → o que fazer agora → detalhes técnicos recolhidos), trechos suspeitos destacados, "Mandar para familiar" (Web Share/WhatsApp) e "Ouvir resultado" (Web Speech API, pt-BR).

## App mobile (`apps/mobile`)

React Native com **Expo SDK 57** e **expo-router**, implementando as 28 telas do wireframe com o mesmo `@escudo/core`. Offline-first, com OCR no aparelho, leitura em voz alta, histórico local, alto contraste e texto grande.

| Fluxo | Telas |
|---|---|
| Entrada sem cadastro | A1 boas-vindas · A2 "você não precisa criar conta" · A3 acessibilidade · A4 privacidade |
| Home | B1 três ações grandes · B2 alto contraste · B3 pedir ajuda (WhatsApp) · B4 Modo Família |
| Verificar link | C1 colar link · C2 verificando · C3–C6 resultado verde/amarelo/vermelho/cinza |
| Verificar print | D1 galeria/câmera + OCR local · D2 máscara antes da IA · D3 trechos destacados · D4 passo a passo |
| Proposta suspeita | E1/E2 8 perguntas Sim/Não/Não sei · E3 resultado · E4 Não me pressione · E5 checklist |
| Histórico e Aprender | F1 histórico local · F2 nuvem (Plus) · F3 cards · F4 card com "Entendi" |
| Emergência e planos | G1 "Acho que caí em golpe" · G2 resumo do caso (PDF) · G3 planos · G4 login · G5 ler em voz alta |

Estrutura, mapa de rotas e decisões em [`apps/mobile/README.md`](apps/mobile/README.md).

## Motor anti-golpe (`packages/core`)

```ts
import { analyzeLink, analyzeText, scoreQuestionnaire, evaluateChecklist, maskSensitive } from '@escudo/core';

analyzeLink('http://itau-seguranca.verifique-conta.xyz/login');
// → { level: 'high', title: 'Alto risco de golpe', signals: [...], actions: [...], technical: [...] }

const { result, highlights, scamType, pressure } = analyzeText('Sua conta será bloqueada hoje. Faça um Pix de R$ 250');
// highlights → trechos para destacar no print; pressure → abre o modo "Não me pressione"

maskSensitive('CPF 123.456.789-09'); // → { text: 'CPF ███.███.███-██', counts: { cpf: 1 } }
```

**O que o `analyzeLink` detecta (sem abrir o link):** link encurtado · domínio imitando banco/governo/loja · erro de digitação (distância de edição e troca de letras por números) · caracteres estranhos/punycode · IP no lugar do nome · truque do `@` · TLD suspeito (`.xyz`, `.top`…) · excesso de subdomínios, hífens e parâmetros · palavras como "login", "regularize", "pix" fora de site oficial · esquemas `javascript:`/`data:`.

**O que o `analyzeText` detecta:** urgência · pedido de dinheiro/Pix/boleto · senha/código/token · documentos · falsa autoridade · ameaça · promessa exagerada · pedido de segredo · acesso remoto (AnyDesk etc.) · falso parente ("troquei de número") · links escondidos. Também sugere o tipo de golpe (falso banco, falso parente, falso benefício…).

**Como o nível é decidido** (`result.ts`): qualquer sinal *forte* ou pontuação ≥ 6 → alto risco; pontuação ≥ 2 → atenção; caso contrário, baixo risco **com lembrete de cautela**. Entrada ilegível → inconclusivo. Nunca mais que 5 motivos.

Testes: `npm test -w @escudo/core` (Vitest).

## Design tokens (`packages/tokens`)

Paleta extraída do wireframe: azul confiança `#2563a8`, semáforo (`#1f9d57`, `#e7b200`, `#d23b3b`, `#9aa5b1`), roxo para IA `#6d4ea8`, tema de alto contraste (preto/branco/amarelo `#ffe14d`), tipografia **Asap** (e **Gaegu** só para anotações na landing), raios, espaçamentos e alvos de toque (mínimo 48px).

## Deploy na Vercel

A landing já tem `apps/landing/vercel.json` configurado para o monorepo:

1. Acesse **vercel.com/new** e importe o repositório `LeandroDukievicz/escudo-facil`.
2. Em **Root Directory**, escolha `apps/landing` (framework detectado: Next.js).
3. Clique em **Deploy**.

A cada push em `main` a Vercel publica em produção; cada PR ganha uma URL de preview.

## Acessibilidade

- Botões com no mínimo 48px, foco sempre visível, link "pular para o conteúdo".
- Risco **nunca só por cor**: cor + ícone + texto, e texto alternativo para leitores de tela.
- Modo **texto grande**, **alto contraste** e **ler em voz alta**.
- Respeita `prefers-reduced-motion`.
- Linguagem simples; jargão (host, TLD, regras disparadas) aparece **só** em "Ver detalhes técnicos", recolhido por padrão.
- Confirmação antes de apagar ou compartilhar.

## Privacidade e segurança

- Análise básica **no aparelho**; nada sai do celular sem o usuário escolher.
- O app **não abre** links e **não torna links suspeitos clicáveis**.
- **Máscara de dados** (CPF, telefone, e-mail, chave Pix, cartão, RG/CNH, endereço) antes de qualquer envio para IA.
- Histórico local, com botão "apagar tudo".
- Login **só** em: plano Plus, histórico na nuvem e Modo Família.

## Fluxo de branches e versões

- `main`: sempre estável e publicável (produção da landing na Vercel).
- `feat/*`: uma branch por entrega (`feat/landing`, `feat/mobile`…), com um commit por tela/feature e PR para `main`.
- Tags semânticas por entrega (`landing-v0.1.0`, `mobile-v0.1.0`…).
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat(landing): …`, `fix(core): …`).

## Referências de design

`docs/design/` contém o handoff do Claude Design:

- `wireframe.dc.html`: wireframe completo (28 telas, seções A–G) com anotações de UX. Abra no navegador junto com `support.js`.
- `briefing-chat.md`: briefing original com personas, fluxos, microcopy e regras.
