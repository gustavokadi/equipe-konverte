#!/usr/bin/env node
/**
 * Busca e baixa fotos com licença livre nas APIs Pexels, Unsplash e Pixabay.
 * Sem chave, não inventa foto: avisa e deixa o carrossel no layout gráfico.
 * Freepik/Magnific é pago e só é mencionado no plano pago-plus. Este script não chama essa API.
 */
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, lerEnv, lerTier, pastaCliente } = require('./lib');

lerEnv();

const APP = 'equipe-konverte';

function creditosPath(dir) {
  return path.join(dir, 'referencias', 'banco', 'creditos.md');
}

function anexarCredito(dir, bloco) {
  const arquivo = creditosPath(dir);
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(
      arquivo,
      '# Créditos das fotos\n\nCada arquivo baixado por `motor/banco-imagens.js` fica registrado aqui. Sem chave, não há download.\n\n',
      'utf8'
    );
  }
  fs.appendFileSync(arquivo, bloco + '\n', 'utf8');
}

async function baixar(url, destino) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destino, buf);
  return buf.length;
}

async function pexels(consulta, quantidade) {
  const chave = process.env.PEXELS_API_KEY;
  if (!chave) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(consulta)}&per_page=${quantidade}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: chave } });
  if (!res.ok) throw new Error(`Pexels respondeu ${res.status}`);
  const json = await res.json();
  return (json.photos || []).slice(0, quantidade).map((foto) => ({
    banco: 'Pexels',
    arquivoUrl: foto.src?.large2x || foto.src?.large,
    autor: foto.photographer,
    autorUrl: foto.photographer_url,
    pagina: foto.url,
    credito: `Foto de ${foto.photographer} no Pexels. ${foto.url}`,
  }));
}

async function unsplash(consulta, quantidade) {
  const chave = process.env.UNSPLASH_ACCESS_KEY;
  if (!chave) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(consulta)}&per_page=${quantidade}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${chave}` } });
  if (!res.ok) throw new Error(`Unsplash respondeu ${res.status}`);
  const json = await res.json();
  const fotos = [];
  for (const foto of (json.results || []).slice(0, quantidade)) {
    const utm = `utm_source=${APP}&utm_medium=referral`;
    const downloadLocation = foto.links?.download_location;
    if (downloadLocation) {
      await fetch(`${downloadLocation}${downloadLocation.includes('?') ? '&' : '?'}client_id=${encodeURIComponent(chave)}`, {
        headers: { Authorization: `Client-ID ${chave}` },
      });
    }
    fotos.push({
      banco: 'Unsplash',
      arquivoUrl: foto.urls?.regular || foto.urls?.small,
      autor: foto.user?.name,
      autorUrl: `${foto.user?.links?.html || 'https://unsplash.com'}?${utm}`,
      pagina: `${foto.links?.html || 'https://unsplash.com'}?${utm}`,
      credito: `Foto de ${foto.user?.name} no Unsplash (${foto.links?.html}).`,
    });
  }
  return fotos;
}

async function pixabay(consulta, quantidade) {
  const chave = process.env.PIXABAY_API_KEY;
  if (!chave) return [];
  const url = `https://pixabay.com/api/?key=${encodeURIComponent(chave)}&q=${encodeURIComponent(consulta)}&image_type=photo&orientation=vertical&safesearch=true&per_page=${quantidade}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pixabay respondeu ${res.status}`);
  const json = await res.json();
  return (json.hits || []).slice(0, quantidade).map((foto) => ({
    banco: 'Pixabay',
    arquivoUrl: foto.largeImageURL || foto.webformatURL,
    autor: foto.user,
    autorUrl: `https://pixabay.com/users/${foto.user}-${foto.user_id}/`,
    pagina: foto.pageURL,
    credito: `Imagem de ${foto.user} no Pixabay. ${foto.pageURL}`,
  }));
}

async function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente || !args.consulta) {
    console.error('Uso: node motor/banco-imagens.js --cliente <slug> --consulta "termo" [--quantidade 2]');
    process.exit(1);
  }
  const dir = pastaCliente(args.cliente);
  const quantidade = Math.min(Number(args.quantidade || 2), 5);
  const consulta = String(args.consulta);
  const chaves = ['PEXELS_API_KEY', 'UNSPLASH_ACCESS_KEY', 'PIXABAY_API_KEY'].filter((k) => process.env[k]);

  if (args.freepik) {
    const tier = lerTier();
    console.log(
      'Freepik (API Magnific) é integração paga, só no plano pago-plus, com crédito da conta de quem comprou. Este comando não chama essa API.'
    );
    if (tier !== 'pago-plus') process.exit(chaves.length ? 0 : 2);
  }

  if (chaves.length === 0) {
    anexarCredito(
      dir,
      `## ${new Date().toISOString()}\n\nConsulta: ${consulta}\nResultado: nenhuma chave (PEXELS_API_KEY, UNSPLASH_ACCESS_KEY, PIXABAY_API_KEY). Carrossel segue em layout gráfico, com a tarja "sem foto de banco".\n`
    );
    console.log('Sem chave de banco. Nada foi baixado. O carrossel usa layout gráfico.');
    return;
  }

  const lotes = [];
  for (const buscar of [pexels, unsplash, pixabay]) {
    try {
      const achados = await buscar(consulta, quantidade);
      lotes.push(...achados);
    } catch (err) {
      console.error(err.message);
    }
    if (lotes.length >= quantidade) break;
  }
  const escolhidos = lotes.slice(0, quantidade);
  if (escolhidos.length === 0) {
    console.log('As APIs não devolveram foto utilizável. O carrossel segue em layout gráfico.');
    return;
  }

  const pasta = path.join(dir, 'referencias', 'banco');
  fs.mkdirSync(pasta, { recursive: true });
  let n = 0;
  for (const foto of escolhidos) {
    n += 1;
    const nome = `${Date.now()}-${n}.jpg`;
    const destino = path.join(pasta, nome);
    await baixar(foto.arquivoUrl, destino);
    anexarCredito(
      dir,
      `## ${nome}\n\n- Banco: ${foto.banco}\n- Autor: ${foto.autor}\n- Autor URL: ${foto.autorUrl}\n- Página: ${foto.pagina}\n- Consulta: ${consulta}\n- Arquivo: referencias/banco/${nome}\n- Crédito: ${foto.credito}\n`
    );
    console.log(`ok referencias/banco/${nome} (${foto.banco})`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
