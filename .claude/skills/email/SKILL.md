---
name: email
description: Escreve rascunho de e-mail de orçamento, atendimento ou acompanhamento, na voz do negócio. Use em /email. Não envia e não conecta em serviço de e-mail.
---

# E-mail

Rascunho para a pessoa copiar no próprio e-mail. Sem SMTP, sem API, sem botão de envio.

## Tipos
Só estes três. Se a pessoa não disser qual é, pergunte e pare.

- `orcamento`: responde um pedido de preço com o que está em `agencia/oferta.md` ou na oferta do próprio cliente. Não invente número.
- `atendimento`: responde uma dúvida ou um pedido do dia a dia.
- `acompanhamento`: retoma um assunto que já está na memória ou numa transcrição. Se o assunto não estiver escrito, pergunte. Não invente o que foi combinado.

## Antes
Cliente definido. Leia DNA de voz, preferências, antimodelo e empresa. Para orçamento da agência, leia `agencia/oferta.md` e use só o preço que estiver lá.

## Como escrever
Assunto em uma linha. Corpo curto: por que escreve, o que oferece ou o que pergunta, um próximo passo. Sem travessão. Sem palavra proibida.

Exemplo de tamanho:

> Assunto: Avaliação no Cambuí
>
> Ana, a avaliação é R$ 150. Se a gengiva não estiver quieta, o gel não entra nesse dia. Quer que eu reserve um horário?

## Onde gravar
`clientes/<slug>/emails/AAAA-MM-DD-<tipo>.md` com assunto, corpo e a linha `Status: rascunho, não enviado.`

```bash
node motor/registrar-rascunho.js --cliente <slug> --tipo email --id <id> --caminho emails/<arquivo>.md
```

## Não faça
- Não envie
- Não peça senha de e-mail
- Não crie follow-up automático
