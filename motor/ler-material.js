#!/usr/bin/env node
/**
 * Lê PDF, Office e outros arquivos via MarkItDown (MIT), se estiver instalado.
 * O pacote não é copiado para este repositório. Instala na máquina do comprador.
 */
const path = require('path');
const { spawnSync } = require('child_process');
const { argsParaObjeto, temComando } = require('./lib');

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  const entrada = args.entrada || args._[0];
  if (!entrada) {
    console.error('Uso: node motor/ler-material.js --entrada arquivo.pdf');
    process.exit(1);
  }
  const arquivo = path.resolve(entrada);
  if (temComando('markitdown')) {
    const r = spawnSync('markitdown', [arquivo], { encoding: 'utf8' });
    if (r.status !== 0) {
      console.error(r.stderr || 'markitdown falhou');
      process.exit(r.status || 1);
    }
    process.stdout.write(r.stdout);
    return;
  }
  console.error(`markitdown não está instalado.
Ele é MIT e não vem copiado aqui. Instale e rode de novo:

  pip install 'markitdown[all]'

Arquivo pedido: ${arquivo}`);
  process.exit(2);
}

main();
