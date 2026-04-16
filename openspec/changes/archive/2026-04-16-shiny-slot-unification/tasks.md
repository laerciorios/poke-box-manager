## 1. PokedexStore — Remover registeredShiny

- [x] 1.1 Remover `registeredShiny`, `toggleShinyRegistered`, `isShinyRegistered`, `registerAllShiny`, `unregisterAllShiny` da interface e implementação do `usePokedexStore`
- [x] 1.2 Incrementar `version` para 3 e adicionar migration que descarta o campo `registeredShiny`

## 2. BoxGrid — Reconectar botão ✨ ao slot

- [x] 2.1 Remover a leitura de `registeredShiny` e `shinySet` do `BoxGrid` (linhas que usam `usePokedexStore registeredShiny`)
- [x] 2.2 Calcular `slotIsShiny` diretamente do `slot.shiny` em vez de `shinySet.has(key)`
- [x] 2.3 Alterar o `onShinyRegistrationToggle` para chamar `registrationMode.onShinyToggle` (que chama `handleShinyToggle` na page) em vez de `toggleShinyRegistered`
- [x] 2.4 Renomear a prop `isShinyRegistered` para `isShiny` em `BoxSlotCell` (e atualizar todos os usos)

## 3. BoxSlotCell — Atualizar prop name

- [x] 3.1 Renomear prop `isShinyRegistered` → `isShiny` na interface `BoxSlotCellProps`
- [x] 3.2 Atualizar todas as referências internas (`showShinyRegistered`, `showShinyRegisteredNonSortable`)

## 4. useStatsData — Derivar shiny dos slots

- [x] 4.1 Remover a leitura de `registeredShiny` do `usePokedexStore` em `useStatsData`
- [x] 4.2 Adicionar `computeShinyKeys(boxes)` que retorna `Set<string>` com chaves únicas de slots onde `shiny=true`
- [x] 4.3 Substituir `registeredShinySet.has(key)` por `shinyBoxKeys.has(key)` no loop de cálculo

## 5. ShinyTrackerPanel — Atualizar contagem

- [x] 5.1 Substituir `registeredShiny.length` pela contagem derivada dos boxes (`computeShinyKeys(boxes).size`)

## 6. PokemonCard — Atualizar ícone shiny

- [x] 6.1 Substituir `isShinyRegistered(pokemonId, formId)` por consulta derivada dos boxes (passar `shinyBoxKeys: Set<string>` como prop ou usar um selector)

## 7. Import — Atualizar importação de dados

- [x] 7.1 Em `src/lib/import/import.ts`, remover o campo `registeredShiny: []` do setState do PokedexStore

## 8. Limpeza de i18n

- [x] 8.1 Remover a chave `registeredShiny` de `en.json` e `pt-BR.json` se não for mais usada em nenhum componente
