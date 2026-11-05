# Guia visual

Atualizado em: 2026-11-05
Lido a partir de `referencias/ref1.png`, `ref2.png`, `ref3.png` e `ref4.png`.

Estilo principal: foto e letra, no clima da ref3 (Anne, sálvia e floresta), com acento laranja curto da ref1. A ref2 (escuro) fica de reserva, não mistura neste carrossel. A ref4 (básico, preto e branco) é opção, só quando a pessoa pedir `estilo: basico`.

Para esta clínica, a foto é de consultório, cadeira, instrumento ou água. Não é editorial de moda nem mulher de lifestyle.

## Paleta
Floresta #24382C, sálvia #314A3C, névoa #E7EFE4, texto #F4F1EA. Laranja #E08A45 só no rótulo, no número ou na barra de ação. Sem o feed inteiro laranja. Sem preto e branco como padrão.

## Tipografia
Inter, peso 700, por cima da foto ou num bloco sálvia. Frase curta. Uma ideia por slide. Bebas não entra neste pacote.

## Composição
O carrossel padrão mistura foto e letra. Slides vizinhos não repetem o desenho:

- `foto-cheia`: foto até a borda, texto no bloco escuro de baixo
- `foto-split`: foto de um lado, argumento do outro
- `lista`: itens grandes no bloco de cor
- `cta`: preço e barra laranja

Pelo menos duas fotos de verdade num carrossel de quatro ou mais slides.

## Foto ou gráfico
Foto de banco com crédito, ou foto da clínica com autorização. Consultório, cadeira, escala de cor, copo de água. Sem rosto de banco no lugar da Mara. Sem pose de moda.

## Densidade
A foto ocupa o quadro. O texto senta em cima dela ou no bloco ao lado, grande o bastante para a miniatura. Não sobra título solto no alto com o resto vazio.

## Faça
- Manter a mesma família de verde em todos os slides
- Laranja em um ponto só
- Crédito da foto no slide e em `referencias/banco/creditos.md`
- Caso da Mara em um slide, sem fingir que a modelo é ela

## Não faça
- Estilo básico preto e branco, a menos que peçam `estilo: basico`
- Cursiva laranja, seta de "siga aqui", serifa de feed escuro
- Foto de editorial de moda
- Travessão e tom de guru

## Opcional
Estilo básico (ref4): `"estilo": "basico"` na spec. Aí o render troca para preto e branco, frase no centro, lista com traço e ícone de carrossel. Não é o padrão do cliente.

## Máquina
estilo: foto-letra
tipos: foto-cheia, foto-split, lista, cta
foto: obrigatoria-no-padrao
acento: laranja-curto
