#!/usr/bin/env node
/**
 * O primeiro carrossel só anda se houver referência de verdade e um guia visual.
 * Placeholders (PEDIDO.md, .gitkeep) não contam.
 */
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente } = require('./lib');

const IGNORAR = new Set(['pedido.md', 'leia.md', '.gitkeep', '.ds_store']);

function arquivosReais(dir) {
  const base = path.join(dir, 'referencias');
  if (!fs.existsSync(base)) return [];
  const saida = [];
  function andar(atual, rel) {
    for (const nome of fs.readdirSync(atual)) {
      if (nome === 'banco') continue;
      const cheio = path.join(atual, nome);
      const st = fs.statSync(cheio);
      if (st.isDirectory()) andar(cheio, path.join(rel, nome));
      else if (!IGNORAR.has(nome.toLowerCase()) && st.size > 0) saida.push(path.join(rel, nome));
    }
  }
  andar(base, '');
  return saida;
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/referencias.js --cliente <slug>');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const reais = arquivosReais(dir);
  const guia = path.join(dir, 'guia-visual.md');
  const temGuia = fs.existsSync(guia) && fs.readFileSync(guia, 'utf8').trim().length > 80;

  if (reais.length === 0) {
    console.error(`Referências vazias em clientes/${path.basename(dir)}/referencias/.

Pare o carrossel e peça, antes de desenhar:

1. Prints ou links do Pinterest
2. 2 a 3 concorrentes (arroba do Instagram ou print)
3. Posts de que a pessoa gosta e posts de que não gosta
4. Logo, cores e fontes

Grave tudo nessa pasta. Leia as imagens (multimodal) e escreva clientes/${path.basename(dir)}/guia-visual.md com paleta, tipografia, composição, foto ou gráfico, densidade, faça e não faça.`);
    process.exit(2);
  }

  if (!temGuia) {
    console.error('Há referências, mas falta guia-visual.md. Analise os arquivos e grave o guia antes de produzir.');
    process.exit(2);
  }

  const guiaTempo = fs.statSync(guia).mtimeMs;
  const novas = reais.filter((rel) => fs.statSync(path.join(dir, 'referencias', rel)).mtimeMs > guiaTempo + 1000);
  if (novas.length) {
    console.log('Há referência mais nova que o guia. Atualize guia-visual.md antes do próximo carrossel.');
    console.log(novas.join('\n'));
    process.exit(4);
  }

  console.log(`Referências ok (${reais.length}) e guia visual presente.`);
}

main();
