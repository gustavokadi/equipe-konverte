---
name: salvar
description: Grava o que foi feito na memória do cliente e só marca publicado depois da aprovação. Use em /salvar.
---

# Salvar

```bash
node motor/salvar.js --cliente <slug> --nota "o que ficou decidido nesta sessão"
```

Aprovar uma peça:

```bash
node motor/salvar.js --cliente <slug> --aprovar <id>
```

Publicar o status (não envia para rede nenhuma):

```bash
node motor/salvar.js --cliente <slug> --publicar <id>
```

`--publicar` recusa item que ainda não foi aprovado.

Atualize também, quando for o caso:

- experiência marcada como usada
- tese dominante da semana
- `aprovacao/fila.md`

Não dê `git commit` a menos que a pessoa peça. Não dê push. Não coloque `.env` no commit.
