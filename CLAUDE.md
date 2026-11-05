# Equipe Konverte

Produto da Konverte para rodar uma equipe de marketing dentro do VS Code. Preço de vitrine: R$ 97. Público: quem está abrindo ou crescendo uma agência pequena, e dono de negócio que faz o próprio marketing.

Fale em português do Brasil. Escreva peça em português do Brasil.

## Como a equipe trabalha
1. Um comprador, vários clientes. Cada cliente mora em `clientes/<slug>/`.
2. Onboarding com DNA de voz, teses, antimodelo, no mínimo 8 experiências e referências visuais. Sem `guia-visual.md`, o carrossel não começa.
3. Estratégia antes da execução. Skill `estrategia`, agente `estrategista`.
4. Produzir na voz do cliente, puxando uma tese e uma experiência.
5. QA bloqueante. Conteúdo genérico não passa.
6. Aprovação antes de publicar. Saída nasce "aguardando". `/salvar` aprova. Publicar status sem aprovação é recusado. Nenhuma rede recebe post sozinha.

O jeito de conduzir a conversa está na skill `metodo`.

## Planos
O plano fica em `config/tier.json`. Troca sem reinstalar: `node motor/instalar.js --tier <gratis|pago|pago-plus> --sim`.

| Plano | O que a pessoa usa | O que roda igual |
|---|---|---|
| grátis | VS Code + Gemini CLI ou Antigravity grátis | carrossel, reel ffmpeg, site local, pauta, proposta, painel |
| pago | VS Code + Claude Code no Claude Pro | o mesmo, com estes agentes |
| pago plus | Claude Pro ou Max + HeyGen e ElevenLabs | o mesmo, e o roteiro de clone pode ir para avatar e voz, com autorização |

Render de PNG, vídeo e página não gasta API de IA. Quem gasta token é a conversa com o modelo, no plano que a pessoa já tem.

## Comandos
`/instalar` `/novo-cliente` `/radar` `/pautas` `/carrossel` `/reels` `/roteiro-clone` `/site` `/proposta` `/prospeccao` `/anuncio` `/painel` `/salvar`

Cada um tem arquivo em `.claude/commands/` e skill em `.claude/skills/<nome>/SKILL.md`. Siga a skill. Não resuma por cima dela.

## O que não fazer
- Não enviar WhatsApp. `/prospeccao` entrega texto para copiar, com regra anti-spam.
- Não subir anúncio. Meta Ads MCP é roadmap v2.
- Não publicar site sem token da pessoa e sem `--publicar`.
- Não copiar código sem licença. Ver `TERCEIROS.md`.
- Não tratar o cliente `clinica-sorriso-bom` como real. Ele é demonstração.

## Mapa
- `clientes/` memória e entregas
- `motor/` render, ffmpeg, instalação, QA, painel, deploy
- `motor/fontes/` Bebas Neue e Inter, OFL
- `agencia/oferta.md` preço oficial de cuidado gerenciado: R$ 2.000 por mês, por enquanto. Sem outros preços de agência.
- `painel/index.html` painel local
- `AGENTS.md` e `GEMINI.md` para Codex, Gemini CLI e Antigravity
