---
name: onboarding
description: Preenche a memória do cliente com voz real, teses, antimodelo e oito experiências antes de qualquer conteúdo. Use na primeira vez de cada cliente.
---

# Onboarding

Método herdado do ecossistema do Gustavo, agora por cliente.

Enquanto `node motor/qa.js --cliente <slug>` falhar, este cliente não produz carrossel, reel, anúncio nem site.

## Dois caminhos
- Com dossiê ou transcrição: leia o arquivo, preencha a memória, pergunte só o que ficou buraco.
- Sem material: uma pergunta por vez. Pergunta concreta. Exemplo de resposta antes de esperar a dela. Se travar duas vezes, pare e peça um áudio.

## Ordem
1. Empresa e oferta, com preço real. Sem preço, marque pendente.
2. Persona: último cliente bom, dor nas palavras dele, objeção que mais aparece.
3. Preferências: quem aprova, palavras proibidas, se aceita vídeo.
4. DNA de voz. Siga a skill `dna-de-voz`. Sem amostra real, diga que o DNA é chute e não produza peça ainda.
5. Referências visuais. Rode `node motor/referencias.js --cliente <slug>`. Se a pasta só tiver o pedido em branco, pare esta etapa e peça prints ou links do Pinterest, 2 a 3 concorrentes, posts de que gosta e de que não gosta, logo, cores e fontes. Salve em `referencias/`. Leia imagem em modo multimodal e grave `guia-visual.md` (paleta, tipografia, composição, foto ou gráfico, densidade, faça e não faça). Sem isso, o carrossel não começa.
6. Experiências. Meta: 8. Caso, erro próprio, bastidor, pergunta que se repete. Abaixo de 8, o próximo passo é coleta, não produção.
7. Antimodelo. O que dá vergonha, o que a marca não é, formato vetado.
8. Teses. 3 a 5 frases. Teste: alguém do mercado discordaria? Se ninguém discordaria, é slogan. Não cole.
9. Estratégia dos 30 dias. Canal, frequência, o que fica de fora.
10. Rode `node motor/qa.js --cliente <slug>` e mostre o resultado.

## Regras
- Copie a fala do cliente onde a fala é o valor.
- Não complete buraco com suposição.
- Calibragem do DNA: três parágrafos do mesmo assunto, um na voz extraída, um mais solto, um mais técnico. Pergunte qual parece ele. Só então feche o arquivo.
