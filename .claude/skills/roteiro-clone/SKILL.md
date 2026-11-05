---
name: roteiro-clone
description: Formata roteiro para HeyGen e ElevenLabs. Não envia avatar nem voz. Use em /roteiro-clone, no plano pago plus e só com autorização.
---

# Roteiro de clone

O texto do roteiro pode ser escrito em qualquer plano. O render no HeyGen e na ElevenLabs é Pago Plus, com chave e com autorização da pessoa cujo rosto e voz serão usados.

## Antes de escrever
1. Leia `config/tier.json`.
2. Procure em `clientes/<slug>/clone/` um arquivo de autorização com nome, data e o que foi permitido (voz, rosto, ou os dois). Sem isso, escreva o roteiro e marque "sem autorização". Não descreva o passo de upload como se fosse para fazer agora.
3. DNA de voz. O clone fala como a pessoa, não como locutor de anúncio.

## Formato do arquivo
O validador exige estes títulos:

```markdown
## Autorização
## Gancho
## Falas
## CTA
```

Nas falas, marque `[pausa curta]` onde a pessoa respira. Frases curtas. Gancho nos 3 segundos. Sem música por cima da frase principal.

## Comando
```bash
node motor/clone.js --cliente <slug> --roteiro <arquivo.md> --id AAAA-MM-DD_tema
```

Este comando não chama a API. Ele não gasta crédito. Se o plano não for `pago-plus` ou faltar chave, ele diz isso em `status.md`.

## Se a pessoa pedir para enviar de verdade
Só com as três condições: plano pago plus, `HEYGEN_API_KEY` e `ELEVENLABS_API_KEY` no `.env`, autorização no disco. Mesmo assim, na v1, oriente a colar o roteiro nos painéis oficiais. Não improvise chamada de API. Não leia a chave em voz alta nem cole a chave na conversa.
