#!/usr/bin/env node
/**
 * Registra um rascunho que já está no disco. Não envia e não publica.
 */
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente, registrarItem } = require('./lib');

const TIPOS = new Set(['avaliacao', 'email']);

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente || !args.tipo || !args.id || !args.caminho) {
    console.error('Uso: node motor/registrar-rascunho.js --cliente <slug> --tipo avaliacao|email --id <id> --caminho <arquivo>');
    process.exit(1);
  }
  if (!TIPOS.has(args.tipo)) {
    console.error('Tipo permitido: avaliacao ou email.');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const arquivo = path.resolve(dir, args.caminho);
  const relativo = path.relative(dir, arquivo);
  if (relativo.startsWith('..') || path.isAbsolute(relativo)) {
    console.error('O caminho precisa ficar dentro da pasta do cliente.');
    process.exit(1);
  }
  if (!fs.existsSync(arquivo)) {
    console.error(`Arquivo ainda não existe: ${relativo}. Grave o rascunho antes de registrar.`);
    process.exit(1);
  }
  registrarItem(args.cliente, {
    id: args.id,
    tipo: args.tipo,
    caminho: relativo,
    status: 'aguardando',
  });
  console.log(`Rascunho registrado, aguardando revisão: ${relativo}`);
  console.log('Nada foi enviado nem publicado.');
}

main();
