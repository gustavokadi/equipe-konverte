#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, lerPerfil, lerPaleta } = require('./lib');

function esc(t) {
  return String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/site.js --cliente <slug>');
    process.exit(1);
  }
  const { dir, perfil } = lerPerfil(args.cliente);
  const cor = lerPaleta(path.join(dir, 'identidade', 'paleta.css'));
  const fundo = cor['cor-fundo'] || '#12352F';
  const texto = cor['cor-texto'] || '#F3EDE2';
  const destaque = cor['cor-destaque'] || '#E0A15A';
  const card = cor['cor-fundo-card'] || '#1B463E';
  const servicos = (perfil.servicos || [])
    .map((s) => `<article><h3>${esc(s.nome)}</h3><p>${esc(s.texto)}</p></article>`)
    .join('');
  const faq = (perfil.faq || [])
    .map((f) => `<details><summary>${esc(f.pergunta)}</summary><p>${esc(f.resposta)}</p></details>`)
    .join('');
  const provas = (perfil.prova || [])
    .map((p) => `<div><b>${esc(p.numero)}</b><span>${esc(p.legenda)}</span></div>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(perfil.nome)} · ${esc(perfil.cidade || '')}</title>
<meta name="description" content="${esc(perfil.oferta_detalhe || perfil.frase || '')}">
<meta name="robots" content="noindex">
<style>
  @font-face { font-family: 'Bebas Neue'; src: url('fontes/BebasNeue-Regular.ttf') format('truetype'); font-display: swap; }
  @font-face { font-family: Inter; src: url('fontes/Inter-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: Inter; src: url('fontes/Inter-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font-family: Inter, system-ui, sans-serif; background: ${fundo}; color: ${texto}; line-height: 1.5; }
  a { color: inherit; }
  header, main, footer { padding: 28px 8vw; }
  .aviso { background: ${destaque}; color: #1c1915; padding: 8px 8vw; font-size: 14px; }
  .marca { letter-spacing: 0.16em; text-transform: uppercase; font-size: 13px; color: ${destaque}; }
  h1, h2, h3 { font-family: "Bebas Neue", Impact, sans-serif; font-weight: 400; letter-spacing: 0.4px; line-height: 0.92; }
  h1 { font-size: clamp(56px, 9vw, 112px); margin: 12px 0; max-width: 14ch; }
  h2 { font-size: clamp(40px, 6vw, 72px); margin: 0 0 12px; }
  .hero p { max-width: 42rem; font-size: 20px; }
  .cta { display: inline-block; margin-top: 12px; border: 1px solid ${destaque}; color: ${destaque}; padding: 14px 22px; text-decoration: none; font-weight: 700; }
  .provas { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 28px; }
  .provas div { background: ${card}; padding: 16px; }
  .provas b { display: block; font-family: "Bebas Neue", sans-serif; font-size: 42px; color: ${destaque}; font-weight: 400; }
  section { padding: 28px 0; }
  .grade { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
  article, details { background: ${card}; padding: 16px 18px; }
  summary { cursor: pointer; font-weight: 700; }
  footer { color: #c9c1b4; font-size: 14px; }
  @media (max-width: 700px) { header, main, footer { padding: 24px 20px; } }
</style>
</head>
<body>
<p class="aviso">Página de demonstração gerada pela Equipe Konverte. Cliente fictício. Não é um consultório real.</p>
<header class="hero">
  <p class="marca">${esc(perfil.nome)} · ${esc(perfil.cidade || '')}</p>
  <h1>${esc(perfil.frase || perfil.oferta_nome)}</h1>
  <p>${esc(perfil.oferta_detalhe || '')}</p>
  <a class="cta" href="#avaliacao">${esc(perfil.oferta_nome || 'Falar com a clínica')} · ${esc(perfil.oferta_preco || '')}</a>
  <div class="provas">${provas}</div>
</header>
<main>
  <section>
    <h2>O que a consulta olha</h2>
    <div class="grade">${servicos}</div>
  </section>
  <section>
    <h2>Perguntas que chegam toda semana</h2>
    ${faq}
  </section>
  <section id="avaliacao">
    <h2>Marcar a avaliação</h2>
    <p>${esc(perfil.publico || '')}</p>
    <p><strong>${esc(perfil.oferta_preco || '')}</strong> · ${esc(perfil.whatsapp_exibicao || '')}</p>
    <p>Quem atende: ${esc(perfil.responsavel || '')}.</p>
  </section>
</main>
<footer>
  <p>${esc(perfil.nome)} · ${esc(perfil.bairro || '')} · ${esc(perfil.cidade || '')}</p>
  <p>${esc(perfil.instagram || '')}</p>
</footer>
</body>
</html>`;

  const sites = path.join(dir, 'sites');
  const fontesDestino = path.join(sites, 'fontes');
  fs.mkdirSync(fontesDestino, { recursive: true });
  for (const nome of ['BebasNeue-Regular.ttf', 'Inter-Regular.ttf', 'Inter-Bold.ttf']) {
    fs.copyFileSync(path.join(__dirname, 'fontes', nome), path.join(fontesDestino, nome));
  }
  const index = path.join(sites, 'index.html');
  fs.writeFileSync(index, html, 'utf8');
  console.log(index);
}

if (require.main === module) main();
