#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente } = require('./lib');

function ler(arquivo) {
  return fs.existsSync(arquivo) ? fs.readFileSync(arquivo, 'utf8') : '';
}

function palavrasProibidas(antimodelo) {
  const linhas = antimodelo.split('\n');
  const saida = [];
  let dentro = false;
  for (const linha of linhas) {
    if (/^##\s+/.test(linha)) {
      dentro = /proibid/i.test(linha);
      continue;
    }
    if (dentro) {
      const m = linha.match(/^\s*-\s+(.+)/);
      if (m) saida.push(m[1].replace(/^\*+|\*+$/g, '').trim().toLowerCase());
    }
  }
  return saida.filter(Boolean);
}

function revisarMemoria(dir) {
  const erros = [];
  const obrigatorios = [
    'memoria/empresa.md',
    'memoria/dna-de-voz.md',
    'memoria/experiencias.md',
    'memoria/antimodelo.md',
    'memoria/teses.md',
    'memoria/persona.md',
    'memoria/estrategia.md',
    'identidade/paleta.css',
  ];
  for (const rel of obrigatorios) {
    const texto = ler(path.join(dir, rel));
    if (!texto.trim()) erros.push(`vazio: ${rel}`);
    else if (texto.includes('{{')) erros.push(`placeholder em ${rel}`);
  }
  const exp = ler(path.join(dir, 'memoria', 'experiencias.md'));
  const n = (exp.match(/^###\s+EXP-/gm) || []).length;
  if (n < 8) erros.push(`banco de experiências tem ${n}, o mínimo é 8`);
  const dna = ler(path.join(dir, 'memoria', 'dna-de-voz.md'));
  if (!/par[aá]grafo de calibragem/i.test(dna) && !/PARAGRAFO_TESTE|prova de calibragem/i.test(dna)) {
    erros.push('DNA de voz sem prova de calibragem');
  }
  return erros;
}

function revisarTexto(texto, proibidas) {
  const erros = [];
  if (texto.includes('\u2014') || texto.includes('\u2013')) erros.push('tem travessão');
  const baixo = texto.toLowerCase();
  for (const p of proibidas) {
    if (p && baixo.includes(p)) erros.push(`palavra proibida: ${p}`);
  }
  return erros;
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/qa.js --cliente <slug> [--arquivo texto.md]');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const erros = revisarMemoria(dir);
  if (args.arquivo) {
    const texto = ler(path.resolve(args.arquivo));
    const proibidas = palavrasProibidas(ler(path.join(dir, 'memoria', 'antimodelo.md')));
    erros.push(...revisarTexto(texto, proibidas).map((e) => `${args.arquivo}: ${e}`));
  }
  if (erros.length) {
    console.error('QA bloqueou:');
    for (const e of erros) console.error('  - ' + e);
    process.exit(1);
  }
  console.log(`QA da memória ok: ${args.cliente}`);
}

main();
