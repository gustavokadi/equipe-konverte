#!/usr/bin/env node
/**
 * Transcrição local, estilo Whisper. Não chama API paga.
 * Procura, nesta ordem: whisper (CLI), whisper.cpp (whisper-cli) e o módulo Python openai-whisper.
 * Se nada estiver instalado, explica como instalar e devolve código 2.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { argsParaObjeto, temComando } = require('../lib');

function rodar(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return r;
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.entrada || !args.saida) {
    console.error('Uso: node motor/video/transcrever.js --entrada video.mp4 --saida legendas.srt');
    process.exit(1);
  }
  const entrada = path.resolve(args.entrada);
  const saida = path.resolve(args.saida);
  if (!fs.existsSync(entrada)) {
    console.error(`Arquivo não encontrado: ${entrada}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  const dir = path.dirname(saida);
  const base = path.basename(saida, path.extname(saida));

  if (temComando('whisper')) {
    const r = rodar('whisper', [entrada, '--language', 'pt', '--output_format', 'srt', '--output_dir', dir, '--model', args.modelo || 'small']);
    if (r.status === 0) {
      const gerado = path.join(dir, `${path.basename(entrada, path.extname(entrada))}.srt`);
      if (fs.existsSync(gerado) && gerado !== saida) fs.renameSync(gerado, saida);
      console.log(`Transcrição em ${saida}`);
      return;
    }
  }

  if (temComando('whisper-cli')) {
    const r = rodar('whisper-cli', ['-m', args.modelo || 'models/ggml-small.bin', '-l', 'pt', '-osrt', '-of', path.join(dir, base), '-f', entrada]);
    if (r.status === 0) {
      console.log(`Transcrição em ${saida}`);
      return;
    }
  }

  const py = rodar('python3', ['-c', 'import whisper']);
  if (py.status === 0) {
    const codigo = `
import whisper, sys
modelo = whisper.load_model(${JSON.stringify(args.modelo || 'small')})
res = modelo.transcribe(${JSON.stringify(entrada)}, language="pt")
def ts(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
linhas = []
for i, seg in enumerate(res["segments"], 1):
    linhas.append(str(i))
    linhas.append(f"{ts(seg['start'])} --> {ts(seg['end'])}")
    linhas.append(seg["text"].strip())
    linhas.append("")
open(${JSON.stringify(saida)}, "w", encoding="utf-8").write("\\n".join(linhas))
`;
    const r = rodar('python3', ['-c', codigo]);
    if (r.status === 0) {
      console.log(`Transcrição em ${saida}`);
      return;
    }
    console.error(r.stderr || r.stdout);
  }

  console.error(`Nenhum Whisper local encontrado.
Instale um destes e rode de novo:
  pip install -U openai-whisper
  ou o whisper.cpp (comando whisper-cli), com um modelo ggml.

Enquanto isso, o /reels aceita um .srt escrito à mão em --srt.
Nada disso usa API paga.`);
  process.exit(2);
}

main();
