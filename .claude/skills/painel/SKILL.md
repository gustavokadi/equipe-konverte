---
name: painel
description: Gera o painel HTML local com o que foi produzido, aprovado e publicado. Use em /painel.
---

# Painel

```bash
node motor/painel.js
```

Abra `painel/index.html` no navegador. É arquivo local. Não é site público e não publica peça.

Os números saem de `registro.json` de cada cliente. Produzido é o que os comandos registraram. Aprovado e publicado só mudam com `/salvar`.

Se o número estiver velho, rode o painel de novo. Não edite o HTML na mão.
