---
name: proposta
description: Monta proposta comercial a partir da transcrição da call, com ancoragem de preço. Use em /proposta.
---

# Proposta

## Entrada
A transcrição em `clientes/<slug>/transcricoes/`. Se for áudio, transcreva no caminho local (`motor/video/transcrever.js`) ou peça o texto. Se for PDF, `motor/ler-material.js`.

Leia `agencia/oferta.md`.

## Se a oferta ainda for exemplo
O arquivo de preços da v1 está marcado como EXEMPLO ILUSTRATIVO. Nesse caso:

- Monte o rascunho para a pessoa ver a estrutura
- Comece o arquivo com "RASCUNHO DE DEMONSTRAÇÃO"
- Não diga para enviar ao cliente
- Peça ao Gustavo, ou ao dono da agência, a tabela oficial

## Estrutura
1. O que a pessoa disse que quer, em frase dela, não em jargão
2. O que entra no primeiro mês, amarrado na estratégia
3. O que fica de fora
4. Um pacote, o que cabe na meta. O de cima só se ela pedir
5. Preço depois do escopo
6. Próximo passo único

Ancoragem é ordem, não pressão. Nada de desconto na primeira versão. Nada de prazo falso.

Grave em `clientes/<slug>/propostas/AAAA-MM-DD-rascunho.md`. Status aguardando. Não envie e-mail nem WhatsApp.
