# 📱 Escudo Fácil: app mobile

App em **React Native + Expo SDK 57** com **expo-router** (rotas por arquivo), offline-first, que implementa as 28 telas do wireframe (`docs/design/wireframe.dc.html`).

## Como rodar

```bash
# na raiz do monorepo
npm install

# servidor de desenvolvimento (Expo Go, emulador ou web)
npm run dev:mobile
#   a → Android · i → iOS · w → navegador

# development build (necessário para o OCR local do print)
cd apps/mobile
npx expo run:android   # ou: npx expo run:ios
```

Variáveis opcionais em `apps/mobile/.env` (veja `.env.example`):

| Variável | Para quê |
|---|---|
| `EXPO_PUBLIC_AI_API_URL` | URL base HTTPS da API de IA; ativa o botão "Análise com IA". Sem ela, o app funciona com a análise local. |

## Estrutura

```
apps/mobile/
├── app/                         # Rotas (expo-router)
│   ├── _layout.tsx              # Providers, fontes Asap, splash
│   ├── index.tsx                # Primeira abertura → onboarding; depois → Home
│   ├── onboarding/              # A1 boas-vindas · A2 sem cadastro · A3 acessibilidade
│   ├── (tabs)/                  # Navegação inferior
│   │   ├── index.tsx            # B1/B2 Home (3 ações grandes)
│   │   ├── historico.tsx        # F1 histórico local · F2 prévia Plus
│   │   ├── aprender.tsx         # F3 cards educativos
│   │   └── ajuda.tsx            # Emergência, atalhos e acessibilidade
│   ├── link/                    # C1 entrada · C2 verificando · C3–C6 resultado
│   ├── print/                   # D1 escolher print · D2 máscara · D3 resultado
│   ├── proposta/                # E1/E2 perguntas · E3 resultado
│   ├── aprender/[id].tsx        # F4 card de aprendizado
│   ├── passo-a-passo.tsx        # D4 "Não sei o que fazer"
│   ├── nao-me-pressione.tsx     # E4 respiração guiada
│   ├── checklist.tsx            # E5 checklist anti-golpe
│   ├── ajuda-familiar.tsx       # B3 pedir ajuda (WhatsApp)
│   ├── modo-familia.tsx         # B4 Modo Família (Plus)
│   ├── privacidade.tsx          # A4 selo de privacidade
│   ├── emergencia.tsx           # G1 "Acho que caí em golpe"
│   ├── orientacao-pix.tsx       # Orientação para Pix (MED)
│   ├── resumo-do-caso.tsx       # G2 resumo para banco/B.O. + PDF
│   ├── planos.tsx               # G3 planos sem dark pattern
│   ├── assinar.tsx              # G4 login + pagamento
│   ├── canal-oficial.tsx        # Como confirmar pelo canal oficial
│   └── denunciar.tsx            # Denunciar / orientações
└── src/
    ├── theme/                   # Tema claro e alto contraste a partir de @escudo/tokens
    ├── state/                   # settings · history · session · learn (AsyncStorage)
    ├── services/                # speech · share · ocr · network · ai · report · haptics
    └── components/              # Screen, Button, Toggle, RiskHeader, ResultBody,
                                 # ReadAloudSheet (G5), HighlightedText, AiPanel…
```

## Mapa telas × wireframe

| Wireframe | Rota | Login | Rede | Plano |
|---|---|---|---|---|
| A1 Onboarding | `/onboarding` | não | offline | grátis |
| A2 Sem cadastro | `/onboarding/sem-conta` | não | offline | grátis |
| A3 Acessibilidade | `/onboarding/acessibilidade`, aba Ajuda | não | offline | grátis |
| A4 Selo de privacidade | `/privacidade` | não | offline | grátis |
| B1/B2 Home (clara / alto contraste) | `/(tabs)` | não | offline | grátis |
| B3 Pedir ajuda | `/ajuda-familiar` | não | WhatsApp | grátis |
| B4 Modo Família | `/modo-familia` | **sim** | online | Plus |
| C1–C6 Verificar link + 4 resultados | `/link`, `/link/verificando`, `/link/resultado` | não | offline (+IA opcional) | grátis |
| D1–D4 Verificar print | `/print`, `/print/mascara`, `/print/resultado`, `/passo-a-passo` | não | OCR offline (+IA opcional) | grátis |
| E1–E3 Proposta suspeita | `/proposta`, `/proposta/resultado` | não | offline | grátis |
| E4 Não me pressione | `/nao-me-pressione` | não | offline | grátis |
| E5 Checklist | `/checklist` | não | offline | grátis |
| F1 Histórico local | aba Histórico | não | offline | grátis |
| F2 Histórico na nuvem | aba Histórico (prévia) | **sim** | online | Plus |
| F3/F4 Aprender | aba Aprender, `/aprender/[id]` | não | offline | grátis |
| G1 Emergência | `/emergencia` | não | offline | **sempre grátis** |
| G2 Resumo do caso | `/resumo-do-caso` | não | offline | grátis |
| G3 Planos | `/planos` | não | — | — |
| G4 Login + pagamento | `/assinar` | **sim** | online | Plus |
| G5 Ler em voz alta | `ReadAloudSheet` em todos os resultados | não | offline | grátis |

## Decisões de implementação

- **Motor compartilhado:** toda a análise vem de `@escudo/core`, a mesma usada na landing. O link **nunca** é aberto e é exibido como texto não clicável.
- **OCR local:** `@react-native-ml-kit/text-recognition` roda no aparelho. No Expo Go e no web o módulo nativo não existe, e o app pede para colar o texto, sem quebrar o fluxo.
- **IA opcional:** o botão só aparece com internet e uma URL HTTPS em `EXPO_PUBLIC_AI_API_URL`. O cliente mascara dados conhecidos, remove trechos dos sinais e envia apenas o domínio principal do link. A máscara pode não reconhecer todos os dados: revise o texto antes do envio. Respostas inválidas ou com frases proibidas são rejeitadas.
- **Persistência:** preferências, histórico (máx. 200 itens, sem conteúdo bruto nas novas entradas), contato de confiança e progresso do Aprender ficam no `AsyncStorage`, **só no aparelho**. O armazenamento local não é criptografado pelo app. "Apagar tudo" e "Apagar dados sensíveis" pedem confirmação.
- **Acessibilidade:** texto grande (escala de 1× a 1,5×), alto contraste (tema B2), voz (`expo-speech` pt-BR com pausar e "mais devagar"), alvos ≥ 48px, `accessibilityRole/State/Label` em todos os controles, feedback tátil, sem gestos complexos.
- **Plus sem backend (ainda):** as telas B4, F2 e G4 existem e respeitam a regra "login só aqui", mas informam com honestidade que o plano ainda não está disponível. Nada é cobrado.

## Validação

```bash
npm run typecheck -w @escudo/mobile           # TypeScript estrito
npx expo export --platform web                # garante que o bundle compila
cd apps/mobile && npx expo-doctor             # compatibilidade de dependências com o SDK
```
