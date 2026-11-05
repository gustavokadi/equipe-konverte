---
name: carrossel
description: Gera os slides em PNG e a legenda pronta para postar, na voz do cliente. Use em /carrossel.
---

# Carrossel

Render local, HTML para PNG. Não use gerador de imagem pago. As fontes Bebas Neue e Inter já estão em `motor/fontes`.

## Antes
1. Cliente definido. Se não estiver, pergunte.
2. `node motor/qa.js --cliente <slug>`
3. Skill `estrategia`. Escolha uma tese e uma experiência livre.
4. Skill `design` para o quadro. Cores só da paleta.

## Escrever
- 1080x1350, salvo pedido de post único 1080x1080.
- Capa, 2 a 4 slides internos, CTA.
- Uma ideia por slide. Fala do DNA, não fala de agência.
- Legenda: primeira linha forte, 3 a 5 linhas, no máximo 4 itens, no máximo 6 hashtags, CTA.
- Sem travessão.

Grave a spec em `clientes/<slug>/conteudo/specs/AAAA-MM-DD_tema.json`, no formato do exemplo `clinica-sorriso-bom`.

## Render
```bash
node motor/render.js --cliente <slug> --spec <arquivo.json>
```

Se precisar de HTML próprio, `motor/render-engine.js` exporta `criarCarrossel`. O caminho normal é a spec.

## Depois
1. Abra o PNG. Se o título estourar ou a fonte cair em genérica, corrija e renderize de novo.
2. Rode o QA no `legenda.md`.
3. Marque a experiência como usada.
4. O registro já fica "aguardando". Não publique. A pessoa aprova com `/salvar`.

Foto de banco só com `PEXELS_API_KEY`. Sem a chave, siga sem foto. Foto do cliente, se existir, entra por `getNextPhoto` e não repete em sequência.
