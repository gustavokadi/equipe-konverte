---
name: radar
description: Junta ideias e manchetes do nicho do cliente para o dia. Use em /radar. RSS por padrão. Firecrawl só se houver chave.
---

# Radar

```bash
node motor/radar.js --cliente <slug>
```

O padrão é RSS público do Google Notícias, em português, com a consulta de `perfil.json`. Não precisa de chave.

Firecrawl não vem neste repositório. A licença dele é AGPL. Com `FIRECRAWL_API_KEY` no `.env`, o mesmo comando chama a API hospedada e anexa o resultado. Sem a chave, segue só com o RSS.

Para ler um PDF ou uma página salva do cliente, use a skill `leitura-materiais`.

## Depois do arquivo
Leia `conteudo/radar/AAAA-MM-DD.md`. Separe o que serve de pauta e o que é ruído. Não transforme manchete em post sem tese e sem experiência. Não copie o texto da notícia.
