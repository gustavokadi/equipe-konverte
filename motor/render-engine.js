const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  lerEnv,
  lerPaleta,
  fontesCss,
  fileUrl,
  acharChrome,
  registrarItem,
  slugify,
} = require('./lib');

lerEnv();

function escapar(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function abrirNavegador() {
  const puppeteer = require('puppeteer-core');
  const executablePath = acharChrome();
  if (!executablePath) {
    throw new Error(
      'Chrome não encontrado. Instale o Google Chrome ou rode node motor/instalar.js. ' +
        'Este projeto usa puppeteer-core de propósito: o postinstall do Puppeteer completo quebra no npm 11.'
    );
  }
  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });
}

async function exportPNG(page, html, outputPath, { width = 1080, height = 1350 } = {}) {
  const tmp = path.join(os.tmpdir(), `slide_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(tmp, html, 'utf8');
  await page.goto(`file://${tmp}`, { waitUntil: 'load' });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: outputPath, type: 'png', clip: { x: 0, y: 0, width, height } });
  fs.unlinkSync(tmp);
  console.log(`  ok ${path.basename(outputPath)}`);
}

async function criarCarrossel({ outputDir, slides, legenda, width = 1080, height = 1350 }) {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await abrirNavegador();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    for (let i = 0; i < slides.length; i++) {
      const nome = slides.length === 1 ? 'post.png' : `slide_${i + 1}.png`;
      await exportPNG(page, slides[i], path.join(outputDir, nome), { width, height });
    }
  } finally {
    await browser.close();
  }
  if (legenda) {
    fs.writeFileSync(path.join(outputDir, 'legenda.md'), legenda, 'utf8');
    console.log('  ok legenda.md');
  }
  console.log(`Conteúdo em ${outputDir} (${slides.length} imagem)`);
}

const TIPOS = ['frase', 'foto-cheia', 'foto-split', 'lista', 'cta'];

function familia(valor, padrao) {
  const bruto = String(valor || padrao).replace(/['"]/g, '');
  const nome = bruto.split(',')[0].trim() || padrao;
  return `'${nome}', sans-serif`;
}

function tema(paleta) {
  return {
    fundo: paleta['cor-fundo'] || '#12352F',
    card: paleta['cor-fundo-card'] || '#1B463E',
    texto: paleta['cor-texto'] || '#F3EDE2',
    destaque: paleta['cor-destaque'] || '#E0A15A',
    claro: paleta['cinza-claro'] || '#F3EDE2',
    medio: paleta['cinza-medio'] || '#C9C1B4',
    escuro: paleta['cinza-escuro'] || '#0C2420',
    titulo: familia(paleta['fonte-titulo'], 'Bebas Neue'),
    corpo: familia(paleta['fonte-corpo'], 'Inter'),
  };
}

function resolverFoto(slide, clienteDir) {
  if (!slide.foto) return null;
  const arquivo = path.isAbsolute(slide.foto) ? slide.foto : path.join(clienteDir, slide.foto);
  if (!fs.existsSync(arquivo)) return null;
  return fileUrl(arquivo);
}

function rodapeHtml(c, esquerda, direita, claro) {
  const cor = claro ? 'rgba(18,53,47,0.72)' : c.medio;
  return `<div style="display:flex;justify-content:space-between;align-items:flex-end;font-family:${c.corpo};font-size:22px;letter-spacing:0.04em;color:${cor};margin-top:28px;">
    <span>${escapar(esquerda || '')}</span><span style="font-family:${c.titulo};font-size:36px;color:${claro ? c.escuro : c.texto};">${escapar(direita || '')}</span>
  </div>`;
}

function documento(c, width, height, miolo) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${fontesCss()}
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:${width}px; height:${height}px; overflow:hidden; background:${c.fundo}; color:${c.texto}; font-family:${c.corpo}; }
    .quadro { width:${width}px; height:${height}px; position:relative; overflow:hidden; }
    .kicker { font-size:22px; letter-spacing:0.18em; text-transform:uppercase; font-weight:700; color:${c.destaque}; }
  </style></head><body><div class="quadro">${miolo}</div></body></html>`;
}

function htmlFrase(c, slide, width, height, numero, total) {
  const direita = `${numero} / ${String(total).padStart(2, '0')}`;
  return documento(c, width, height, `
    <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:68px 76px 52px;background:${c.fundo};">
      <div class="kicker">${escapar(slide.kicker || '')}</div>
      <div>
        <div style="font-family:${c.titulo};font-size:78px;line-height:0.9;letter-spacing:0.5px;">${escapar(slide.titulo || '')}</div>
        <div style="font-family:${c.titulo};font-size:188px;line-height:0.82;color:${c.destaque};margin-top:8px;">${escapar(slide.destaque || '')}</div>
      </div>
      <div>
        <div style="width:140px;height:8px;background:${c.destaque};margin-bottom:28px;"></div>
        <p style="font-size:40px;line-height:1.25;max-width:920px;">${escapar(slide.apoio || slide.texto || '')}</p>
        ${rodapeHtml(c, slide.rodape, direita)}
      </div>
    </div>`);
}

function htmlFotoCheia(c, slide, width, height, numero, total, foto) {
  const direita = `${numero} / ${String(total).padStart(2, '0')}`;
  const aviso = foto ? '' : `<div style="position:absolute;top:36px;right:36px;background:${c.destaque};color:${c.escuro};font-size:16px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:8px 12px;">sem foto de banco</div>`;
  const credito = slide.credito
    ? `<div style="margin-top:10px;font-size:16px;letter-spacing:0.04em;color:${c.medio};">${escapar(slide.credito)}</div>`
    : '';
  const fundo = foto
    ? `<img src="${foto}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${slide.foco || 'center'};">`
    : `<div style="position:absolute;inset:0;background:${c.destaque};"></div>
       <div style="position:absolute;left:76px;top:80px;right:200px;font-family:${c.titulo};font-size:120px;line-height:0.84;color:${c.escuro};">${escapar(slide.selo || slide.kicker || 'CADEIRA')}</div>`;
  return documento(c, width, height, `
    ${fundo}
    ${aviso}
    <div style="position:absolute;left:0;right:0;bottom:0;height:58%;background:linear-gradient(180deg, rgba(21,36,28,0) 0%, ${c.escuro} 46%, ${c.escuro} 100%);"></div>
    <div style="position:absolute;left:72px;right:72px;bottom:48px;">
      <div class="kicker">${escapar(slide.kicker || '')}</div>
      <h1 style="font-family:${c.corpo};font-weight:700;font-size:68px;line-height:1.05;margin-top:16px;">${escapar(slide.titulo || '')}</h1>
      <p style="font-size:34px;line-height:1.3;margin-top:22px;max-width:920px;">${escapar(slide.texto || '')}</p>
      ${credito}
      ${rodapeHtml(c, slide.rodape, direita)}
    </div>`);
}

function htmlFotoSplit(c, slide, width, height, numero, total, foto) {
  const direita = `${numero} / ${String(total).padStart(2, '0')}`;
  const aviso = foto
    ? ''
    : `<div style="display:inline-block;margin-top:18px;background:${c.escuro};color:${c.claro};font-size:16px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:8px 12px;">sem foto de banco</div>`;
  const creditoFoto = foto && slide.credito
    ? `<div style="position:absolute;left:16px;right:16px;bottom:16px;background:rgba(12,36,32,0.78);color:#F3EDE2;font-size:15px;line-height:1.3;padding:8px 10px;">${escapar(slide.credito)}</div>`
    : '';
  const painel = foto
    ? `<img src="${foto}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:${slide.foco || 'center center'};display:block;">${creditoFoto}`
    : `<div style="height:100%;background:${c.claro};color:${c.escuro};padding:48px 40px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="font-size:20px;letter-spacing:0.18em;font-weight:700;">${escapar(slide.selo || 'PAINEL')}</div>
        <div style="font-family:${c.titulo};font-size:200px;line-height:0.8;">${escapar(numero)}</div>
        <div>
          <div style="font-family:${c.titulo};font-size:58px;line-height:0.88;">${escapar(slide.palavra || 'MARCA')}</div>
          ${aviso}
        </div>
      </div>`;
  return documento(c, width, height, `
    <div style="display:grid;grid-template-columns:460px 1fr;height:100%;">
      <div style="position:relative;overflow:hidden;background:${c.claro};">${painel}</div>
      <div style="height:100%;background:${c.fundo};padding:64px 52px 44px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="kicker">${escapar(slide.kicker || '')}</div>
          <h1 style="font-family:${c.corpo};font-weight:700;font-size:52px;line-height:1.08;margin-top:18px;">${escapar(slide.titulo || '')}</h1>
        </div>
        <p style="font-size:32px;line-height:1.32;">${escapar(slide.texto || '')}</p>
        <div>
          <div style="border-top:8px solid ${c.destaque};padding-top:18px;font-size:30px;font-weight:700;line-height:1.25;">${escapar(slide.nota || '')}</div>
          ${rodapeHtml(c, slide.rodape, direita)}
        </div>
      </div>
    </div>`);
}

function htmlLista(c, slide, width, height, numero, total) {
  const direita = `${numero} / ${String(total).padStart(2, '0')}`;
  const itens = Array.isArray(slide.itens) ? slide.itens : [];
  const linhas = itens
    .map((item, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `<div style="flex:1;display:flex;align-items:center;gap:28px;border-top:2px solid ${c.card};">
        <span style="font-family:${c.corpo};font-size:42px;font-weight:700;line-height:1;color:${c.destaque};width:84px;">${n}</span>
        <span style="font-size:40px;line-height:1.15;font-weight:700;">${escapar(item)}</span>
      </div>`;
    })
    .join('');
  return documento(c, width, height, `
    <div style="height:100%;display:flex;flex-direction:column;padding:60px 72px 44px;background:${c.fundo};">
      <div style="margin-bottom:12px;">
        <div class="kicker">${escapar(slide.kicker || '')}</div>
        <h1 style="font-family:${c.corpo};font-weight:700;font-size:64px;line-height:1.05;margin-top:12px;">${escapar(slide.titulo || '')}</h1>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;margin-top:20px;">${linhas}</div>
      ${rodapeHtml(c, slide.rodape, direita)}
    </div>`);
}

function htmlCta(c, slide, width, height, numero, total) {
  const direita = `${numero} / ${String(total).padStart(2, '0')}`;
  return documento(c, width, height, `
    <div style="height:100%;display:flex;flex-direction:column;background:${c.fundo};">
      <div style="flex:1;padding:72px 76px 36px;display:flex;flex-direction:column;justify-content:center;">
        <div class="kicker">${escapar(slide.kicker || '')}</div>
        <h1 style="font-family:${c.corpo};font-weight:700;font-size:72px;line-height:1.05;margin-top:18px;">${escapar(slide.titulo || '')}</h1>
        <div style="font-family:${c.corpo};font-weight:700;font-size:108px;line-height:1;color:${c.texto};margin-top:36px;">${escapar(slide.preco || '')}</div>
        <p style="font-size:34px;line-height:1.3;margin-top:22px;max-width:900px;">${escapar(slide.texto || '')}</p>
      </div>
      <div style="background:${c.destaque};color:${c.escuro};padding:36px 76px;font-size:36px;font-weight:700;line-height:1.2;">${escapar(slide.cta || '')}</div>
      <div style="padding:22px 76px 36px;">${rodapeHtml(c, slide.rodape, direita)}</div>
    </div>`);
}

function basicoAtivo(slide) {
  return slide.fundo === 'preto' || slide.fundo === 'branco' || slide.tipo === 'texto';
}

function parBasico(fundo) {
  const claro = fundo === 'branco';
  return {
    bg: claro ? '#FFFFFF' : '#0A0A0A',
    fg: claro ? '#111111' : '#F5F5F5',
  };
}

function iconeCarrossel(cor) {
  return `<svg width="58" height="58" viewBox="0 0 58 58" style="position:absolute;top:40px;right:40px;" aria-hidden="true">
    <rect x="6" y="16" width="30" height="30" rx="6" fill="none" stroke="${cor}" stroke-width="3.2"/>
    <rect x="18" y="8" width="30" height="30" rx="6" fill="${parFundo(cor)}" stroke="${cor}" stroke-width="3.2"/>
  </svg>`;
}

function parFundo(cor) {
  return cor === '#111111' ? '#FFFFFF' : '#0A0A0A';
}

function htmlBasico(slide, width, height) {
  const pal = parBasico(slide.fundo);
  const linhas = Array.isArray(slide.linhas) && slide.linhas.length
    ? slide.linhas
    : String(slide.texto || slide.titulo || '').split('\n').filter(Boolean);
  const chars = linhas.join(' ').length;
  const tamanho = chars < 32 ? 86 : chars < 60 ? 68 : chars < 110 ? 54 : 44;
  const corpo = linhas
    .map((linha) => `<p style="margin:0 0 18px;">${escapar(linha)}</p>`)
    .join('');
  const itens = Array.isArray(slide.itens) ? slide.itens : [];
  const lista = itens.length
    ? `<div style="margin-top:28px;text-align:left;">${itens
        .map(
          (item) =>
            `<p style="margin:0 0 22px;font-size:46px;font-weight:700;line-height:1.2;">- ${escapar(item)}</p>`
        )
        .join('')}</div>`
    : '';
  const titulo = slide.titulo
    ? `<p style="margin:0 0 8px;font-size:${itens.length ? 62 : tamanho}px;font-weight:700;line-height:1.12;">${escapar(slide.titulo)}</p>`
    : '';
  return documento(
    { fundo: pal.bg, texto: pal.fg, corpo: "'Inter', sans-serif", titulo: "'Inter', sans-serif", destaque: pal.fg },
    width,
    height,
    `${iconeCarrossel(pal.fg)}
    <div style="height:100%;background:${pal.bg};color:${pal.fg};display:flex;align-items:center;justify-content:center;padding:128px 84px 110px;text-align:${itens.length ? 'left' : 'center'};">
      <div style="width:100%;font-family:'Inter',sans-serif;font-weight:700;font-size:${tamanho}px;line-height:1.15;">
        ${titulo}${itens.length ? '' : corpo}${lista}
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:42px;text-align:center;font-family:'Inter',sans-serif;font-size:24px;letter-spacing:0.02em;color:${pal.fg};opacity:0.72;">${escapar(slide.rodape || '')}</div>`
  );
}

function htmlSlide(paleta, slide, width, height, indice, total, clienteDir) {
  if (basicoAtivo(slide)) return htmlBasico(slide, width, height);
  const c = tema(paleta);
  const numero = String(indice + 1).padStart(2, '0');
  const tipo = TIPOS.includes(slide.tipo) ? slide.tipo : slide.tipo === 'capa' ? 'frase' : 'frase';
  const foto = resolverFoto(slide, clienteDir);
  if (tipo === 'foto-cheia') return htmlFotoCheia(c, slide, width, height, numero, total, foto);
  if (tipo === 'foto-split') return htmlFotoSplit(c, slide, width, height, numero, total, foto);
  if (tipo === 'lista') return htmlLista(c, slide, width, height, numero, total);
  if (tipo === 'cta') return htmlCta(c, slide, width, height, numero, total);
  return htmlFrase(c, slide, width, height, numero, total);
}

function exigirGuia(clienteDir) {
  const guia = path.join(clienteDir, 'guia-visual.md');
  if (!fs.existsSync(guia) || fs.readFileSync(guia, 'utf8').trim().length < 80) {
    throw new Error(
      'Falta clientes/<cliente>/guia-visual.md. Pare, peça as referências e grave o guia antes do primeiro carrossel.'
    );
  }
}

async function renderizarSpec({ cliente, spec, paletaPath }) {
  const clienteDir = path.resolve(path.dirname(paletaPath), '..');
  exigirGuia(clienteDir);
  const paleta = lerPaleta(paletaPath);
  const width = spec.largura || 1080;
  const height = spec.altura || 1350;
  const id = spec.id || `${new Date().toISOString().slice(0, 10)}_${slugify(spec.tema || 'post')}`;
  const outputDir = path.join(clienteDir, 'conteudo', 'output', id);
  const slides = spec.slides.map((slide, i) => htmlSlide(paleta, slide, width, height, i, spec.slides.length, clienteDir));
  await criarCarrossel({
    outputDir,
    slides,
    legenda: spec.legenda || '',
    width,
    height,
  });
  const tipos = spec.slides.map((s) => s.tipo).join(', ');
  const semFoto = spec.slides.filter((s) => (s.tipo === 'foto-cheia' || s.tipo === 'foto-split') && !resolverFoto(s, clienteDir)).length;
  fs.writeFileSync(
    path.join(outputDir, 'ficha.md'),
    `# ${id}\n\nStatus: aguardando aprovação\nCliente: ${cliente}\nExperiência: ${spec.experiencia || 'não marcada'}\nTese: ${spec.tese || 'não marcada'}\nTipos: ${tipos}\nGuia: guia-visual.md\nFotos de banco ausentes neste render: ${semFoto}. Sem chave, o slide usa painel gráfico e a tarja "sem foto de banco".\n`,
    'utf8'
  );
  registrarItem(cliente, {
    id,
    tipo: 'carrossel',
    caminho: path.relative(clienteDir, outputDir),
    status: 'aguardando',
  });
  return outputDir;
}

async function getPexelsImage(query) {
  if (!process.env.PEXELS_API_KEY) return '';
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=square`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || '';
  } catch {
    return '';
  }
}

function getNextPhoto(assetsDir, controlPath) {
  if (!fs.existsSync(controlPath)) return null;
  const ctrl = JSON.parse(fs.readFileSync(controlPath, 'utf8'));
  if (!ctrl.disponiveis || ctrl.disponiveis.length === 0) {
    ctrl.disponiveis = (ctrl.todas || []).filter((f) => f !== ctrl.ultima_foto_usada);
    ctrl.historico = [ctrl.ultima_foto_usada].filter(Boolean);
  }
  const foto = ctrl.disponiveis.shift();
  if (!foto) return null;
  const full = path.resolve(assetsDir, foto);
  if (!fs.existsSync(full)) return getNextPhoto(assetsDir, controlPath);
  ctrl.ultima_foto_usada = foto;
  ctrl.historico = ctrl.historico || [];
  ctrl.historico.push(foto);
  fs.writeFileSync(controlPath, JSON.stringify(ctrl, null, 2) + '\n', 'utf8');
  return `file://${full}`;
}

module.exports = {
  abrirNavegador,
  exportPNG,
  criarCarrossel,
  renderizarSpec,
  htmlSlide,
  TIPOS,
  getPexelsImage,
  getNextPhoto,
  lerPaleta,
};
