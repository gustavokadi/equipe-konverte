---
name: anuncio
description: Escreve variações de anúncio para Meta e Google, dentro do limite de caracteres e da voz do cliente. Use em /anuncio. Não sobe campanha.
---

# Anúncio

## Antes
Estratégia. Se os 30 dias dizem "sem mídia", entregue o rascunho e avise que ligar a campanha fura o plano. Não suba nada. O MCP de Meta Ads fica para a v2.

QA da memória. Oferta e preço têm que estar na memória. Sem isso, não escreva número.

## Meta
Duas variações no mínimo. Texto principal na voz do cliente. Título curto. Descrição que não repete o título. CTA coerente com a página. Público em uma linha, alinhado à persona. Sem antes e depois se o antimodelo vetar.

## Google
Títulos até 30 caracteres. Descrições até 90. Pelo menos 4 títulos e 2 descrições. Palavras que a persona digitaria. Lista de negativas óbvias (vaga, curso, grátis), ajustada ao nicho.

## Saída
`clientes/<slug>/anuncios/meta.md` e `google.md`. Passe o QA nos dois. Status aguardando.

Não peça login de anúncio. Não crie campanha. Não gaste verba.
