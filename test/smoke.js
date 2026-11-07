#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const assert = require('assert');

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

function main() {
  rodar(['motor/instalar.js', '--tier', 'gratis', '--sim']);
  rodar(['motor/qa.js', '--cliente', 'clinica-sorriso-bom']);
  rodar(['motor/referencias.js', '--cliente', 'clinica-sorriso-bom']);
  rodar([
    'motor/qa.js',
    '--cliente', 'clinica-sorriso-bom',
    '--carrossel', 'clientes/clinica-sorriso-bom/conteudo/specs/2026-11-05_clareamento-mitos.json',
  ]);
  rodar(['motor/banco-imagens.js', '--cliente', 'clinica-sorriso-bom', '--consulta', 'dental clinic']);
  rodar([
    'motor/render.js',
    '--cliente', 'clinica-sorriso-bom',
    '--spec', 'clientes/clinica-sorriso-bom/conteudo/specs/2026-11-05_clareamento-mitos.json',
  ]);
  const slide = path.join(
    RAIZ,
    'clientes/clinica-sorriso-bom/conteudo/output/2026-11-05_clareamento-mitos/slide_1.png'
  );
  assert.ok(fs.existsSync(slide), 'slide 1 não foi gerado');
  assert.ok(fs.statSync(slide).size > 10000, 'slide pequeno demais');
  const legenda = fs.readFileSync(
    path.join(RAIZ, 'clientes/clinica-sorriso-bom/conteudo/output/2026-11-05_clareamento-mitos/legenda.md'),
    'utf8'
  );
  assert.ok(!legenda.includes('\u2014'), 'legenda com travessão');
  rodar([
    'motor/qa.js',
    '--cliente', 'clinica-sorriso-bom',
    '--arquivo', 'clientes/clinica-sorriso-bom/conteudo/output/2026-11-05_clareamento-mitos/legenda.md',
  ]);

  rodar([
    'motor/video/editar.js',
    '--cliente', 'clinica-sorriso-bom',
    '--amostra',
    '--id', '2026-11-05_clareamento-consulta',
    '--cortes', '0-7.5',
    '--hook', 'Clareamento sem consulta é roleta',
    '--broll', 'auto',
  ]);
  const pastaReel = path.join(RAIZ, 'clientes/clinica-sorriso-bom/conteudo/reels/2026-11-05_clareamento-consulta');
  const relatorio = JSON.parse(fs.readFileSync(path.join(pastaReel, 'relatorio.json'), 'utf8'));
  for (const op of ['corte', 'silencio', 'broll', 'gancho', 'legenda']) {
    assert.ok(relatorio.operacoes.includes(op), `faltou operação ${op}`);
  }
  assert.ok(relatorio.duracao_final < relatorio.duracao_origem - 0.8, 'o silêncio não foi removido');
  assert.ok(fs.statSync(path.join(pastaReel, 'reel.mp4')).size > 20000, 'mp4 pequeno demais');

  rodar(['motor/site.js', '--cliente', 'clinica-sorriso-bom']);
  assert.ok(fs.existsSync(path.join(RAIZ, 'clientes/clinica-sorriso-bom/sites/index.html')));
  rodar(['motor/deploy.js', '--cliente', 'clinica-sorriso-bom']);
  rodar(['motor/salvar.js', '--cliente', 'clinica-sorriso-bom', '--nota', 'smoke da v1']);
  const cedo = spawnSync(
    'node',
    ['motor/salvar.js', '--cliente', 'clinica-sorriso-bom', '--publicar', '2026-11-05_clareamento-mitos'],
    { cwd: RAIZ, encoding: 'utf8' }
  );
  assert.notStrictEqual(cedo.status, 0, 'publicar sem aprovação deveria falhar');
  rodar([
    'motor/clone.js',
    '--cliente', 'clinica-sorriso-bom',
    '--roteiro', 'clientes/clinica-sorriso-bom/clone/roteiro-heygen.md',
    '--id', '2026-11-05_formato',
  ]);
  rodar(['motor/radar.js', '--cliente', 'clinica-sorriso-bom']);
  rodar(['motor/instalar.js', '--tier', 'pago', '--sim']);
  const pago = JSON.parse(fs.readFileSync(path.join(RAIZ, 'config', 'tier.json'), 'utf8'));
  assert.strictEqual(pago.tier, 'pago');
  rodar(['motor/instalar.js', '--tier', 'gratis', '--sim']);

  const comandos = [
    'instalar', 'novo-cliente', 'abrir', 'radar', 'pautas', 'carrossel', 'reels', 'roteiro-clone',
    'site', 'proposta', 'prospeccao', 'anuncio', 'avaliacao', 'email', 'painel', 'salvar', 'seo',
  ];
  for (const nome of comandos) {
    assert.ok(fs.existsSync(path.join(RAIZ, '.claude/commands', `${nome}.md`)), nome);
    assert.ok(fs.existsSync(path.join(RAIZ, '.claude/skills', nome, 'SKILL.md')), nome);
    assert.ok(fs.existsSync(path.join(RAIZ, '.gemini/commands', `${nome}.md`)), nome);
  }
  rodar(['motor/painel.js']);
  const painel = fs.readFileSync(path.join(RAIZ, 'painel/index.html'), 'utf8');
  assert.ok(painel.includes('2026-11-05_formato'), 'painel sem o roteiro de clone');
  assert.ok(painel.includes('plano gratis'), 'painel deveria refletir o plano grátis');

  const slug = 'cliente-smoke-temp';
  const temp = path.join(RAIZ, 'clientes', slug);
  fs.rmSync(temp, { recursive: true, force: true });
  rodar(['motor/novo-cliente.js', '--nome', 'Cliente Smoke Temp']);
  assert.ok(fs.existsSync(path.join(temp, 'memoria', 'dna-de-voz.md')));
  const qa = spawnSync('node', ['motor/qa.js', '--cliente', slug], { cwd: RAIZ, encoding: 'utf8' });
  assert.notStrictEqual(qa.status, 0, 'cliente vazio não pode passar no QA');
  fs.rmSync(temp, { recursive: true, force: true });

  console.log('smoke ok');
}

main();
