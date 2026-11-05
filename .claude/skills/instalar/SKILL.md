---
name: instalar
description: Instala a Equipe Konverte, confere Node, Chrome, ffmpeg e fontes, e grava o plano (grátis, pago ou pago plus). Use quando a pessoa pedir /instalar ou for o primeiro uso.
---

# Instalar

Fale em português do Brasil.

## O que este comando faz
Confere a máquina, instala a dependência local de render e grava o plano em `config/tier.json`. Não baixa Chrome pelo postinstall do Puppeteer. No npm 11 esse postinstall costuma ser bloqueado. O projeto usa `puppeteer-core` e o Chrome que já está no computador.

## Passos
1. Pergunte qual plano a pessoa comprou, se ela ainda não disse:
   - `gratis`: VS Code com Gemini CLI ou com o plano grátis do Google Antigravity
   - `pago`: VS Code com Claude Code, no Claude Pro
   - `pago-plus`: Claude Pro ou Max, mais HeyGen e ElevenLabs para clone de avatar e voz
2. Rode `node motor/instalar.js --tier <plano> --sim`
3. Leia a saída. Se algum item falhar, pare e diga o que falta. Não invente que passou.
4. Diga como abrir o plano escolhido:
   - grátis: esta pasta no VS Code, com Gemini CLI ou Antigravity, lendo `GEMINI.md` e `AGENTS.md`
   - pago e pago plus: `claude` nesta pasta
5. Aponte o cliente fictício `clientes/clinica-sorriso-bom` como o primeiro lugar para ver um carrossel e um reel prontos.
6. Segurança opcional, sem copiar o código: `npx -y cc-safety-net@latest install` e depois `npx -y cc-safety-net@latest doctor`. O pacote é MIT. Não rode isso sem a pessoa aceitar, porque mexe na configuração do agente na máquina.

## Trocar de plano
Sem reinstalar: `node motor/instalar.js --tier pago --sim` (ou `gratis`, ou `pago-plus`).

## Não faça
- Não peça cartão.
- Não grave chave de API em arquivo commitado. Chave fica no `.env`, que não entra no git.
- Não instale Remotion nem HyperFrames aqui. São extras, com licença própria. Ver `TERCEIROS.md`.
