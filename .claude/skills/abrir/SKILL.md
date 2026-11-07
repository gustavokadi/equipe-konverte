---
name: abrir
description: Abre o dia com um resumo curto do plano, da memória e das pendências que já estão no registro. Use em /abrir. Não cria tarefa nem envia nada.
---

# Abrir

Começo de sessão. Lê o que já está gravado. Não inventa número, pendência ou próximo passo que o comando não listou.

## Comando
```bash
node motor/abrir.js
node motor/abrir.js --cliente <slug>
```

Se a pessoa não nomear o cliente e houver mais de um, rode sem `--cliente` e mostre os dois. Não misture pastas.

## O que dizer
Repita em poucas linhas:

- o plano
- o que está preenchido ou incompleto na memória
- cada item com status `aguardando`, com tipo e id
- quantos estão aprovados e quantos publicados

Se o registro não tiver aguardando, diga que não há pendência registrada. Não crie uma lista de tarefas para "adiantar o dia".

## Não faça
- Não rode produção, deploy, e-mail ou publicação por conta própria
- Não marque item como aprovado
- Não complemente com suposição ("acho que o cliente pediu X")
