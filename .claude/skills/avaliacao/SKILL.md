---
name: avaliacao
description: Escreve a resposta a uma avaliação do Google que a pessoa colou, na voz do negócio, só para revisar e copiar. Use em /avaliacao. Não publica no Google.
---

# Avaliação

Texto para a pessoa copiar no Google. Este comando não entra na conta do Google e não publica.

## Antes
1. Cliente definido.
2. A pessoa cola o texto da avaliação. Se não colou, peça e pare. Não invente a review.
3. Leia `memoria/dna-de-voz.md`, `memoria/preferencias.md`, `memoria/antimodelo.md` e `memoria/empresa.md`.

## Como escrever
Uma ou duas frases. Na voz do negócio. Se a review trouxer o nome, use o nome. Agradeça sem fórmula de empresa grande. Uma frase concreta sobre o serviço que já está na memória. Sem travessão. Sem palavra proibida do antimodelo. Sem prometer o que a avaliação não pediu.

Exemplo de tamanho, não de conteúdo:

> Ana, obrigado por falar da avaliação. A gengiva vem antes do gel, e foi isso que a gente fez.

## Onde gravar
`clientes/<slug>/avaliacoes/AAAA-MM-DD-<apelido>.md`

```markdown
# Resposta para copiar

Status: aguardando revisão. Não publicada.

## Avaliação colada
...

## Resposta
...
```

Depois:

```bash
node motor/registrar-rascunho.js --cliente <slug> --tipo avaliacao --id <id> --caminho avaliacoes/<arquivo>.md
```

## Não faça
- Não publique, não peça login do Google, não chame API
- Não responda no lugar da pessoa
