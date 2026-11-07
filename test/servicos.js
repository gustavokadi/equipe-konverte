#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');

function rodar(args) {
  const r = spawnSync('node', args, { cwd: RAIZ, encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stdout);
    console.error(r.stderr);
    throw new Error(`falhou: node ${args.join(' ')}`);
  }
  return r.stdout;
}

function checkIgnore(rel, deveIgnorar) {
  const r = spawnSync('git', ['check-ignore', '-q', '--', rel], { cwd: RAIZ });
  const ignorado = r.status === 0;
  assert.strictEqual(ignorado, deveIgnorar, `${rel} ignorado=${ignorado}, esperado=${deveIgnorar}`);
}

function main() {
  const bruto = rodar(['motor/abrir.js', '--cliente', 'clinica-sorriso-bom', '--json']);
  const dados = JSON.parse(bruto);
  assert.strictEqual(dados.criou, false);
  assert.strictEqual(dados.enviou, false);
  assert.strictEqual(dados.publicou, false);
  const ids = dados.clientes[0].aguardando.map((i) => i.id);
  for (const id of ['2026-11-05_clareamento-mitos', '2026-11-05_clareamento-consulta', '2026-11-05_formato']) {
    assert.ok(ids.includes(id), `pendência real ausente: ${id}`);
  }
  assert.ok(!bruto.includes('tarefa criada'));

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ek-rascunho-'));
  const destino = path.join(RAIZ, 'clientes/clinica-sorriso-bom/avaliacoes');
  fs.mkdirSync(destino, { recursive: true });
  const nome = 'teste-servicos-nao-enviar.md';
  fs.writeFileSync(path.join(destino, nome), 'Status: aguardando revisão. Não publicada.\n', 'utf8');
  rodar([
    'motor/registrar-rascunho.js',
    '--cliente', 'clinica-sorriso-bom',
    '--tipo', 'avaliacao',
    '--id', 'teste-servicos-nao-enviar',
    '--caminho', `avaliacoes/${nome}`,
  ]);
  const registro = JSON.parse(fs.readFileSync(path.join(RAIZ, 'clientes/clinica-sorriso-bom/registro.json'), 'utf8'));
  const item = registro.itens.find((i) => i.id === 'teste-servicos-nao-enviar');
  assert.ok(item && item.status === 'aguardando');
  registro.itens = registro.itens.filter((i) => i.id !== 'teste-servicos-nao-enviar');
  fs.writeFileSync(path.join(RAIZ, 'clientes/clinica-sorriso-bom/registro.json'), JSON.stringify(registro, null, 2) + '\n');
  fs.unlinkSync(path.join(destino, nome));
  fs.rmSync(dir, { recursive: true, force: true });

  for (const rel of ['.env.local', '.env.production', 'clientes/x/.env', 'clientes/x/.env.local', 'segredo.pem', 'pasta/chave.key']) {
    checkIgnore(rel, true);
  }
  checkIgnore('.env.example', false);
  checkIgnore('motor/fontes/OFL-Inter.txt', false);

  for (const nomeCmd of ['abrir', 'avaliacao', 'email']) {
    assert.ok(fs.existsSync(path.join(RAIZ, '.claude/skills', nomeCmd, 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(RAIZ, '.claude/commands', `${nomeCmd}.md`)));
    assert.ok(fs.existsSync(path.join(RAIZ, '.gemini/commands', `${nomeCmd}.md`)));
  }
  console.log('servicos ok');
}

main();
