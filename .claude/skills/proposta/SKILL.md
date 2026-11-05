---
name: proposta
description: Monta proposta comercial a partir da transcrição da call, com ancoragem de preço. Use em /proposta.
---

# Proposta

## Entrada
A transcrição em `clientes/<slug>/transcricoes/`. Se for áudio, transcreva no caminho local (`motor/video/transcrever.js`) ou peça o texto. Se for PDF, `motor/ler-material.js`.

Leia `agencia/oferta.md`. Use só o preço que estiver escrito lá. Hoje o cuidado gerenciado é R$ 2.000 por mês, por enquanto, quando o cliente quer que a agência cuide. Não invente outro pacote nem outro valor. Os planos grátis, pago e pago plus são da ferramenta de R$ 97, não desta tabela.

Se o arquivo voltar a dizer EXEMPLO, a proposta sai como rascunho e não se manda.

## Estrutura
1. O que a pessoa disse que quer, em frase dela, não em jargão
2. O que a agência passa a cuidar no primeiro mês, amarrado na estratégia
3. O que continua com o cliente
4. O preço oficial, depois do escopo
5. Próximo passo único

Ancoragem é ordem, não pressão. Nada de desconto na primeira versão. Nada de prazo falso.

Grave em `clientes/<slug>/propostas/AAAA-MM-DD-rascunho.md`. Status aguardando. Não envie e-mail nem WhatsApp.
