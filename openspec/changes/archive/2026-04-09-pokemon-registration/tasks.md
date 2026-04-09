## 1. Registration Mode Hook

- [x] 1.1 Create `src/hooks/useRegistrationMode.ts` with state: `isActive`, `selectedKeys: Set<string>`, `lastClickedKey`, and actions: `toggleMode`, `clearSelection`, `handleSlotClick(boxId, slotIndex, event, slot)`
- [x] 1.2 Implement single-click registration toggle — calls `usePokedexStore.toggleRegistered` when no modifier keys are held and the slot is non-null
- [x] 1.3 Implement Ctrl/Cmd+Click multi-select — adds/removes `"boxId:slotIndex"` from `selectedKeys` without triggering registration
- [x] 1.4 Implement Shift+Click range selection — computes range from `lastClickedKey` anchor to target within the same box, adds all non-null slots in range to `selectedKeys`
- [x] 1.5 Implement `markSelected(registered: boolean)` — calls `usePokedexStore.registerAll` or `unregisterAll` with keys derived from `selectedKeys`, then clears selection

## 2. Registration Mode Toggle Button

- [x] 2.1 Create `src/components/boxes/RegistrationModeToggle.tsx` — a toggle button that receives `isActive` and `onToggle` props, styled distinctly when active
- [x] 2.2 Add i18n strings for "Registration Mode" label in `pt-BR` and `en` locale files

## 3. Floating Action Bar

- [x] 3.1 Create `src/components/boxes/FloatingActionBar.tsx` — renders when `selectedKeys.size > 0`, shows selected count, "Mark as registered" button, and "Unmark" button
- [x] 3.2 Wire "Mark as registered" to call `markSelected(true)` from the registration mode hook
- [x] 3.3 Wire "Unmark" to call `markSelected(false)` from the registration mode hook
- [x] 3.4 Add i18n strings for the floating bar labels in `pt-BR` and `en`

## 4. BoxGrid Integration

- [x] 4.1 Update `src/components/boxes/BoxGrid.tsx` to accept `registrationMode` state (or use the hook directly) and pass `isRegistered(slot.pokemonId, slot.formId)` to each `BoxSlotCell` at render time
- [x] 4.2 Pass `selected` and `onClick` (wired to `handleSlotClick`) props from `BoxGrid` down to each `BoxSlotCell`
- [x] 4.3 Render `RegistrationModeToggle` and `FloatingActionBar` within or alongside `BoxGrid`
- [x] 4.4 Verify the box view header shows the toggle and the grid responds correctly to all click modes in the dev server

## 5. Preset Engine

- [x] 5.1 Create `src/lib/preset-engine.ts` with the `applyPreset(preset, allPokemon, allForms, variations, registeredKeys)` pure function signature
- [x] 5.2 Implement rule filtering — for each rule in order, apply `PokemonFilter` (categories, generations, types, formTypes, exclusions) against the remaining pool
- [x] 5.3 Implement rule sorting — sort the filtered pool by `PresetRule.sort` criteria (`dex-number`, `name`, `type-primary`, `generation`, `evolution-chain`)
- [x] 5.4 Implement box packing — split sorted pool into `Box` objects of 30 slots each, filling `BoxSlot.registered` from `registeredKeys`
- [x] 5.5 Implement box name template substitution — replace `{n}`, `{start}`, `{end}`, `{gen}` variables; fall back to `"Box {n}"` when no template is set
- [x] 5.6 Implement variation filtering — before rule processing, expand or restrict the Pokémon pool based on `VariationToggles` (include forms only for enabled toggle keys using `TOGGLE_FORM_TYPES` from the variation-counts utility)

## 6. Auto-fill UI

- [x] 6.1 Create `src/components/boxes/AutoFillButton.tsx` with a preset `Select` dropdown (populated from `usePresetsStore.presets`) and an "Auto-fill" button
- [x] 6.2 Implement the confirmation `AlertDialog` — show when `useBoxStore.boxes` has at least one non-null slot; wire Confirm to call `applyPreset` + `setBoxes`, Cancel to dismiss
- [x] 6.3 On confirm, read `usePokedexStore.registered` (as a `Set<string>`), `useSettingsStore.variations`, and the selected preset, call `applyPreset`, and commit via `useBoxStore.setBoxes`
- [x] 6.4 Add i18n strings for auto-fill UI labels and confirmation dialog text in `pt-BR` and `en`
- [x] 6.5 Integrate `AutoFillButton` into the box view header alongside `RegistrationModeToggle`
