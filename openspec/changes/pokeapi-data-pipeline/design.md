## Context

O Pokemon Box Manager precisa de dados de ~1025 Pokemon (Gen 1-9) com suas formas, tipos, sprites, e disponibilidade por jogo. A spec (secao 2.3) define que a PokeAPI deve ser consumida em build-time, gerando JSONs estaticos em `src/data/`. O app nunca faz chamadas API em runtime (exceto fallback para Pokemon novos, que sera implementado separadamente).

A PokeAPI e gratuita, sem autenticacao, mas tem rate limiting implicito. Requests excessivos podem resultar em throttling ou bloqueio temporario.

## Goals / Non-Goals

**Goals:**
- Script TypeScript executavel via `npm run fetch-data` que gera todos os JSONs necessarios
- Batched fetching: 20 requests concorrentes com 100ms de delay entre batches
- Dados normalizados conforme interfaces PokemonEntry e PokemonForm da spec 2.3
- Cache local em `.cache/pokeapi/` para evitar re-fetch durante desenvolvimento
- Validacao pos-fetch para garantir integridade e completude
- Suporte a nomes em PT-BR e EN (campo `names: Record<Locale, string>`)
- Classificacao correta de categorias: normal, legendary, mythical, baby, ultra-beast, paradox

**Non-Goals:**
- Runtime fallback para Pokemon novos (change futuro)
- Otimizacao de sprites (download/processamento de imagens)
- Pre-built presets de organizacao (change separado)
- Integracao com o app Next.js (importacao dos JSONs nos componentes)

## Decisions

### 1. Script standalone com tsx

**Escolha:** Script em `src/scripts/fetch-pokemon-data.ts` executado via `tsx` (TypeScript executor).
**Razao:** Permite usar TypeScript com ESM nativamente, sem compilacao previa. O script e independente do Next.js — roda diretamente no Node.
**Alternativa descartada:** `ts-node` — mais lento, configuracao mais complexa para ESM.

### 2. Batched fetching com p-limit

**Escolha:** Usar `p-limit` para limitar concorrencia a 20 requests simultaneos, com 100ms de delay entre batches.
**Razao:** A PokeAPI nao documenta rate limits exatos, mas a comunidade recomenda ~100 requests/segundo como safe. 20 concorrentes com delay e conservador e confiavel.
**Alternativa descartada:** Sequential fetching — muito lento (~15-30 min para 1000+ Pokemon). Fetch-all sem limite — risco de throttling.

```typescript
// Pseudo-codigo do batcher
const limit = pLimit(20);
const results = await Promise.all(
  ids.map(id => limit(async () => {
    const data = await fetchWithCache(`pokemon-species/${id}`);
    return normalize(data);
  }))
);
```

### 3. Cache local em disco

**Escolha:** Cache de respostas brutas da API em `.cache/pokeapi/` como arquivos JSON individuais (um por endpoint+id).
**Razao:** Evita re-fetch durante desenvolvimento. O primeiro run leva ~10 min, subsequentes levam ~30 seg (apenas normalizacao). O diretorio `.cache/` esta no `.gitignore`.
**Formato:** `.cache/pokeapi/pokemon-species-1.json`, `.cache/pokeapi/pokemon-25.json`, etc.

### 4. Pipeline em etapas sequenciais

**Escolha:** O script executa em 4 etapas sequenciais:
1. **Fetch National Dex** → lista de todos os Pokemon IDs
2. **Fetch detalhes** → species, pokemon, forms para cada ID (batched)
3. **Fetch metadata** → types, generations, games, evolution chains (batched)
4. **Normalize e salvar** → transformar dados brutos nas interfaces spec, salvar JSONs

**Razao:** Permite progress reporting claro, facilita debug, e cada etapa pode ser re-executada independentemente se falhar.

### 5. Classificacao de categorias Pokemon

**Escolha:** Mapear categorias da PokeAPI para o enum da spec usando uma combinacao de:
- `is_legendary` e `is_mythical` do endpoint species
- `is_baby` do endpoint species
- Lista hardcoded para ultra-beasts e paradox (PokeAPI nao tem campo especifico)

```typescript
// Ultra Beasts: Nihilego (#793) a Blacephalon (#806), Poipole (#803), Naganadel (#804), Stakataka (#805)
const ULTRA_BEAST_IDS = [793, 794, 795, 796, 797, 798, 799, 800, 803, 804, 805, 806];
// Paradox Pokemon: Great Tusk (#984) a Iron Leaves (#1010), Walking Wake (#1009), etc.
const PARADOX_IDS = [984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006, 1007, 1008, 1009, 1010];
```

**Razao:** PokeAPI classifica apenas legendary, mythical, e baby nativamente. Ultra-beasts e paradox requerem hardcoding por falta de campo na API.

### 6. Mapeamento de FormType

**Escolha:** Inferir o `FormType` da spec a partir do nome/tipo da forma na PokeAPI:
- Nomes contendo `-alola` → `regional-alola`
- Nomes contendo `-mega` → `mega`
- Nomes contendo `-gmax` → `gmax`
- Species especificas (Unown, Vivillon, Alcremie) → tipos dedicados
- Fallback para `other`

**Razao:** A PokeAPI nao categoriza formas da mesma maneira que a spec. O mapeamento precisa ser robusto com fallback.

### 7. Output: 6 arquivos JSON

**Escolha:** Gerar arquivos separados em vez de um monolito:
- `pokemon.json` — Array de PokemonEntry (principal, ~3-5MB)
- `forms.json` — Map de formId para PokemonForm detalhado
- `types.json` — Array de tipos com nomes traduzidos
- `games.json` — Array de jogos com geracoes e version groups
- `generations.json` — Array de geracoes com metadata
- `evolution-chains.json` — Map de chainId para array de Pokemon IDs

**Razao:** Permite lazy loading por feature. A pagina de stats nao precisa carregar evolution-chains; a pagina de boxes nao precisa de types detalhados.

## Risks / Trade-offs

**[PokeAPI pode estar offline ou lenta]** → Cache local mitiga para development. Para CI/CD, os JSONs gerados devem ser commitados ou cached no CI. O script deve ter retry com backoff exponencial (3 tentativas).

**[Dados hardcoded para ultra-beasts/paradox ficam desatualizados com novas geracoes]** → Manter listas em arquivo separado (`src/scripts/pokemon-categories.ts`) para facil atualizacao. Adicionar log warning quando um Pokemon nao tem categoria atribuida.

**[~5-10MB de JSON no repositorio pode ser grande]** → Os JSONs nao serao commitados (`.gitignore`). Serao gerados no build ou cacheados no CI. Para dev, o cache local evita regeneracao.

**[Nomes em PT-BR podem nao existir para todos os Pokemon na PokeAPI]** → Fallback para nome em EN quando PT-BR nao disponivel. Log warning para nomes faltantes.
