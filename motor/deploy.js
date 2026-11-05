#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { argsParaObjeto, pastaCliente, lerEnv } = require('./lib');

lerEnv();

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/deploy.js --cliente <slug> [--provedor cloudflare|netlify] [--publicar]');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const site = path.join(dir, 'sites', 'index.html');
  if (!fs.existsSync(site)) {
    console.error('Não há sites/index.html. Rode node motor/site.js --cliente ' + args.cliente);
    process.exit(1);
  }
  const provedor = args.provedor || 'cloudflare';
  const token =
    provedor === 'netlify' ? process.env.NETLIFY_AUTH_TOKEN : process.env.CLOUDFLARE_API_TOKEN;
  if (!args.publicar || !token) {
    console.log(`Site pronto em ${site}`);
    console.log(
      token
        ? `Token de ${provedor} presente. Rode de novo com --publicar para enviar.`
        : `Sem token de ${provedor}. Coloque no .env (CLOUDFLARE_API_TOKEN ou NETLIFY_AUTH_TOKEN) e rode com --publicar. Nada foi enviado.`
    );
    return;
  }
  if (provedor === 'netlify') {
    const r = spawnSync(
      'npx',
      ['--yes', 'netlify-cli', 'deploy', '--dir', path.join(dir, 'sites'), '--prod'],
      { stdio: 'inherit', env: process.env }
    );
    process.exit(r.status || 0);
  }
  const projeto = args.projeto || `konverte-${path.basename(dir)}`;
  const r = spawnSync(
    'npx',
    ['--yes', 'wrangler', 'pages', 'deploy', path.join(dir, 'sites'), `--project-name=${projeto}`],
    { stdio: 'inherit', env: process.env }
  );
  process.exit(r.status || 0);
}

main();
