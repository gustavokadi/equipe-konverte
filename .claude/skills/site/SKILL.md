---
name: site
description: Gera uma página HTML real do cliente e só publica na Cloudflare Pages ou na Netlify se existir token do comprador. Use em /site.
---

# Site

## Antes
QA da memória. Estratégia. A página defende a oferta que está em `perfil.json`, na voz do DNA, com as cores da paleta. Skill `design` e skill `seo`.

## Gerar
Atualize `perfil.json` (oferta, prova, serviços, FAQ) com o que a memória já confirma. Não invente depoimento.

```bash
node motor/site.js --cliente <slug>
```

Saída: `clientes/<slug>/sites/index.html`, com as fontes OFL copiadas para `sites/fontes`. Abra o arquivo. Confira em largura estreita: sem corte horizontal, CTA visível, headline com a frase do cliente.

Se a página precisar de mais de uma tela, edite o HTML gerado. Não troque a paleta. Não puxe biblioteca pesada. Sem framework.

## QA de site
- HTML semântico
- Headline diz o que a pessoa ganha ou o limite da oferta
- CTA com verbo e próximo passo
- FAQ com objeção real da persona
- Prova que existe na memória. Número sem fonte não entra
- Banner de demonstração só no cliente fictício

## Deploy
Não publique no checagem:

```bash
node motor/deploy.js --cliente <slug> --provedor cloudflare
```

Publicar, só quando a pessoa pedir e o token for dela:

```bash
node motor/deploy.js --cliente <slug> --provedor cloudflare --publicar
```

Netlify: `--provedor netlify` e `NETLIFY_AUTH_TOKEN`. Cloudflare: `CLOUDFLARE_API_TOKEN` e, se a conta pedir, `CLOUDFLARE_ACCOUNT_ID`.

Sem token, o comando para e não envia. Não crie conta no lugar da pessoa. Não use token de exemplo.
