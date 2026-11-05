---
name: video-opcional
description: Explica Remotion e HyperFrames como extras, com a licença, sem instalar e sem copiar o código. O caminho padrão continua sendo o ffmpeg.
---

# Vídeo opcional

O `/reels` padrão não usa isto. Só leia esta skill se a pessoa pedir motion gráfico em código ou o conjunto da HeyGen.

## Remotion
Repositório de skills: https://github.com/remotion-dev/skills. Aquele repositório não publica uma licença de código que autorize cópia. Por isso os arquivos não estão aqui. A pessoa instala por conta, se quiser, e lê a licença em https://www.remotion.dev/docs/license.

Resumo verificado em 05/11/2026, para orientar, não para substituir o texto oficial:

- Licença grátis: pessoa física (uso pessoal ou comercial), organização de até 3 pessoas, organização sem fins lucrativos, ou quem ainda está avaliando e não usa de forma comercial.
- Fora isso, precisa de Company License.
- Company License para quem produz vídeo sem automação: Remotion for Creators, cobrado por pessoa que escreve o código.
- Automação (chamar render por código, `npx remotion render`, Player, Lambda e equivalentes) cai em Remotion for Automators, com mínimo mensal e valor por render.
- Empresa com mais de 3 pessoas precisa da licença da empresa mesmo que só uma pessoa use.

Se a agência do comprador tem 4 pessoas ou mais, não trate o Remotion como grátis. Não rode render em automação sem a licença certa. Na dúvida, ffmpeg.

## HyperFrames
https://github.com/heygen-com/hyperframes é Apache-2.0. Dá para usar em produto, com o aviso de licença, se a pessoa instalar o projeto deles. O código não foi vendido nesta v1 para não carregar o framework inteiro. Skills úteis no repositório deles: `hyperframes`, `hyperframes-cli`, `slideshow`.

## skill-reel
https://github.com/Felpborges/skill-reel não tem arquivo de licença. Não copie. O editor em `motor/video/editar.js` foi escrito para este produto.
