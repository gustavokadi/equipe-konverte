# Terceiros e licenças

Conferido em 5 de novembro de 2026. Licença muda. Antes de atualizar um extra, leia o repositório de novo.

## Dentro deste repositório

| Peça | Origem | Licença | O que foi feito |
|---|---|---|---|
| Método (voz, teses, antimodelo, experiências, QA, estratégia antes da execução, aprovação) | ecossistema-ia-template, do mesmo autor, https://github.com/gustavokadi/ecossistema-ia-template | repositório do próprio Gustavo, sem licença pública | Reescrito aqui, em comandos e skills. O outro repositório não foi modificado |
| Motor HTML para PNG | o mesmo template, `scripts/render-engine.js` | o mesmo | Reimplementado em `motor/render-engine.js`, com fontes locais e Chrome do sistema |
| Bebas Neue | The Bebas Neue Project Authors | SIL OFL 1.1 | Arquivo em `motor/fontes`, com `OFL-BebasNeue.txt` |
| Inter | The Inter Project Authors | SIL OFL 1.1 | Regular e Bold instanciados da fonte variável oficial, para Chrome e ffmpeg. `OFL-Inter.txt` |
| puppeteer-core | Google, via npm | Apache-2.0 | Dependência. Não usamos o pacote `puppeteer` completo, para fugir do postinstall que quebra no npm 11 |

## Usado por instalação, sem copiar o código

| Projeto | Licença | Como a v1 usa |
|---|---|---|
| microsoft/markitdown | MIT | `pip install 'markitdown[all]'` e `motor/ler-material.js` |
| kenryu42/cc-safety-net | MIT | `npx -y cc-safety-net@latest install`, opcional, na máquina |
| obra/superpowers | MIT | A ordem de trabalho foi adaptada na skill `metodo`. O texto das skills deles não foi copiado |
| coreyhaines31/marketingskills | MIT | A skill `seo` e o `/anuncio` são texto nosso. A lista de temas (SEO, copy, página) vem dessa família de skills, sem colar os arquivos |
| anthropics/skills, pasta frontend-design | Apache-2.0 | Não copiada. A skill `design` é texto nosso. Dá para instalar a original à parte |

## Não copiado, de propósito

| Projeto | Licença vista | Decisão |
|---|---|---|
| firecrawl/firecrawl | AGPL-3.0 | Não entra no pacote. O `/radar` usa RSS. Se houver `FIRECRAWL_API_KEY`, o script chama a API hospedada, processo separado |
| Felpborges/skill-reel | sem licença no GitHub | Não copiar. Edição própria em `motor/video/editar.js` |
| remotion-dev/skills | sem arquivo de licença no repositório | Não copiar. Link na skill `video-opcional` |
| remotion-dev/remotion | licença própria, não é OSI | Extra opcional. Ver abaixo |
| heygen-com/hyperframes | Apache-2.0 | Não vendemos o framework. A pessoa instala se quiser. Skills úteis: hyperframes, hyperframes-cli, slideshow |

## Remotion, leia antes de usar em cliente

Fonte: https://www.remotion.dev/docs/license e a FAQ, lidas em 05/11/2026.

Dá para usar de graça se for pessoa física, organização de até 3 pessoas, organização sem fins lucrativos, ou avaliação ainda sem uso comercial.

Empresa ou equipe com 4 pessoas ou mais precisa de Company License, mesmo que só uma pessoa escreva o vídeo. Quem automatiza render (`renderMedia`, `npx remotion render`, Player, Lambda e o que a FAQ lista) entra em Remotion for Automators, com piso mensal. Quem só produz vídeo, sem essa automação, entra em Remotion for Creators.

A Equipe Konverte não inclui Remotion no `package.json`. O caminho padrão de reel é ffmpeg, que não passa por essa licença.

## ffmpeg
O binário do ffmpeg na máquina do comprador segue a licença da build que ele instalou. O script nosso só chama o comando. Build típica de distribuição Linux é GPL. Não embarcamos o binário.
