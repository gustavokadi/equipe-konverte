---
name: novo-cliente
description: Cria a pasta de um cliente com memória de voz, oferta, identidade e transcrições. Use em /novo-cliente.
---

# Novo cliente

## Passos
1. Peça o nome do negócio. Um cliente por pasta. Não misture memória.
2. Rode `node motor/novo-cliente.js --nome "Nome do negócio"`.
3. Se a pessoa já tiver transcrição, PDF ou site, guarde em `clientes/<slug>/transcricoes/` e leia com `node motor/ler-material.js --entrada <arquivo>` quando for PDF ou Office. O MarkItDown é MIT e se instala à parte: `pip install 'markitdown[all]'`.
4. Rode o onboarding (skill `onboarding`) antes de qualquer peça. O QA bloqueia enquanto houver `{{ }}`, DNA vazio ou menos de 8 experiências.
5. Antes de qualquer carrossel, confira `referencias/`. Se só existir `PEDIDO.md`, pare e peça Pinterest, 2 a 3 concorrentes, posts que gosta e que não gosta, logo, cores e fontes. O guia `guia-visual.md` nasce dessa leitura, inclusive das imagens.
6. Mostre o caminho da pasta e a lista do que ainda está por preencher. Não invente caso, preço nem frase de efeito para "adiantar".

## Memória que a pasta precisa ter
- `perfil.json`
- `memoria/empresa.md`, `persona.md`, `preferencias.md`, `estrategia.md`
- `memoria/dna-de-voz.md` a partir de material real
- `memoria/experiencias.md` com no mínimo 8
- `memoria/teses.md` e `memoria/antimodelo.md`
- `identidade/paleta.css` e `identidade/tipografia.md`
- `referencias/` com material visual real e `guia-visual.md`
- `transcricoes/` para calls

## Cliente de demonstração
`clinica-sorriso-bom` já vem preenchido e é fictício. Não use a pasta dele como modelo de cliente real. Use `clientes/_modelo`.
