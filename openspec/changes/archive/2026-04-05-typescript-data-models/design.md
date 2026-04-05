## Context

O projeto ja tem tipos para dados de Pokemon (`src/types/pokemon.ts`, `src/types/game.ts`, `src/types/locale.ts`) criados pelo pipeline de dados. Agora precisamos dos tipos de dominio da aplicacao: boxes, presets de organizacao, e configuracoes do usuario. Esses tipos sao definidos na spec secoes 2.3 e 2.4 e serao usados pelos Zustand stores e componentes.

## Goals / Non-Goals

**Goals:**
- Definir todos os tipos de dominio restantes da spec (Box, BoxSlot, Preset, Settings)
- Manter consistencia com os tipos existentes (usar Locale, FormType, PokemonCategory dos arquivos existentes)
- Criar barrel export (`src/types/index.ts`) para imports limpos
- Adicionar tipo `GameId` como string (usado em SettingsState.activeGames e PokemonEntry.gameAvailability)

**Non-Goals:**
- Implementar Zustand stores (change separado)
- Implementar logica de negocio (organizer, calculator, etc.)
- Modificar os tipos existentes de PokemonEntry/PokemonForm (ja estao corretos)
- Criar runtime validation (tipos sao apenas compile-time)

## Decisions

### 1. GameId como string (nao enum)

**Escolha:** `type GameId = string` em vez de um enum com todos os jogos.
**Razao:** Os IDs dos jogos vem da PokeAPI como strings ("red", "blue", "scarlet", etc.). Enumerar todos ~48 jogos seria fragil e dificil de manter. O tipo string com alias semantico (`GameId`) e suficiente para documentacao e type-safety basico.

### 2. SpriteStyle como union type

**Escolha:** `type SpriteStyle = 'home-3d' | 'pixel-gen5' | 'pixel-gen8' | 'official-art'`
**Razao:** Conjunto fixo e pequeno de opcoes definido na spec. Union type e mais seguro que string e nao requer import de enum.

### 3. VariationToggles como interface separada

**Escolha:** Extrair os toggles de variacao de `SettingsState` para uma interface `VariationToggles` propria.
**Razao:** Os toggles sao usados em multiplos contextos (settings page, filtros de pokedex, calculo de progresso). Interface separada permite reuso sem depender da interface completa de settings.

### 4. Barrel export com re-exports

**Escolha:** `src/types/index.ts` com `export * from './pokemon'`, etc.
**Razao:** Permite `import { Box, PokemonEntry } from '@/types'` em vez de imports individuais por arquivo. Padrao comum em projetos TypeScript.

## Risks / Trade-offs

**[Tipos podem divergir da PokeAPI data real]** → Os tipos existentes de PokemonEntry ja foram validados contra dados reais (1025 Pokemon). Os novos tipos (Box, Settings) sao de dominio local e nao tem dependencia externa.

**[SettingsState pode crescer com features futuras]** → Manter a interface modular (VariationToggles separado) facilita extensao sem breaking changes.
