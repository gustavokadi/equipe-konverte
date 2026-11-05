#!/usr/bin/env node
/**
 * Confere o roteiro de clone e não chama HeyGen nem ElevenLabs sozinho.
 * Render de avatar e voz fica no plano pago-plus, com chave e com autorização escrita.
 */
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, pastaCliente, lerTier, lerEnv, registrarItem } = require('./lib');

lerEnv();

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente || !args.roteiro) {
    console.error('Uso: node motor/clone.js --cliente <slug> --roteiro arquivo.md --id <id>');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const texto = fs.readFileSync(path.resolve(args.roteiro), 'utf8');
  const faltas = [];
  for (const bloco of ['## Gancho', '## Falas', '## CTA', '## Autorização']) {
    if (!texto.includes(bloco)) faltas.push(bloco);
  }
  if (faltas.length) {
    console.error('Roteiro incompleto. Faltam: ' + faltas.join(', '));
    process.exit(1);
  }
  const id = args.id || `${new Date().toISOString().slice(0, 10)}_clone`;
  const pasta = path.join(dir, 'clone', id);
  fs.mkdirSync(pasta, { recursive: true });
  fs.copyFileSync(path.resolve(args.roteiro), path.join(pasta, 'roteiro.md'));

  const tier = lerTier();
  const hey = Boolean(process.env.HEYGEN_API_KEY);
  const el = Boolean(process.env.ELEVENLABS_API_KEY);
  const pode = tier === 'pago-plus' && hey && el;
  const aviso = pode
    ? 'Chaves presentes e plano pago-plus. Mesmo assim este comando não envia o vídeo. A pessoa cola o roteiro no HeyGen e na ElevenLabs, ou pede uma automação futura. Nada foi cobrado.'
    : `Render de clone não dispara neste ambiente (plano: ${tier}). O roteiro está pronto para quando houver plano pago-plus, as duas chaves e a autorização.`;

  fs.writeFileSync(path.join(pasta, 'status.md'), `# ${id}\n\n${aviso}\n`, 'utf8');
  registrarItem(args.cliente, { id, tipo: 'roteiro-clone', caminho: path.relative(dir, pasta), status: 'aguardando' });
  console.log(path.join(pasta, 'roteiro.md'));
  console.log(aviso);
}

main();
