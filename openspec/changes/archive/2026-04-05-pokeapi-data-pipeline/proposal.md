## Why

O Pokemon Box Manager precisa de dados de Pokemon para funcionar — sprites, nomes, tipos, formas, disponibilidade por jogo, e cadeias evolutivas. A spec (secao 2.3) define que esses dados devem ser consumidos da PokeAPI em build-time e salvos como JSON estatico, eliminando dependencia de API em runtime. Este pipeline e prerequisito para todas as features de negocio (boxes, pokedex, stats, missing tracker).

## What Changes

- Criar script `src/scripts/fetch-pokemon-data.ts` que consome a PokeAPI em build-time
- Implementar batched fetching (20 requests concorrentes com delay) para respeitar rate limits da PokeAPI
- Gerar arquivos JSON normalizados em `src/data/`:
  - `pokemon.json` — Lista completa de PokemonEntry (National Dex)
  - `forms.json` — Todas as formas/variacoes (PokemonForm)
  - `games.json` — Disponibilidade por jogo
  - `generations.json` — Metadata de geracoes
  - `types.json` — Tipos e seus relacionamentos
  - `evolution-chains.json` — Cadeias evolutivas
- Definir tipos TypeScript em `src/types/pokemon.ts` e `src/types/game.ts` conforme spec secao 2.3
- Adicionar script npm `fetch-data` ao `package.json`
- Criar script de validacao `src/scripts/validate-data.ts` para verificar integridade dos JSONs gerados
- Implementar cache local para evitar re-fetch desnecessario durante desenvolvimento

## Capabilities

### New Capabilities

- `pokeapi-fetcher`: Client HTTP para PokeAPI com batching, retry, rate limiting, e cache local
- `data-normalization`: Pipeline de transformacao dos dados brutos da PokeAPI para o modelo normalizado (PokemonEntry, PokemonForm, etc.)
- `data-validation`: Script de validacao que verifica integridade e completude dos JSONs gerados

### Modified Capabilities
<!-- Nenhuma — dados estaticos sao uma capability nova -->

## Impact

- **Dependencias**: Nenhuma nova dependencia de runtime. Dependencias de dev: `tsx` (para rodar scripts TS)
- **Arquivos gerados**: ~6 arquivos JSON em `src/data/` (estimativa: ~5-10MB total)
- **Build time**: Fetch inicial pode levar 5-15 minutos (1000+ Pokemon × multiplos endpoints). Cache local reduz re-runs para segundos
- **Tipos**: Novos arquivos `src/types/pokemon.ts` e `src/types/game.ts` com interfaces spec 2.3
- **Scripts npm**: Novo script `fetch-data`
