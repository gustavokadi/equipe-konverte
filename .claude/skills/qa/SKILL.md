---
name: qa
description: Gate bloqueante de qualidade. Reprova conteúdo genérico, fora da voz, fora da paleta ou com promessa proibida. Use antes de mostrar qualquer peça como pronta.
---

# QA bloqueante

Nada é "pronto" com ressalva. Se falhar, corrija e rode de novo.

## Memória
`node motor/qa.js --cliente <slug>`

Tem que passar: DNA, 8 experiências, teses, antimodelo, paleta, zero `{{ }}`.

## Texto da peça
`node motor/qa.js --cliente <slug> --arquivo <arquivo>`

O script reprova travessão e as palavras da seção "proibidas" do antimodelo. Além do script, reprove você mesmo se:

1. A peça serviria para qualquer marca. Não usa caso, cidade, oferta ou fala do cliente.
2. Não há tese, salvo a exceção semanal já registrada.
3. Não há experiência do banco, quando o banco tem caso livre.
4. Headline não diz o que a pessoa ganha ou o que está em jogo.
5. CTA ausente, ou "saiba mais" sem contexto.
6. Promessa que o cliente não pode cumprir. Número inventado. Depoimento inventado.
7. Cor fora de `identidade/paleta.css`.
8. Tom de guru: jornada, transformação, método revolucionário, "você sabia que".
9. Hashtag demais. No máximo 6 no carrossel, 8 se a peça for só distribuição e a memória permitir.
10. Para site: sem CTA visível, sem responsivo, com overflow horizontal.

## Redes, além do texto
- Capa legível em miniatura. Até 10 palavras no título.
- Um ideia por slide. Número no canto a partir do segundo.
- Texto com margem. Não encha o quadro.
- Reel: gancho nos 3 segundos, uma ideia, CTA no fim.
- Não repita o mesmo tipo de capa da peça anterior.

## Tendência, sem copiar moda cega
Combo da semana: carrossel e reel, não um só. Responder comentário é regra de operação humana, não deste script. Não use áudio de trend se a tese pedir silêncio.

## Saída
Grave um bloco curto no `ficha.md` da peça: passou, ou a lista do que foi corrigido. Sem isso, não mova o status para fora de "aguardando".
