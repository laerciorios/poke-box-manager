## 1. Lookup Helpers

- [ ] 1.1 Create `src/lib/pokemon-lookup.ts` with `getPokemonById(id: number): PokemonEntry | undefined` using static `pokemon.json` import
- [ ] 1.2 Add `getEvolutionChain(chainId: number): EvolutionChain | undefined` to `pokemon-lookup.ts` using `evolution-chains.json`

## 2. PokemonCard Component

- [ ] 2.1 Create `src/components/pokemon/PokemonCard.tsx` accepting `pokemonId: number`, `isOpen: boolean`, `onClose: () => void`
- [ ] 2.2 Implement core identity section: localized name, `#<id>` number, type badges (colored by type), generation, category label
- [ ] 2.3 Implement sprite display using `SpritePlaceholder` with shiny toggle button; disable toggle when `spriteShiny` is absent
- [ ] 2.4 Implement form switcher: render form selector when `forms.length > 0`; selecting a form updates sprite, types, and name in local state
- [ ] 2.5 Implement evolution chain section: look up chain via `getEvolutionChain(evolutionChainId)`; render each Pokémon in `pokemonIds` order with sprite and localized name; skip section if no `evolutionChainId`
- [ ] 2.6 Wrap all content in shadcn/ui `Sheet` (slide from right); close on Escape or outside click via `onClose`

## 3. PokemonTooltip Component

- [ ] 3.1 Create `src/components/pokemon/PokemonTooltip.tsx` accepting `pokemonId: number | null | undefined` and `children: ReactNode`
- [ ] 3.2 Implement hover preview using shadcn/ui `HoverCard` showing sprite, localized name, `#<id>`, and type badges; render children as `HoverCardTrigger`
- [ ] 3.3 Wire click on the trigger to open `PokemonCard` (local `isOpen` state + `PokemonCard` instance inside `PokemonTooltip`)
- [ ] 3.4 When `pokemonId` is null/undefined, render children directly with no tooltip wrapping

## 4. i18n Strings

- [ ] 4.1 Add translation keys for card labels (`pokemon.generation`, `pokemon.category`, `pokemon.forms`, `pokemon.evolution`, `pokemon.shiny`) to `src/i18n/messages/pt-BR.json` and `en.json`

## 5. Barrel Export & Integration

- [ ] 5.1 Export `PokemonCard` and `PokemonTooltip` from `src/components/pokemon/index.ts`
- [ ] 5.2 Wrap `BoxSlot` content with `PokemonTooltip` when the slot is occupied (pass slot's `pokemonId`)
