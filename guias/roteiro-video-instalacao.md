# Roteiro do vídeo de instalação

Outline para o Gustavo gravar. Não é o vídeo pronto. Duração alvo: 8 a 12 minutos. Tela do VS Code, voz dele, sem vinheta longa.

## 0. Abertura, 20 segundos
Frase: "Isso é a Equipe Konverte. Você instala uma vez e cada cliente fica com a própria voz. R$ 97, e o plano grátis já entrega carrossel e reel."

Mostrar a pasta aberta e o `README.md`.

## 1. O que precisa estar na máquina, 1 minuto
Node, Chrome, ffmpeg. Dizer em uma frase por que não baixamos outro Chrome: no npm 11 o postinstall do Puppeteer quebra, então a gente usa o Chrome que você já tem.

## 2. Instalar no plano grátis, 2 minutos
```bash
git clone ...
cd equipe-konverte
node motor/instalar.js --tier gratis --sim
```
Mostrar o "ok" de cada item. Abrir o VS Code. Abrir o Gemini CLI ou o Antigravity na mesma pasta. Pedir `/painel`.

## 3. A demo, 2 minutos
Entrar em `clientes/clinica-sorriso-bom`. Avisar que é fictício. Abrir os PNG do carrossel. Abrir o `reel.mp4` e apontar: gancho em cima do B-roll, legenda embaixo. Dizer que aquele mp4 é cor de teste, e que o comando no cliente real recebe o vídeo da pessoa.

## 4. Um cliente novo, 2 minutos
`/novo-cliente` com um nome qualquer. Mostrar que o QA recusa produzir enquanto a memória está com buraco. Uma pergunta só, como exemplo de onboarding, e parar. Não fingir que preencheu voz.

## 5. Os outros planos, 1 minuto e meio
Pago: Claude Code, mesmo diretório, `claude`. Pago plus: HeyGen e ElevenLabs, e a frase de que clone sem autorização não roda. Trocar o plano com o mesmo comando `--tier`, sem reinstalar.

## 6. O que a ferramenta não faz, 1 minuto
Não dispara WhatsApp. Não sobe anúncio. Não publica página sem o token dele. Preço de proposta continua exemplo até ele colocar a tabela.

## 7. Fecho, 20 segundos
"O arquivo de licença ainda pede revisão do advogado. O uso é de um comprador, sem revender o pacote."

## O que deixar na tela, em texto
- URL do repositório
- Os três nomes de plano
- O comando `npm test`, para quem quiser ver o carrossel nascer de novo
