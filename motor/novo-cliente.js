#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { RAIZ, argsParaObjeto, slugify, escreverJson } = require('./lib');

function copiar(origem, destino) {
  const st = fs.statSync(origem);
  if (st.isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const nome of fs.readdirSync(origem)) copiar(path.join(origem, nome), path.join(destino, nome));
    return;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  let texto = fs.readFileSync(origem);
  if (origem.endsWith('.md') || origem.endsWith('.json') || origem.endsWith('.css')) {
    texto = texto.toString('utf8');
  }
  fs.writeFileSync(destino, texto);
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  const nome = args.nome || args._[0];
  if (!nome) {
    console.error('Uso: node motor/novo-cliente.js --nome "Nome do cliente"');
    process.exit(1);
  }
  const slug = args.slug || slugify(nome);
  const destino = path.join(RAIZ, 'clientes', slug);
  if (fs.existsSync(destino)) {
    console.error(`Já existe clientes/${slug}. Não vou sobrescrever a memória.`);
    process.exit(1);
  }
  copiar(path.join(RAIZ, 'clientes', '_modelo'), destino);
  const perfilPath = path.join(destino, 'perfil.json');
  const perfil = JSON.parse(fs.readFileSync(perfilPath, 'utf8'));
  perfil.nome = nome;
  perfil.slug = slug;
  escreverJson(perfilPath, perfil);
  const agora = new Date().toISOString();
  fs.writeFileSync(
    path.join(destino, 'registro.json'),
    JSON.stringify({ itens: [], criado_em: agora }, null, 2) + '\n'
  );
  console.log(`Cliente criado em clientes/${slug}`);
  console.log('Próximo passo: preencher a memória (voz, experiências, teses, antimodelo) antes de produzir.');
}

main();
