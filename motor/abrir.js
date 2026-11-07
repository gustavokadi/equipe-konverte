#!/usr/bin/env node
/**
 * Lê plano, memória e registro. Não cria tarefa, não envia e não publica.
 */
const fs = require('fs');
const path = require('path');
const { RAIZ, argsParaObjeto, lerTier, lerJson, pastaCliente, slugify } = require('./lib');

const ARQUIVOS = [
  'memoria/empresa.md',
  'memoria/dna-de-voz.md',
  'memoria/experiencias.md',
  'memoria/teses.md',
  'memoria/antimodelo.md',
  'guia-visual.md',
];

function estadoArquivo(dir, rel) {
  const arquivo = path.join(dir, rel);
  if (!fs.existsSync(arquivo)) return 'ausente';
  const texto = fs.readFileSync(arquivo, 'utf8');
  if (!texto.trim() || texto.includes('{{')) return 'incompleto';
  return 'preenchido';
}

function listarSlugs() {
  const base = path.join(RAIZ, 'clientes');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);
}

function resumir(slug) {
  const dir = pastaCliente(slug);
  const perfil = lerJson(path.join(dir, 'perfil.json'), { nome: slug, slug });
  const registro = lerJson(path.join(dir, 'registro.json'), { itens: [] });
  const itens = Array.isArray(registro.itens) ? registro.itens : [];
  const memoria = ARQUIVOS.map((rel) => ({ arquivo: rel, estado: estadoArquivo(dir, rel) }));
  const exp = fs.existsSync(path.join(dir, 'memoria/experiencias.md'))
    ? fs.readFileSync(path.join(dir, 'memoria/experiencias.md'), 'utf8')
    : '';
  return {
    slug: slugify(slug),
    nome: perfil.nome || slug,
    experiencias: (exp.match(/^###\s+EXP-/gm) || []).length,
    memoria,
    aguardando: itens.filter((i) => i.status === 'aguardando'),
    aprovados: itens.filter((i) => i.status === 'aprovado').length,
    publicados: itens.filter((i) => i.status === 'publicado').length,
  };
}

function texto(dados) {
  const linhas = [
    'Equipe Konverte, abertura',
    `Plano: ${dados.plano}`,
    'Leitura só do que está no disco. Nada foi criado, enviado ou publicado.',
    '',
  ];
  if (dados.clientes.length === 0) {
    linhas.push('Nenhum cliente em clientes/. Rode /novo-cliente quando for cadastrar um.');
    return linhas.join('\n');
  }
  for (const c of dados.clientes) {
    linhas.push(`Cliente: ${c.nome} (${c.slug})`);
    linhas.push(`Experiências marcadas: ${c.experiencias}`);
    for (const m of c.memoria) linhas.push(`- ${m.arquivo}: ${m.estado}`);
    linhas.push(`Aguardando no registro: ${c.aguardando.length}`);
    for (const item of c.aguardando) {
      linhas.push(`- ${item.tipo || 'peca'} ${item.id || 'sem id'} (${item.caminho || 'sem caminho'})`);
    }
    linhas.push(`Aprovados: ${c.aprovados}. Publicados: ${c.publicados}.`);
    linhas.push('');
  }
  return linhas.join('\n').trim() + '\n';
}

function main() {
  const args = argsParaObjeto(process.argv.slice(2));
  const slugs = args.cliente ? [args.cliente] : listarSlugs();
  const dados = {
    plano: lerTier(),
    criou: false,
    enviou: false,
    publicou: false,
    clientes: slugs.map(resumir),
  };
  if (args.json) process.stdout.write(JSON.stringify(dados, null, 2) + '\n');
  else process.stdout.write(texto(dados));
}

main();
