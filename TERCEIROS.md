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

## Bancos de foto

Conferido nas páginas oficiais em 05/11/2026. A chave é de quem comprou. Sem chave, o carrossel não baixa imagem.

### Pexels
Documentação: https://www.pexels.com/api/documentation/
Licença do conteúdo: https://www.pexels.com/license/

A API pede header `Authorization` com a chave. Limite padrão: 200 pedidos por hora e 20.000 por mês. A documentação pede um link visível para o Pexels e, quando der, o crédito do fotógrafo com link da foto. A licença do conteúdo permite uso gratuito, inclusive comercial. Atribuição não é obrigatória nessa licença, mas a diretriz da API pede o link. Não vender a foto sem alteração, não usar pessoa identificável de forma ofensiva, não sugerir endosso, não redistribuir o arquivo como banco, não usar a imagem como marca.

O script grava o crédito em `referencias/banco/creditos.md` mesmo a licença não exigindo.

### Unsplash
Diretrizes da API, 27/07/2026: https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines

É obrigatório usar as URLs que a API devolve, chamar `download_location` quando a foto é escolhida, e atribuir Unsplash e o fotógrafo com link e `utm_source` / `utm_medium=referral`. A chave fica só no `.env`. Não dá para copiar a experiência central do Unsplash nem vender a foto sem alteração. A API é para uso não automatizado em massa.

O carrossel precisa de arquivo local para virar PNG offline. O script baixa a imagem, chama `download_location` e grava o crédito com os parâmetros utm. Quem cria a chave precisa ter o aplicativo aceito nas diretrizes da Unsplash.

### Pixabay
API: https://pixabay.com/api/docs/
Resumo da licença: https://pixabay.com/service/license-summary/

A licença permite uso gratuito e modificação. Atribuição não é obrigatória no resumo, e mesmo assim o script registra autor e página. A API pede para mostrar a origem quando os resultados aparecem, cache de 24 horas, e proíbe hotlink permanente: a imagem tem que ser baixada. Limite padrão: 100 pedidos a cada 60 segundos. Download em massa é proibido. Não vender o arquivo sozinho, sem trabalho em cima. Não usar de forma enganosa nem como marca.

### Freepik, só plano pago plus
A API pública atual é a Magnific (antes Freepik API): https://www.freepik.com/api

É paga, em créditos do plano de quem comprou, e inclui biblioteca de estoque. A v1 não chama essa API. Não coloque a chave no plano grátis nem no pago. Se um dia entrar, fica atrás do plano pago plus e de um pedido explícito, porque cada chamada gasta crédito.

## ffmpeg
O binário do ffmpeg na máquina do comprador segue a licença da build que ele instalou. O script nosso só chama o comando. Build típica de distribuição Linux é GPL. Não embarcamos o binário.
