---
name: reels
description: Escreve o roteiro e edita o vídeo de verdade no ffmpeg, com corte, silêncio, legenda e B-roll com gancho. Use em /reels. Remotion e HyperFrames são extras opcionais.
---

# Reels

O caminho padrão é grátis e local: ffmpeg. Não depende de Remotion, HeyGen nem de API.

## Antes
QA da memória, estratégia, uma tese, uma experiência. Gancho nos 3 primeiros segundos. 20 a 45 segundos quando houver filmagem. Uma ideia.

## Roteiro
Grave `roteiro.md` com gancho, falas, CTA, tese e experiência. O gancho é a frase que vai por cima do B-roll. O Gustavo usa este formato porque segura a abertura: imagem de apoio, texto do gancho, depois a fala.

## Edição
Com o vídeo da pessoa:

```bash
node motor/video/editar.js --cliente <slug> --entrada video.mp4 --srt legendas.srt --cortes 0-12,14-28 --hook "Frase do gancho" --broll auto --id AAAA-MM-DD_tema
```

- `--cortes` é o que fica, em segundos, separado por vírgula.
- O comando ainda remove silêncio dentro do que ficou.
- `--broll auto` gera uma placa na cor da marca se não houver arquivo. Se a pessoa tiver B-roll, passe o caminho.
- A legenda é queimada. Se não houver `.srt`, tente a transcrição local:

```bash
node motor/video/transcrever.js --entrada video.mp4 --saida legendas.srt
```

Isso procura Whisper no computador (CLI, whisper.cpp ou `openai-whisper`). Não chama API paga. Se não houver Whisper, escreva o `.srt` a partir do roteiro e siga. Diga que a transcrição automática não rodou.

## Saída
`clientes/<slug>/conteudo/reels/<id>/reel.mp4`, `legendas.srt`, `relatorio.json`. Status aguardando. Não publicar.

O reel da demo (`2026-11-05_clareamento-consulta`) é cor e áudio sintéticos, para provar o corte. Não apresente como filmagem.

## Extras, só se a pessoa pedir
Não instale sozinho.

- Remotion: ver skill `video-opcional`. Uso comercial de empresa com mais de 3 pessoas exige Company License. Automação de render entra no plano Remotion for Automators.
- HyperFrames (HeyGen, Apache-2.0): skill `video-opcional`. Não está copiado neste repositório.
- O repositório `Felpborges/skill-reel` não tem licença pública. Não copie os arquivos dele. O editor daqui é outro código.

Clone de voz e avatar não é este comando. É `/roteiro-clone`, plano pago plus, com autorização.
