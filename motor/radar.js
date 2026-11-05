#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { argsParaObjeto, lerPerfil, lerEnv } = require('./lib');

lerEnv();

function extrairItens(xml) {
  const itens = [];
  const blocos = xml.split(/<item>/i).slice(1);
  for (const bloco of blocos.slice(0, 8)) {
    const titulo = (bloco.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i) || [])[1] || '';
    const link = (bloco.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || '';
    itens.push({ titulo: titulo.replace(/<[^>]+>/g, '').trim(), link: link.trim() });
  }
  return itens.filter((i) => i.titulo);
}

async function firecrawl(consulta) {
  const chave = process.env.FIRECRAWL_API_KEY;
  if (!chave) return null;
  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: consulta, limit: 5, lang: 'pt' }),
  });
  if (!res.ok) return { erro: `Firecrawl respondeu ${res.status}` };
  const json = await res.json();
  return json.data || json.results || json;
}

async function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  if (!args.cliente) {
    console.error('Uso: node motor/radar.js --cliente <slug>');
    process.exit(1);
  }
  const { dir, perfil } = lerPerfil(args.cliente);
  const consulta = args.consulta || perfil.consulta_radar || perfil.nicho || perfil.nome;
  const dia = new Date().toISOString().slice(0, 10);
  const pasta = path.join(dir, 'conteudo', 'radar');
  fs.mkdirSync(pasta, { recursive: true });
  const destino = path.join(pasta, `${dia}.md`);

  let rss = [];
  let aviso = '';
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(consulta)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'EquipeKonverte/1.0' } });
    if (!res.ok) throw new Error(String(res.status));
    rss = extrairItens(await res.text());
  } catch (err) {
    aviso = `RSS indisponível nesta rede (${err.message}). O arquivo foi criado mesmo assim para a pauta não travar.`;
  }

  let extra = '';
  if (process.env.FIRECRAWL_API_KEY) {
    try {
      const dados = await firecrawl(consulta);
      extra = '\n\n## Firecrawl\n\n```json\n' + JSON.stringify(dados, null, 2).slice(0, 4000) + '\n```\n';
    } catch (err) {
      extra = `\n\nFirecrawl falhou: ${err.message}\n`;
    }
  } else {
    extra = '\n\nFirecrawl não está configurado. O código dele não vem neste repositório (licença AGPL). Com FIRECRAWL_API_KEY no .env, este comando chama a API hospedada.\n';
  }

  const lista = rss.length
    ? rss.map((i, n) => `${n + 1}. ${i.titulo}\n   ${i.link}`).join('\n')
    : '- Sem manchetes hoje. Use o banco de experiências do cliente.';

  const md = `# Radar ${dia}\n\nCliente: ${perfil.nome}\nConsulta: ${consulta}\n\n${aviso ? aviso + '\n\n' : ''}## Manchetes\n\n${lista}\n${extra}\n## Como virar pauta\n\nCada manchete só entra no calendário se defender uma tese de memoria/teses.md e puder usar uma experiência ainda não gasta. Se não der, descarte.\n`;
  fs.writeFileSync(destino, md, 'utf8');
  console.log(destino);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
