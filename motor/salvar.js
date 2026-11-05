#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente, lerJson, escreverJson } = require('./lib');

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/salvar.js --cliente <slug> [--nota "..."] [--aprovar id] [--publicar id]');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const arquivo = path.join(dir, 'registro.json');
  const registro = lerJson(arquivo, { itens: [] });
  const agora = new Date().toISOString();

  function achar(id) {
    return registro.itens.find((i) => i.id === id);
  }

  if (args.aprovar) {
    const item = achar(args.aprovar);
    if (!item) {
      console.error(`Item não está no registro: ${args.aprovar}`);
      process.exit(1);
    }
    item.status = 'aprovado';
    item.aprovado_em = agora;
  }

  if (args.publicar) {
    const item = achar(args.publicar);
    if (!item) {
      console.error(`Item não está no registro: ${args.publicar}`);
      process.exit(1);
    }
    if (item.status !== 'aprovado' && item.status !== 'publicado') {
      console.error('Publicar só depois da aprovação. Rode antes com --aprovar.');
      process.exit(1);
    }
    item.status = 'publicado';
    item.publicado_em = agora;
  }

  const nota = args.nota || (args.aprovar ? `aprovado ${args.aprovar}` : args.publicar ? `publicado ${args.publicar}` : 'sessão salva');
  registro.atualizado_em = agora;
  escreverJson(arquivo, registro);

  const diario = path.join(dir, 'registro.md');
  const bloco = `\n## ${agora}\n\n${nota}\n`;
  fs.appendFileSync(diario, bloco, 'utf8');
  console.log(`Salvo em clientes/${path.basename(dir)}`);
  const contagem = registro.itens.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(contagem));
}

main();
