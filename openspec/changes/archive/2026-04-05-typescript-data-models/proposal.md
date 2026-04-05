## Why

O projeto ja possui tipos para dados de Pokemon (PokemonEntry, PokemonForm, GameEntry, etc.) criados no change `pokeapi-data-pipeline`. Porem, os tipos de dominio da aplicacao — boxes, slots, presets, filtros, ordenacao, e configuracoes do usuario — ainda nao existem. Esses sao os contratos de dados fundamentais usados por todas as features futuras (boxes, pokedex, stats, settings). Sem eles, nenhuma feature de negocio pode ser implementada com type-safety. Relaciona-se com as secoes 2.3 (tipos Box/BoxSlot/Preset) e 2.4 (SettingsState) da spec principal.

## What Changes

- Criar `src/types/box.ts` com interfaces Box e BoxSlot (grid 6x5, 30 slots)
- Criar `src/types/preset.ts` com interfaces OrganizationPreset, PresetRule, PokemonFilter, e SortCriteria
- Criar `src/types/settings.ts` com interface SettingsState (variacoes, geracoes, jogos, aparencia)
- Atualizar `src/types/game.ts` para adicionar tipo GameId (usado em SettingsState e PokemonEntry)
- Criar `src/types/index.ts` como barrel export para todos os tipos do projeto

## Capabilities

### New Capabilities

- `box-types`: Interfaces Box e BoxSlot que definem a estrutura de dados das boxes do Pokemon Home (grid 6x5)
- `preset-types`: Interfaces para o sistema de presets de organizacao (OrganizationPreset, PresetRule, PokemonFilter, SortCriteria)
- `settings-types`: Interface SettingsState com todas as configuracoes do usuario (variacoes, filtros, aparencia)

### Modified Capabilities
<!-- Nenhuma capability existente sendo modificada no nivel de spec -->

## Impact

- **Arquivos novos**: `src/types/box.ts`, `src/types/preset.ts`, `src/types/settings.ts`, `src/types/index.ts`
- **Arquivos modificados**: `src/types/game.ts` (adicionar GameId)
- **Dependencias**: Nenhuma nova dependencia
- **Nenhum breaking change** — tipos novos, nao modificam codigo existente
