const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  lerEnv,
  lerPaleta,
  fontesCss,
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

function baseCss(cor, width, height) {
  return `
    ${fontesCss()}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    body {
      background: ${cor['cor-fundo'] || '#12352F'};
      color: ${cor['cor-texto'] || '#F3EDE2'};
      font-family: ${cor['fonte-corpo'] || "'Inter', sans-serif"};
    }
    .quadro {
      width: ${width}px;
      height: ${height}px;
      padding: 72px 76px 64px;
      display: flex;
      flex-direction: column;
    }
    .kicker {
      font-size: 22px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${cor['cor-destaque'] || '#E0A15A'};
      font-weight: 700;
    }
    h1 {
      font-family: ${cor['fonte-titulo'] || "'Bebas Neue', sans-serif"};
      font-weight: 400;
      font-size: 108px;
      line-height: 0.9;
      letter-spacing: 0.5px;
      margin-top: 28px;
    }
    h1 .destaque, .destaque { color: ${cor['cor-destaque'] || '#E0A15A'}; }
    .corpo {
      margin-top: 36px;
      font-size: 36px;
      line-height: 1.35;
      max-width: 900px;
      color: ${cor['cinza-claro'] || '#F3EDE2'};
    }
    .miolo { flex: 1; }
    .rodape {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 24px;
      letter-spacing: 0.04em;
      color: ${cor['cinza-medio'] || '#C9C1B4'};
    }
    .numero {
      font-family: ${cor['fonte-titulo'] || "'Bebas Neue', sans-serif"};
      font-size: 42px;
      color: ${cor['cor-texto'] || '#fff'};
    }
    .linha {
      width: 88px;
      height: 6px;
      background: ${cor['cor-destaque'] || '#E0A15A'};
      margin-top: 28px;
    }
    .card {
      margin-top: 28px;
      background: ${cor['cor-fundo-card'] || '#1B463E'};
      border-left: 8px solid ${cor['cor-destaque'] || '#E0A15A'};
      padding: 28px 32px;
      font-size: 32px;
      line-height: 1.35;
    }
  `;
}

function htmlSlide(cor, slide, width, height, indice, total) {
  const tipo = slide.tipo || 'conteudo';
  const numero = String(indice + 1).padStart(2, '0');
  const css = baseCss(cor, width, height);
  let miolo = '';
  if (tipo === 'capa') {
    miolo = `
      <div class="kicker">${escapar(slide.kicker || '')}</div>
      <h1>${escapar(slide.titulo || '')}${slide.destaque ? ` <span class="destaque">${escapar(slide.destaque)}</span>` : ''}</h1>
      <div class="linha"></div>
      ${slide.apoio ? `<p class="corpo">${escapar(slide.apoio)}</p>` : ''}
    `;
  } else if (tipo === 'cta') {
    miolo = `
      <div class="kicker">${escapar(slide.kicker || 'próximo passo')}</div>
      <h1>${escapar(slide.titulo || '')}</h1>
      <div class="linha"></div>
      <p class="corpo">${escapar(slide.texto || '')}</p>
      ${slide.cta ? `<div class="card">${escapar(slide.cta)}</div>` : ''}
    `;
  } else {
    miolo = `
      <div class="kicker">${escapar(slide.kicker || `ideia ${numero}`)}</div>
      <h1 style="font-size:92px">${escapar(slide.titulo || '')}</h1>
      <p class="corpo">${escapar(slide.texto || '')}</p>
      ${slide.nota ? `<div class="card">${escapar(slide.nota)}</div>` : ''}
    `;
  }
  const rodapeEsq = escapar(slide.rodape || '');
  const rodapeDir = tipo === 'capa' ? '' : `${numero} / ${String(total).padStart(2, '0')}`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="quadro"><div class="miolo">${miolo}</div>
<div class="rodape"><span>${rodapeEsq}</span><span class="numero">${rodapeDir}</span></div>
</div></body></html>`;
}

async function renderizarSpec({ cliente, spec, paletaPath }) {
  const cor = lerPaleta(paletaPath);
  const width = spec.largura || 1080;
  const height = spec.altura || 1350;
  const id = spec.id || `${new Date().toISOString().slice(0, 10)}_${slugify(spec.tema || 'post')}`;
  const outputDir = path.join(path.dirname(paletaPath), '..', 'conteudo', 'output', id);
  const slides = spec.slides.map((slide, i) => htmlSlide(cor, slide, width, height, i, spec.slides.length));
  await criarCarrossel({
    outputDir,
    slides,
    legenda: spec.legenda || '',
    width,
    height,
  });
  fs.writeFileSync(
    path.join(outputDir, 'ficha.md'),
    `# ${id}\n\nStatus: aguardando aprovação\nCliente: ${cliente}\nExperiência: ${spec.experiencia || 'não marcada'}\nTese: ${spec.tese || 'não marcada'}\n`,
    'utf8'
  );
  registrarItem(cliente, {
    id,
    tipo: 'carrossel',
    caminho: path.relative(path.join(path.dirname(paletaPath), '..'), outputDir),
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
  getPexelsImage,
  getNextPhoto,
  lerPaleta,
};
