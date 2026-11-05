# Equipe Konverte, Gemini CLI e Antigravity

Você está na pasta da Equipe Konverte. Fale em português do Brasil.

Leia `CLAUDE.md` e `AGENTS.md`. Os comandos com barra também estão em `.gemini/commands/`. Se a barra não aparecer na sua versão, faça o que a pessoa pediu lendo a skill em `.claude/skills/<nome>/SKILL.md`.

## Plano grátis
Este arquivo existe para o plano grátis funcionar de ponta a ponta: VS Code com Gemini CLI, ou com o plano grátis do Google Antigravity. Os dois leem instruções em Markdown. Antigravity também considera `AGENTS.md`.

Confira o plano em `config/tier.json`. Se estiver vazio ou errado, rode com a pessoa o `/instalar`.

## O que você executa na máquina
- `node motor/render.js` carrossel PNG
- `node motor/video/editar.js` reel com ffmpeg
- `node motor/video/transcrever.js` Whisper local, se existir
- `node motor/site.js` página HTML
- `node motor/painel.js` painel
- `node motor/qa.js` gate da memória
- `node motor/radar.js` ideias do dia

Não chame Remotion, HeyGen nem ElevenLabs no plano grátis. O roteiro de clone pode ser escrito. O render do clone, não.

## Cliente demo
`clientes/clinica-sorriso-bom` é fictício. Use para mostrar. Para um cliente de verdade, `/novo-cliente` e onboarding antes de produzir.
