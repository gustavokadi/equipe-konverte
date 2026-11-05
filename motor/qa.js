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

function revisarGuia(dir) {
  const erros = [];
  const guia = ler(path.join(dir, 'guia-visual.md'));
  if (!guia.trim()) return ['falta guia-visual.md'];
  for (const secao of ['Paleta', 'Tipografia', 'Composição', 'Foto ou gráfico', 'Densidade', 'Faça', 'Não faça']) {
    if (!new RegExp(`^##\\s+${secao}`, 'im').test(guia)) erros.push(`guia visual sem seção ${secao}`);
  }
  return erros;
}

function revisarCarrossel(dir, specPath) {
  const erros = revisarGuia(dir);
  const spec = JSON.parse(fs.readFileSync(path.resolve(specPath), 'utf8'));
  const slides = spec.slides || [];
  const guia = ler(path.join(dir, 'guia-visual.md'));
  const basico = spec.estilo === 'basico';
  if (/estilo principal:\s*b[aá]sico/i.test(guia) && spec.estilo !== 'basico') {
    erros.push('o guia marcou o básico como estilo principal. O padrão dos clientes é foto e letra. Básico só com estilo basico na spec.');
  }
  if (basico) {
    slides.forEach((slide, i) => {
      if (!['texto', 'lista'].includes(slide.tipo)) erros.push(`slide ${i + 1} fora do básico: ${slide.tipo || 'vazio'}`);
      if (!['preto', 'branco'].includes(slide.fundo)) erros.push(`slide ${i + 1} sem fundo preto ou branco`);
      if (slide.foto) erros.push(`slide ${i + 1} usa foto. No básico, foto é rara e não é o padrão`);
    });
    for (let i = 1; i < slides.length; i++) {
      if (slides[i].fundo && slides[i].fundo === slides[i - 1].fundo) {
        erros.push(`slides ${i} e ${i + 1} repetem o fundo ${slides[i].fundo}`);
      }
    }
    const temLista = slides.some((s) => s.tipo === 'lista' && Array.isArray(s.itens) && s.itens.length >= 2);
    if (slides.length >= 4 && !temLista) erros.push('básico com 4 slides ou mais precisa de uma lista com traços');
    return erros;
  }
  const tipos = slides.map((s) => s.tipo);
  const distintos = new Set(tipos);
  if (slides.length >= 4 && distintos.size < 4) erros.push(`só ${distintos.size} composições diferentes`);
  for (let i = 1; i < tipos.length; i++) {
    if (tipos[i] && tipos[i] === tipos[i - 1]) erros.push(`slides ${i} e ${i + 1} repetem o tipo ${tipos[i]}`);
  }
  const permitidos = ['frase', 'foto-cheia', 'foto-split', 'lista', 'cta', 'texto'];
  tipos.forEach((tipo, i) => {
    if (!permitidos.includes(tipo)) erros.push(`slide ${i + 1} com tipo desconhecido: ${tipo || 'vazio'}`);
  });
  const comFoto = slides.filter((s) => s.foto && (s.tipo === 'foto-cheia' || s.tipo === 'foto-split'));
  if (slides.length >= 4 && comFoto.length < 2) erros.push('o padrão pede pelo menos duas fotos de verdade');
  slides.forEach((slide, i) => {
    if (slide.tipo === 'lista') {
      if (!Array.isArray(slide.itens) || slide.itens.length < 2) erros.push(`slide ${i + 1} lista sem itens grandes`);
    }
  });
  return erros;
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/qa.js --cliente <slug> [--arquivo texto.md] [--carrossel spec.json]');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const erros = revisarMemoria(dir);
  if (args.carrossel) erros.push(...revisarCarrossel(dir, args.carrossel));
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
