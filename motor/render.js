#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente } = require('./lib');
const { renderizarSpec } = require('./render-engine');

async function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente || !args.spec) {
    console.error('Uso: node motor/render.js --cliente <slug> --spec <arquivo.json>');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const specPath = path.resolve(args.spec);
  if (!fs.existsSync(specPath)) {
    console.error(`Spec não encontrada: ${specPath}`);
    process.exit(1);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  if (!Array.isArray(spec.slides) || spec.slides.length === 0) {
    console.error('A spec precisa de uma lista "slides".');
    process.exit(1);
  }
  const paleta = path.join(dir, 'identidade', 'paleta.css');
  const saida = await renderizarSpec({ cliente: args.cliente, spec, paletaPath: paleta });
  console.log(saida);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
