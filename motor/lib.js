const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');

function lerEnv() {
  const arquivo = path.join(RAIZ, '.env');
  if (!fs.existsSync(arquivo)) return;
  const texto = fs.readFileSync(arquivo, 'utf8');
  for (const linha of texto.split('\n')) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith('#')) continue;
    const i = limpa.indexOf('=');
    if (i === -1) continue;
    const chave = limpa.slice(0, i).trim();
    const valor = limpa.slice(i + 1).trim();
    if (!process.env[chave]) process.env[chave] = valor;
  }
}

function lerJson(arquivo, fallback) {
  if (!fs.existsSync(arquivo)) return fallback;
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function escreverJson(arquivo, dados) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2) + '\n', 'utf8');
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pastaCliente(slug) {
  const nome = slugify(slug);
  if (!nome) {
    throw new Error('Informe o cliente. Exemplo: --cliente clinica-sorriso-bom');
  }
  const dir = path.join(RAIZ, 'clientes', nome);
  if (!fs.existsSync(dir)) {
    throw new Error(`Cliente não encontrado: clientes/${nome}. Rode /novo-cliente antes.`);
  }
  return dir;
}

function lerPerfil(slug) {
  const dir = pastaCliente(slug);
  const arquivo = path.join(dir, 'perfil.json');
  if (!fs.existsSync(arquivo)) {
    throw new Error(`Falta perfil.json em clientes/${slugify(slug)}.`);
  }
  return { dir, perfil: JSON.parse(fs.readFileSync(arquivo, 'utf8')) };
}

function lerTier() {
  const arquivo = path.join(RAIZ, 'config', 'tier.json');
  const dados = lerJson(arquivo, { tier: 'gratis' });
  return dados.tier || 'gratis';
}

function acharChrome() {
  const ambiente = lerJson(path.join(RAIZ, 'config', 'ambiente.json'), {});
  const candidatos = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    ambiente.chrome,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  ].filter(Boolean);

  for (const candidato of candidatos) {
    if (fs.existsSync(candidato)) return candidato;
  }

  for (const bin of ['google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser']) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}

function temComando(bin) {
  const r = spawnSync('which', [bin], { encoding: 'utf8' });
  return r.status === 0 && Boolean(r.stdout.trim());
}

function fileUrl(arquivo) {
  const abs = path.resolve(arquivo).replace(/\\/g, '/');
  return 'file://' + (abs.startsWith('/') ? abs : '/' + abs);
}

function fontesCss() {
  const dir = path.join(RAIZ, 'motor', 'fontes');
  const bebas = fileUrl(path.join(dir, 'BebasNeue-Regular.ttf'));
  const regular = fileUrl(path.join(dir, 'Inter-Regular.ttf'));
  const bold = fileUrl(path.join(dir, 'Inter-Bold.ttf'));
  return `
@font-face { font-family: 'Bebas Neue'; src: url('${bebas}') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Inter'; src: url('${regular}') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Inter'; src: url('${bold}') format('truetype'); font-weight: 700; font-display: swap; }
`;
}

function lerPaleta(paletaPath) {
  const css = fs.readFileSync(paletaPath, 'utf8');
  const vars = {};
  for (const match of css.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
    vars[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return vars;
}

function registrarItem(slug, item) {
  const dir = pastaCliente(slug);
  const arquivo = path.join(dir, 'registro.json');
  const registro = lerJson(arquivo, { itens: [] });
  registro.itens = registro.itens.filter((i) => i.id !== item.id);
  registro.itens.push({
    status: 'aguardando',
    criado_em: new Date().toISOString(),
    ...item,
  });
  escreverJson(arquivo, registro);
}

function argsParaObjeto(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      out._.push(a);
      continue;
    }
    const chave = a.slice(2);
    const prox = argv[i + 1];
    if (!prox || prox.startsWith('--')) out[chave] = true;
    else {
      out[chave] = prox;
      i++;
    }
  }
  return out;
}

module.exports = {
  RAIZ,
  lerEnv,
  lerJson,
  escreverJson,
  slugify,
  pastaCliente,
  lerPerfil,
  lerTier,
  acharChrome,
  temComando,
  fileUrl,
  fontesCss,
  lerPaleta,
  registrarItem,
  argsParaObjeto,
};
