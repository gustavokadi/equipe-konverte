#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { RAIZ, lerJson, lerTier } = require('./lib');

function listarClientes() {
  const base = path.join(RAIZ, 'clientes');
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);
}

function main() {
  const tier = lerTier();
  const clientes = listarClientes().map((slug) => {
    const dir = path.join(RAIZ, 'clientes', slug);
    const perfil = lerJson(path.join(dir, 'perfil.json'), { nome: slug });
    const registro = lerJson(path.join(dir, 'registro.json'), { itens: [] });
    const itens = registro.itens || [];
    const contar = (status) => itens.filter((i) => i.status === status).length;
    return {
      slug,
      nome: perfil.nome || slug,
      nicho: perfil.nicho || '',
      produzido: itens.length,
      aguardando: contar('aguardando'),
      aprovado: contar('aprovado'),
      publicado: contar('publicado'),
      itens,
    };
  });

  const linhas = clientes
    .map((c) => {
      const pecas = c.itens
        .map(
          (i) =>
            `<li><span class="tag">${i.status}</span> <strong>${i.tipo}</strong> ${i.id}<br><code>${i.caminho || ''}</code></li>`
        )
        .join('');
      return `<section>
        <h2>${c.nome}</h2>
        <p class="nicho">${c.nicho}</p>
        <div class="nums">
          <div><b>${c.produzido}</b><span>produzido</span></div>
          <div><b>${c.aguardando}</b><span>aguardando</span></div>
          <div><b>${c.aprovado}</b><span>aprovado</span></div>
          <div><b>${c.publicado}</b><span>publicado</span></div>
        </div>
        <ul>${pecas || '<li>Nada no registro ainda.</li>'}</ul>
      </section>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel Equipe Konverte</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f3ede2; color: #1c1915; }
  header { padding: 32px 8vw 8px; }
  h1 { font-family: "Bebas Neue", Impact, sans-serif; font-size: 64px; letter-spacing: 0.5px; margin: 0; font-weight: 400; }
  .meta { color: #5c564c; }
  main { padding: 8px 8vw 64px; display: grid; gap: 24px; }
  section { background: #fffdf8; border: 1px solid #e4d9c8; padding: 24px; }
  h2 { margin: 0 0 4px; }
  .nicho { margin: 0 0 16px; color: #5c564c; }
  .nums { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .nums div { background: #12352f; color: #f3ede2; padding: 12px; }
  .nums b { display: block; font-size: 28px; }
  .nums span { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
  ul { list-style: none; padding: 0; }
  li { padding: 10px 0; border-bottom: 1px solid #eee4d6; }
  .tag { display: inline-block; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; background: #e0a15a; padding: 2px 6px; }
  code { color: #5c564c; }
  @media (max-width: 700px) { .nums { grid-template-columns: 1fr 1fr; } h1 { font-size: 48px; } }
</style>
</head>
<body>
<header>
  <p class="meta">Equipe Konverte · plano ${tier}</p>
  <h1>Painel do dono</h1>
  <p class="meta">Arquivo local. Nada aqui publica sozinho. Atualizado em ${new Date().toISOString()}.</p>
</header>
<main>
${linhas || '<p>Nenhum cliente ainda. Rode /novo-cliente.</p>'}
</main>
</body>
</html>`;

  const destino = path.join(RAIZ, 'painel', 'index.html');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html, 'utf8');
  console.log(destino);
}

main();
