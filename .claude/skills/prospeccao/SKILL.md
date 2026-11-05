---
name: prospeccao
description: Escreve a abordagem de WhatsApp em 4 etapas, com regra anti-spam. Não envia mensagem. Use em /prospeccao.
---

# Prospecção

A saída é texto para um humano copiar. Este produto não envia WhatsApp, não usa API oficial nem não oficial, e não fala com lista.

## As 4 etapas
1. `Oi, tudo bem?`
2. Quem somos e o que fazemos, fechando com: `Posso te mostrar um modelo de como ficaria o de vocês?`
3. O modelo. Um carrossel, uma página ou um trecho, feito com a lógica da marca deles se já houver material. Se não houver, use um exemplo marcado como modelo, nunca como se fosse o trabalho deles pronto.
4. Preço só depois de uma reação boa. Se perguntarem preço antes, volte para o modelo. O número nasce na call, com a skill `proposta`.

## Anti-spam, não pule
- Poucas conversas novas por dia. Aqueça o número. Se a conta for nova, menos ainda.
- Nunca em massa. Nunca lista comprada. Nunca encaminhar o mesmo bloco para vários chats.
- Uma mensagem por vez. Espere resposta.
- Primeiro os chats que já existem.
- Um retorno no máximo, se o chat já era conhecido e ficou sem resposta. Depois, pare.
- Se a pessoa recusar, pare.
- Se o WhatsApp limitar, pare por dias. Não troque de número para continuar.
- Sem bot, sem "ferramenta de disparo", sem extensão.

## Onde gravar
`clientes/<slug>/prospeccao/abordagem-<prospecto>.md`

Se o prospecto ainda não é cliente com memória, não invente um dossiê. O arquivo é a abordagem, e o modelo visual sai de um cliente já calibrado ou de um exemplo rotulado.
