# Equipe Konverte

Uma equipe de marketing com IA, dentro do VS Code. Você instala uma vez, cadastra cada cliente, e os especialistas produzem na voz daquele cliente. Nada vai para o ar sem aprovação.

Produto do Gustavo Konverte, da agência Konverte. Preço da v1: **R$ 97**.

Serve para quem está abrindo ou crescendo uma agência pequena, e para dono de negócio que faz o próprio marketing.

O cliente de demonstração, Clínica Sorriso Bom, é fictício. O carrossel em PNG e o reel em MP4 dessa pasta foram gerados de verdade pelos scripts daqui.

## O que a v1 faz

- Memória por cliente: voz, oferta, identidade, transcrição de call, teses, antimodelo, banco de experiências
- QA que barra texto genérico
- Estratégia antes de produzir
- Carrossel em PNG, com guia visual obrigatório e cinco desenhos de slide. Foto de banco só com a sua chave. Sem chave, o slide fica gráfico
- Reel editado no ffmpeg: corte, silêncio, legenda e B-roll com o gancho por cima
- Página HTML e deploy na Cloudflare Pages ou na Netlify, com o seu token
- Proposta a partir da call, abordagem de WhatsApp em 4 etapas (sem disparo), anúncio de Meta e Google, painel local

Três planos, o mesmo código. O `/instalar` pergunta qual é o seu e grava em `config/tier.json`. Dá para trocar depois, sem reinstalar.

| Plano | Você usa | Observação |
|---|---|---|
| Grátis | VS Code + Gemini CLI, ou o plano grátis do Google Antigravity | Tem que funcionar de ponta a ponta. PNG, vídeo e página não gastam API |
| Pago | VS Code + Claude Code, no Claude Pro | Mesmos scripts, com os agentes em `.claude/agents/` |
| Pago Plus | Claude Pro ou Max, mais HeyGen e ElevenLabs | Roteiro de clone. O envio do avatar continua manual na v1, e só com autorização |

## Instalar

Precisa de Node 18 ou mais, Google Chrome, ffmpeg e ffprobe. As fontes já vêm na pasta.

```bash
git clone https://github.com/gustavokadi/equipe-konverte.git
cd equipe-konverte
node motor/instalar.js --tier gratis --sim
```

Troque `gratis` por `pago` ou `pago-plus` se for o seu caso. Sem `--sim`, o script pergunta o plano.

No npm 11, o postinstall do Puppeteer (o que baixa um Chrome próprio) costuma ser bloqueado. Este projeto não usa esse postinstall. A dependência é `puppeteer-core`, e o render abre o Chrome que já está instalado.

Para ver se a base responde:

```bash
npm test
```

O teste reinstala a checagem, renderiza o carrossel da demo, edita o reel de amostra e gera o painel.

### Plano grátis

1. Instale o [VS Code](https://code.visualstudio.com/).
2. Instale o [Gemini CLI](https://github.com/google-gemini/gemini-cli) ou o Antigravity no plano grátis.
3. Abra esta pasta.
4. Gemini CLI lê `GEMINI.md`. Antigravity lê `GEMINI.md` e `AGENTS.md`.
5. Peça `/instalar` se ainda não rodou o script, depois `/painel` para ver a demo.

### Plano pago

1. VS Code e [Claude Code](https://claude.com/claude-code), com Claude Pro.
2. `node motor/instalar.js --tier pago --sim`
3. Na pasta, rode `claude`.
4. O Claude lê `CLAUDE.md`, os comandos em `.claude/commands/` e as skills em `.claude/skills/`.

### Plano pago plus

Os passos do plano pago, mais as chaves no `.env` (copie de `.env.example`):

```bash
HEYGEN_API_KEY=
ELEVENLABS_API_KEY=
```

`/roteiro-clone` sempre pode escrever o texto. Sem plano pago plus, sem as duas chaves e sem um arquivo de autorização da pessoa, ninguém gera avatar. O comando `node motor/clone.js` não chama essas APIs.

### Trocar de plano

```bash
node motor/instalar.js --tier pago-plus --sim
```

## Primeiro cliente de verdade

```bash
node motor/novo-cliente.js --nome "Nome do negócio"
```

Ou, dentro do editor, `/novo-cliente`. Enquanto a memória tiver buraco, o QA não deixa produzir. O onboarding pede voz real, 8 experiências, teses e antimodelo. Não inventamos caso para "adiantar".

A demo pronta está em `clientes/clinica-sorriso-bom`. Leia o `DEMO.md` de lá antes de mostrar para alguém.

## Comandos

| Comando | Entrega |
|---|---|
| `/instalar` | Checagem da máquina e o plano |
| `/novo-cliente` | Pasta `clientes/<nome>/` |
| `/radar` | Ideias do dia no nicho, por RSS |
| `/pautas` | Calendário do mês |
| `/carrossel` | PNG e legenda, depois do guia visual |
| `/reels` | Roteiro e mp4 editado |
| `/roteiro-clone` | Roteiro para HeyGen e ElevenLabs |
| `/site` | HTML e, se você pedir, deploy |
| `/proposta` | Proposta a partir da transcrição |
| `/prospeccao` | 4 mensagens de WhatsApp, para você copiar |
| `/anuncio` | Meta e Google, sem subir campanha |
| `/painel` | `painel/index.html` |
| `/salvar` | Registro, aprovação, status de publicado |
| `/seo` | Título, descrição e página |

Codex usa `AGENTS.md`. A lista aponta para a mesma skill.

## Prospecção, sem disparo

As quatro etapas estão na skill e no exemplo `clientes/clinica-sorriso-bom/prospeccao/abordagem-dentista.md`.

1. Oi, tudo bem?
2. Quem somos e o que fazemos, terminando com: "Posso te mostrar um modelo de como ficaria o de vocês?"
3. O modelo
4. Preço só depois de uma reação boa

Volume baixo, aquecer o número, nunca em massa, uma mensagem por vez, primeiro os chats que já existem. Não há código de envio.

## Vídeo

O caminho padrão é ffmpeg, de graça. Transcrição, se você quiser automática, é Whisper na sua máquina (`pip install -U openai-whisper` ou whisper.cpp). Sem isso, o reel aceita um `.srt` escrito no roteiro.

Remotion e HyperFrames são extras. Remotion, para empresa com mais de 3 pessoas, pede Company License, e automação de render tem outro plano. Detalhe em `TERCEIROS.md` e na skill `video-opcional`. Os arquivos desses projetos não foram copiados para cá.

## Chaves que ficam com você

Tudo opcional. O plano grátis roda com o `.env` vazio.

- `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY` e `PIXABAY_API_KEY`, fotos do carrossel. Sem chave, o slide fica gráfico. O crédito vai para `referencias/banco/creditos.md`. Freepik é pago e só no plano pago plus, e a v1 não chama essa API
- `FIRECRAWL_API_KEY`, radar além do RSS. O código do Firecrawl é AGPL e não vem junto
- `CLOUDFLARE_API_TOKEN` ou `NETLIFY_AUTH_TOKEN`, só na hora de publicar a página
- HeyGen e ElevenLabs, só no pago plus

Segurança a mais, opcional: `npx -y cc-safety-net@latest install`. É MIT e não está copiado aqui.

## Preços da agência

`agencia/oferta.md` tem o preço oficial de cuidado gerenciado: R$ 2.000 por mês, por enquanto, quando o cliente quer que a agência cuide. Não há outros preços de agência nesse arquivo.

## Licença

Uso de um comprador, sem revenda do pacote. O arquivo `LICENSE` pede revisão jurídica antes de valer como contrato. Peças feitas para o cliente da agência podem ser entregues a ele. Os arquivos do sistema, não.

## Versão

`VERSION` e `CHANGELOG.md`. O que fica para a v2 está em `ROADMAP-V2.md`: agendamento no Metricool, newsletter e o MCP de Meta Ads.

Roteiro do vídeo de instalação: `guias/roteiro-video-instalacao.md`.
