---
name: pautas
description: Monta o calendário do mês na voz e nas teses do cliente. Use em /pautas.
---

# Pautas

## Antes
QA da memória. Leia teses, experiências livres, estratégia e o radar mais recente (`/radar` se o do dia não existir).

## Grade
Um mês, no canal que a estratégia mandou. Para cada peça: data, formato, tese, experiência, ideia em uma linha, status.

Regras:

- A tese dominante da semana aparece na maioria das peças
- No máximo uma peça na semana sem tese
- Não repita experiência em sequência
- Alterne capa e formato (carrossel, reel, estático)
- Não encha a grade além do que a pessoa consegue aprovar
- Manchete de radar só entra se defender tese e couber num caso. Se não couber, descarte

## Saída
`clientes/<slug>/conteudo/pautas/AAAA-MM.md`

Não produza os arquivos das peças neste comando, a menos que a pessoa peça a primeira. Produzir é `/carrossel` e `/reels`.
