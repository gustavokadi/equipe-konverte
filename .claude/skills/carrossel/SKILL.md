---
name: carrossel
description: Gera os slides em PNG e a legenda pronta para postar, na voz e no guia visual do cliente. Use em /carrossel. Para se não houver referências.
---

# Carrossel

Render local, HTML para PNG. Não use gerador de imagem pago. As fontes Bebas Neue e Inter já estão em `motor/fontes`.

## Briefing visual, antes do primeiro carrossel
Rode `node motor/referencias.js --cliente <slug>`.

Se o comando sair com erro, pare. Não desenhe um slide "enquanto isso". Peça e salve em `clientes/<slug>/referencias/`:

1. Prints ou links do Pinterest
2. 2 a 3 concorrentes (arroba do Instagram ou print)
3. Posts de que a pessoa gosta e posts de que não gosta
4. Logo, cores e fontes

Leia as imagens em modo multimodal. Escreva `clientes/<slug>/guia-visual.md` com estas seções: Paleta, Tipografia, Composição, Foto ou gráfico, Densidade, Faça, Não faça. Diga o que você viu no print, não um gosto genérico.

Se o comando avisar que há referência mais nova que o guia, atualize o guia e só então produza. Não apague o histórico: acrescente a data no topo.

## Antes de escrever a peça
1. Cliente definido.
2. `node motor/qa.js --cliente <slug>`
3. Skill `estrategia`. Uma tese e uma experiência livre.
4. O desenho segue `guia-visual.md`, não um modelo padrão da ferramenta.

## Escrever
Cinco desenhos, e slides vizinhos não repetem o tipo:

- `frase`: afirmação, uma palavra gigante
- `foto-cheia`: foto ou bloco até a borda, texto no bloco de baixo
- `foto-split`: foto ou painel de um lado, texto do outro
- `lista`: cada item numa linha grande, com número
- `cta`: preço e barra de ação

1080x1350. Nada de metade do quadro vazia. A lista usa o campo `itens`, um item por linha, não um parágrafo.

Legenda: primeira linha forte, 3 a 5 linhas, no máximo 6 hashtags, CTA. Sem travessão.

Grave a spec em `clientes/<slug>/conteudo/specs/AAAA-MM-DD_tema.json`.

## Foto
```bash
node motor/banco-imagens.js --cliente <slug> --consulta "termo em inglês ou português"
```

Pexels, Unsplash e Pixabay, se houver chave no `.env`. O crédito vai para `referencias/banco/creditos.md`. Sem chave, o comando não baixa nada e o render usa painel gráfico com a tarja "sem foto de banco".

Freepik (API Magnific) é pago e só existe como opção no plano pago-plus. O script não chama essa API.

No slide, `foto` é o caminho local do arquivo baixado, por exemplo `referencias/banco/nome.jpg`.

## Render
```bash
node motor/qa.js --cliente <slug> --carrossel <spec.json>
node motor/render.js --cliente <slug> --spec <spec.json>
```

O render recusa se não houver guia. Abra os PNG. Se o título estourar, o tipo repetir ou a tarja de foto aparecer num slide que deveria ter foto, corrija e renderize de novo.

## Depois
Marque a experiência como usada. O registro fica "aguardando". Não publique.
