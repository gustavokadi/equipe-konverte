#!/usr/bin/env node
/**
 * /instalar
 * Confere Node, Chrome, ffmpeg e as fontes embutidas.
 * Usa puppeteer-core para não depender do postinstall do Puppeteer, que quebra no npm 11.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');
const { RAIZ, acharChrome, temComando, escreverJson, argsParaObjeto } = require('./lib');

const TIERS = ['gratis', 'pago', 'pago-plus'];

function linha(ok, nome, detalhe) {
  console.log(`${ok ? 'ok ' : 'FALTA '} ${nome}${detalhe ? '  ' + detalhe : ''}`);
  return ok;
}

function perguntar(texto) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(texto, (resp) => {
      rl.close();
      resolve(String(resp || '').trim().toLowerCase());
    });
  });
}

function garantirDeps() {
  const pacote = path.join(RAIZ, 'node_modules', 'puppeteer-core');
  if (fs.existsSync(pacote)) return true;
  console.log('Instalando dependências (puppeteer-core, sem baixar Chrome)...');
  const r = spawnSync('npm', ['install', '--ignore-scripts'], {
    cwd: RAIZ,
    stdio: 'inherit',
  });
  if (r.status !== 0) return false;
  return fs.existsSync(pacote);
}

async function escolherTier(args) {
  if (args.tier) {
    if (!TIERS.includes(args.tier)) {
      throw new Error(`Tier inválido: ${args.tier}. Use ${TIERS.join(', ')}.`);
    }
    return args.tier;
  }
  if (args.sim || !process.stdin.isTTY) return 'gratis';
  console.log('\nQual plano você comprou?');
  console.log('  1) gratis     VS Code + Gemini CLI ou Antigravity (grátis)');
  console.log('  2) pago       VS Code + Claude Code no Claude Pro');
  console.log('  3) pago-plus  Claude Pro ou Max + HeyGen e ElevenLabs (clone)');
  const resp = await perguntar('Digite 1, 2 ou 3: ');
  return { 1: 'gratis', 2: 'pago', 3: 'pago-plus', gratis: 'gratis', pago: 'pago', 'pago-plus': 'pago-plus' }[resp] || 'gratis';
}

async function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  console.log('Equipe Konverte, instalação\n');
  const major = Number(process.versions.node.split('.')[0]);
  const okNode = linha(major >= 18, 'Node', process.version);
  const okFf = linha(temComando('ffmpeg'), 'ffmpeg');
  const okProbe = linha(temComando('ffprobe'), 'ffprobe');
  const chrome = acharChrome();
  const okChrome = linha(Boolean(chrome), 'Chrome', chrome || 'instale o Google Chrome');
  const fontes = ['BebasNeue-Regular.ttf', 'Inter-Regular.ttf', 'Inter-Bold.ttf'].map((n) =>
    path.join(RAIZ, 'motor', 'fontes', n)
  );
  const okFontes = linha(fontes.every((f) => fs.existsSync(f)), 'Fontes Bebas Neue e Inter', 'embutidas em motor/fontes');
  const okDeps = linha(garantirDeps(), 'puppeteer-core', 'sem postinstall de Chrome');

  const npmMajor = (() => {
    const r = spawnSync('npm', ['-v'], { encoding: 'utf8' });
    return Number(String(r.stdout || '0').split('.')[0]);
  })();
  if (npmMajor >= 11) {
    console.log('npm 11 detectado. O postinstall do Puppeteer costuma ser bloqueado. Por isso o render usa o Chrome da máquina, via puppeteer-core.');
  } else {
    console.log(`npm ${npmMajor || '?'} . O mesmo contorno do npm 11 já está ativo: puppeteer-core, Chrome do sistema.`);
  }

  const falhas = [okNode, okFf, okProbe, okChrome, okFontes, okDeps].filter((v) => !v).length;
  if (falhas && !args.forcar) {
    console.error(`\n${falhas} item(ns) em falta. Corrija e rode de novo. O plano grátis precisa de todos.`);
    process.exit(1);
  }

  const tier = await escolherTier(args);
  escreverJson(path.join(RAIZ, 'config', 'tier.json'), {
    tier,
    atualizado_em: new Date().toISOString(),
    produto: 'equipe-konverte',
    versao: '1.0.0',
  });
  escreverJson(path.join(RAIZ, 'config', 'ambiente.json'), { chrome });

  if (!fs.existsSync(path.join(RAIZ, '.env'))) {
    fs.copyFileSync(path.join(RAIZ, '.env.example'), path.join(RAIZ, '.env'));
    console.log('Criei .env a partir do exemplo. Chaves ficam vazias até você precisar.');
  }

  console.log(`\nPlano gravado: ${tier}`);
  console.log('Para trocar depois, sem reinstalar: node motor/instalar.js --tier pago --sim');
  if (tier === 'gratis') {
    console.log('Abra esta pasta no VS Code e use o Gemini CLI ou o Antigravity. Leia GEMINI.md.');
  } else if (tier === 'pago') {
    console.log('Abra esta pasta e rode: claude');
  } else {
    console.log('Abra esta pasta e rode: claude');
    console.log('Preencha HEYGEN_API_KEY e ELEVENLABS_API_KEY no .env quando for gerar o clone.');
  }
  console.log('Segurança extra, opcional (MIT, não vendida aqui): npx -y cc-safety-net@latest install');
  console.log('Cliente de demonstração: /novo-cliente não é necessário. Veja clientes/clinica-sorriso-bom.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
