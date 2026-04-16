## Modelo de Dados

### Antes
```
BoxStore.slot.shiny: boolean        → controla sprite
PokedexStore.registeredShiny: []    → controla stats + ícone ✨
```

### Depois
```
BoxStore.slot.shiny: boolean        → controla sprite + ícone ✨ + stats (deduplicado)
PokedexStore.registeredShiny        → REMOVIDO
```

## Fluxo do botão ✨ na Box (Registration Mode)

```
Usuário clica ✨ no slot
        │
        ▼
handleShinyToggle(boxId, slotIndex, slot)   ← já existe, já auto-registra
        │
        ├─ se !slot.shiny && !isRegistered → toggleRegistered()
        └─ toggleShiny(boxId, slotIndex)   ← inverte slot.shiny
```

O `onShinyRegistrationToggle` em BoxGrid passa a chamar `handleShinyToggle` (via page.tsx) em vez de `toggleShinyRegistered`.

## Estatísticas de Shiny

```typescript
// Antes: registeredShinySet.has(key)

// Depois: varrer todos os slots
function computeShinyKeys(boxes: Box[]): Set<string> {
  const keys = new Set<string>()
  for (const box of boxes) {
    for (const slot of box.slots) {
      if (!slot?.shiny) continue
      const key = slot.formId ? `${slot.pokemonId}:${slot.formId}` : `${slot.pokemonId}`
      keys.add(key)   // Set garante deduplicação automática
    }
  }
  return keys
}
```

## PokemonCard — ícone shiny no Pokédex

```typescript
// Antes: isShinyRegistered(pokemonId, formId) — consulta PokedexStore
// Depois: shinyBoxKeys.has(key) — derivado dos boxes no PokemonCard
```

O `PokemonCard` recebe um `shinyBoxKeys: Set<string>` ou passa a usar um hook/selector derivado dos boxes.

## Migração de Dados

O campo `registeredShiny` no PokedexStore é removido. A migration no store é incrementada para version 3, descartando o campo na persistência existente (os dados ficam nos slots das boxes).

## O que NÃO muda

- `slot.shiny` já existe e já controla o sprite — sem mudança de schema
- `handleShinyToggle` em `boxes/page.tsx` já auto-registra — lógica permanece
- O botão ✨ continua visível apenas com `shinyTrackerEnabled = true`
