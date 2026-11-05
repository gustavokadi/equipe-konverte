#!/usr/bin/env node
/**
 * Caminho de vídeo grátis da Equipe Konverte.
 * Corta, tira silêncio, queima legenda e cobre a abertura com B-roll + gancho.
 * Não usa Remotion nem HyperFrames. ffmpeg local, sem API paga.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { RAIZ, argsParaObjeto, pastaCliente, registrarItem, fileUrl } = require('../lib');

const FONTES = path.join(RAIZ, 'motor', 'fontes');

function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) {
    const detalhe = (r.stderr || r.stdout || '').split('\n').slice(-25).join('\n');
    throw new Error(`ffmpeg falhou\n${detalhe}`);
  }
  return r.stderr || '';
}

function ffprobe(arquivo) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', arquivo],
    { encoding: 'utf8' }
  );
  if (r.status !== 0) throw new Error(`ffprobe falhou em ${arquivo}`);
  return Number(JSON.parse(r.stdout).format.duration);
}

function escaparDrawtext(texto) {
  return String(texto)
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/\n/g, ' ');
}

function escaparFiltroArquivo(arquivo) {
  return arquivo.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

function gerarAmostra(destino) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  ffmpeg([
    '-f', 'lavfi', '-i', 'color=c=0x12352F:s=1080x1920:d=8:r=30',
    '-f', 'lavfi', '-i', 'sine=frequency=220:sample_rate=44100:duration=8',
    '-filter_complex',
    "[1:a]aformat=channel_layouts=stereo,volume=0:enable='between(t,1.3,2.6)+between(t,4.2,5.4)'[a]",
    '-map', '0:v', '-map', '[a]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest',
    destino,
  ]);
  return destino;
}

function gerarBroll(destino) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  ffmpeg([
    '-f', 'lavfi', '-i', 'color=c=0xE0A15A:s=1080x1920:d=3:r=30',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-t', '3', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest',
    destino,
  ]);
  return destino;
}

function detectarSilencio(arquivo) {
  const r = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-i', arquivo, '-af', 'silencedetect=noise=-35dB:d=0.35', '-f', 'null', '-'],
    { encoding: 'utf8' }
  );
  const log = `${r.stderr || ''}\n${r.stdout || ''}`;
  const silences = [];
  let aberto = null;
  for (const linha of log.split('\n')) {
    const ini = linha.match(/silence_start:\s*([0-9.]+)/);
    if (ini) aberto = Number(ini[1]);
    const fim = linha.match(/silence_end:\s*([0-9.]+)/);
    if (fim && aberto !== null) {
      silences.push({ start: aberto, end: Number(fim[1]) });
      aberto = null;
    }
  }
  return silences;
}

function inverterSilencio(duracao, silencios) {
  const cortes = [{ start: 0, end: duracao }];
  for (const s of silencios) {
    const prox = [];
    for (const c of cortes) {
      if (s.end <= c.start || s.start >= c.end) {
        prox.push(c);
        continue;
      }
      if (s.start > c.start) prox.push({ start: c.start, end: Math.max(c.start, s.start) });
      if (s.end < c.end) prox.push({ start: Math.min(c.end, s.end), end: c.end });
    }
    cortes.length = 0;
    cortes.push(...prox);
  }
  return cortes.filter((c) => c.end - c.start >= 0.2);
}

function parseCortes(texto, duracao) {
  if (!texto) return [{ start: 0, end: duracao }];
  return String(texto)
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [a, b] = p.split('-').map(Number);
      if (Number.isNaN(a) || Number.isNaN(b) || b <= a) {
        throw new Error(`Corte inválido: "${p}". Use inicio-fim em segundos, separado por vírgula.`);
      }
      return { start: Math.max(0, a), end: Math.min(duracao, b) };
    });
}

function cruzar(faixas, limites) {
  const saida = [];
  for (const f of faixas) {
    for (const l of limites) {
      const start = Math.max(f.start, l.start);
      const end = Math.min(f.end, l.end);
      if (end - start >= 0.2) saida.push({ start, end });
    }
  }
  saida.sort((a, b) => a.start - b.start);
  return saida;
}

function parseSrt(texto) {
  const blocos = texto.replace(/\r/g, '').split(/\n\n+/);
  const pistas = [];
  for (const bloco of blocos) {
    const linhas = bloco.split('\n').filter((l) => l.trim() !== '');
    if (linhas.length < 2) continue;
    const tempo = linhas.find((l) => l.includes('-->'));
    if (!tempo) continue;
    const [ini, fim] = tempo.split('-->').map((t) => tempoParaSeg(t.trim()));
    const iTempo = linhas.indexOf(tempo);
    const fala = linhas.slice(iTempo + 1).join('\n');
    pistas.push({ start: ini, end: fim, texto: fala });
  }
  return pistas;
}

function tempoParaSeg(t) {
  const m = t.replace(',', '.').match(/(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const h = m[1] ? Number(m[1]) : 0;
  return h * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

function segParaTempo(seg) {
  const s = Math.max(0, seg);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s - h * 3600 - m * 60;
  const inteiro = Math.floor(r);
  const ms = Math.round((r - inteiro) * 1000);
  const pad = (n, z = 2) => String(n).padStart(z, '0');
  return `${pad(h)}:${pad(m)}:${pad(inteiro)},${pad(ms, 3)}`;
}

function remapear(pistas, segmentos) {
  function mapa(t) {
    let acc = 0;
    for (const s of segmentos) {
      if (t <= s.start) return acc;
      if (t <= s.end) return acc + (t - s.start);
      acc += s.end - s.start;
    }
    return acc;
  }
  const saida = [];
  for (const p of pistas) {
    const start = mapa(p.start);
    const end = mapa(p.end);
    if (end - start < 0.15) continue;
    saida.push({ start, end, texto: p.texto });
  }
  return saida;
}

function escreverSrt(pistas, arquivo) {
  const corpo = pistas
    .map((p, i) => `${i + 1}\n${segParaTempo(p.start)} --> ${segParaTempo(p.end)}\n${p.texto}\n`)
    .join('\n');
  fs.writeFileSync(arquivo, corpo, 'utf8');
}

function srtDaAmostra() {
  return `1
00:00:00,200 --> 00:00:01,200
Gengiva primeiro.

2
00:00:02,700 --> 00:00:04,050
Gel sem consulta é roleta.

3
00:00:05,550 --> 00:00:07,400
Marca a avaliação.
`;
}

function concatenar(origem, segmentos, destino) {
  if (segmentos.length === 0) throw new Error('Nada restou depois dos cortes. Afrouxe o corte ou o silêncio.');
  const filtros = [];
  const entradas = [];
  segmentos.forEach((s, i) => {
    filtros.push(`[0:v]trim=start=${s.start.toFixed(3)}:end=${s.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`);
    filtros.push(
      `[0:a]atrim=start=${s.start.toFixed(3)}:end=${s.end.toFixed(3)},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo[a${i}]`
    );
    entradas.push(`[v${i}][a${i}]`);
  });
  filtros.push(`${entradas.join('')}concat=n=${segmentos.length}:v=1:a=1[v][a]`);
  ffmpeg([
    '-i', origem,
    '-filter_complex', filtros.join(';'),
    '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac',
    destino,
  ]);
}

function finalizar({ video, broll, gancho, srt, destino }) {
  const bebas = path.join(FONTES, 'BebasNeue-Regular.ttf');
  const filtros = [];
  filtros.push('[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,trim=duration=2.6,setpts=PTS-STARTPTS[b]');
  filtros.push('[0:v][b]overlay=enable=\'lt(t,2.6)\'[comgancho]');
  const ganchoTxt = escaparDrawtext(gancho);
  filtros.push(
    `[comgancho]drawtext=fontfile='${escaparFiltroArquivo(bebas)}':text='${ganchoTxt}':fontcolor=0x12352F:fontsize=78:line_spacing=8:x=(w-text_w)/2:y=220:enable='lt(t,3)'[vtexto]`
  );
  if (srt) {
    const srtEsc = escaparFiltroArquivo(srt);
    const fontesEsc = escaparFiltroArquivo(FONTES);
    filtros.push(
      `[vtexto]subtitles='${srtEsc}':fontsdir='${fontesEsc}':force_style='FontName=Inter,FontSize=16,PrimaryColour=&H00F3EDE2,OutlineColour=&H0012352F,BorderStyle=1,Outline=2,Alignment=2,MarginV=90'[v]`
    );
  } else {
    filtros.push('[vtexto]null[v]');
  }
  ffmpeg([
    '-i', video,
    '-i', broll,
    '-filter_complex', filtros.join(';'),
    '-map', '[v]', '-map', '0:a',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart',
    destino,
  ]);
}

function editar(opcoes) {
  const dir = pastaCliente(opcoes.cliente);
  const id = opcoes.id || `${new Date().toISOString().slice(0, 10)}_reel`;
  const pasta = path.join(dir, 'conteudo', 'reels', id);
  fs.mkdirSync(pasta, { recursive: true });
  const trabalho = path.join(pasta, 'trabalho');
  fs.mkdirSync(trabalho, { recursive: true });

  let origem = opcoes.entrada ? path.resolve(opcoes.entrada) : null;
  if (opcoes.amostra || !origem) {
    origem = gerarAmostra(path.join(trabalho, 'amostra.mp4'));
  }
  if (!fs.existsSync(origem)) throw new Error(`Vídeo de entrada não encontrado: ${origem}`);

  const duracao = ffprobe(origem);
  const silencios = detectarSilencio(origem);
  const semSilencio = inverterSilencio(duracao, silencios);
  const limites = parseCortes(opcoes.cortes, duracao);
  const segmentos = cruzar(semSilencio, limites);
  const cortado = path.join(trabalho, 'cortado.mp4');
  concatenar(origem, segmentos, cortado);

  let srtOrigem = opcoes.srt ? path.resolve(opcoes.srt) : null;
  if (!srtOrigem && opcoes.amostra) {
    srtOrigem = path.join(trabalho, 'amostra.srt');
    fs.writeFileSync(srtOrigem, srtDaAmostra(), 'utf8');
  }
  let srtFinal = null;
  if (srtOrigem && fs.existsSync(srtOrigem)) {
    const pistas = remapear(parseSrt(fs.readFileSync(srtOrigem, 'utf8')), segmentos);
    srtFinal = path.join(pasta, 'legendas.srt');
    escreverSrt(pistas, srtFinal);
  }

  const brollPath = opcoes.broll && opcoes.broll !== 'auto' ? path.resolve(opcoes.broll) : gerarBroll(path.join(trabalho, 'broll.mp4'));
  const gancho = opcoes.hook || opcoes.gancho || 'Assiste até o fim';
  const saida = path.join(pasta, 'reel.mp4');
  finalizar({ video: cortado, broll: brollPath, gancho, srt: srtFinal, destino: saida });

  const relatorio = {
    id,
    cliente: opcoes.cliente,
    operacoes: ['corte', 'silencio', 'broll', 'gancho', srtFinal ? 'legenda' : 'sem-legenda'],
    duracao_origem: Number(duracao.toFixed(3)),
    duracao_final: Number(ffprobe(saida).toFixed(3)),
    silencios,
    segmentos_mantidos: segmentos,
    gancho,
    saida: path.relative(dir, saida),
    motor: 'ffmpeg',
    pago: false,
  };
  fs.writeFileSync(path.join(pasta, 'relatorio.json'), JSON.stringify(relatorio, null, 2) + '\n');
  const roteiroPath = path.join(pasta, 'roteiro.md');
  if (opcoes.roteiro) {
    fs.copyFileSync(path.resolve(opcoes.roteiro), roteiroPath);
  } else if (!fs.existsSync(roteiroPath)) {
    fs.writeFileSync(
      roteiroPath,
      `# Roteiro\n\nGancho: ${gancho}\n\nEste corte usou o caminho grátis (ffmpeg). Sem API paga.\n`,
      'utf8'
    );
  }

  registrarItem(opcoes.cliente, {
    id,
    tipo: 'reel',
    caminho: path.relative(dir, pasta),
    status: 'aguardando',
  });
  console.log(`Reel em ${saida}`);
  console.log(`Duração ${relatorio.duracao_origem}s -> ${relatorio.duracao_final}s`);
  return relatorio;
}

if (require.main === module) {
  try {
    const args = argsParaObjeto(process.argv.slice(2));
    if (!args.cliente) {
      console.error(
        'Uso: node motor/video/editar.js --cliente <slug> [--entrada video.mp4] [--srt legendas.srt] [--cortes 0-4,6-9] [--hook "texto"] [--broll auto|arquivo] [--amostra]'
      );
      process.exit(1);
    }
    editar({
      cliente: args.cliente,
      entrada: args.entrada,
      srt: args.srt,
      cortes: args.cortes,
      hook: args.hook || args.gancho,
      broll: args.broll || 'auto',
      amostra: Boolean(args.amostra || !args.entrada),
      id: args.id,
      roteiro: args.roteiro,
    });
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

module.exports = { editar, parseSrt, remapear, segParaTempo, tempoParaSeg, fileUrl };
