## Why

O sistema de shiny tem dois conceitos desconectados: `slot.shiny` (BoxStore, por slot) e `registeredShiny` (PokedexStore, por espécie). Isso causa dois bugs:

1. Ao clicar no botão ✨ na box, o sprite não muda para shiny — porque o botão alterava apenas `registeredShiny` no Pokédex, não o `slot.shiny` que controla o sprite
2. Ao marcar um pokémon como shiny registrado, ele não era automaticamente registrado no Pokédex

Além disso, a futura funcionalidade de múltiplos exemplares do mesmo pokémon em boxes diferentes exige que shiny seja por slot, e que as estatísticas dedupliquem (2x shiny Pikachu = 1 shiny registrado nas stats).

## What Changes

- **`slot.shiny` como fonte de verdade**: o campo `shiny` no slot da box é a única fonte de verdade para shiny
- **Remoção de `registeredShiny`** do PokedexStore — torna-se redundante
- **Estatísticas derivadas dos slots**: shiny count nas stats passa a varrer todos os slots e contar chaves únicas com `shiny=true`
- **Auto-registro ao marcar shiny**: ao marcar um slot como shiny, o pokémon é automaticamente registrado no Pokédex se ainda não estiver
- **PokemonCard**: mostra ícone shiny se qualquer slot da box tiver `shiny=true` para aquela espécie/forma

## Capabilities

### Changed Capabilities

- `shiny-tracking`: Unificado em `slot.shiny` — remoção do estado paralelo `registeredShiny` no PokedexStore
- `registration-stats`: Shiny count agora derivado dos slots (deduplicated), não do array `registeredShiny`
