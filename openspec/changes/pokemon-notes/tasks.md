## 1. Type and Store Changes

- [ ] 1.1 Add `note?: string` to the `BoxSlot` interface in `src/types/box.ts`
- [ ] 1.2 Add `setSlotNote(boxId: string, slotIndex: number, note: string): void` action to `useBoxStore` — trim input, cap at 500 chars, set `undefined` if empty, no-op on null slot
- [ ] 1.3 Bump the `useBoxStore` persisted schema version from `1` to `2`; add a v1→v2 migration function that is a no-op (existing slots have no `note` — `undefined` is the correct default)
- [ ] 1.4 Verify that existing unit tests / integration tests for `useBoxStore` still pass after the schema bump

## 2. i18n Strings

- [ ] 2.1 Add note-related strings to `src/i18n/messages/en.json` under a `notes` namespace: `placeholder` ("Add a note…"), `label` ("Note"), `clearLabel` ("Clear note")
- [ ] 2.2 Add the same strings to `src/i18n/messages/pt-BR.json`: `placeholder` ("Adicionar uma nota…"), `label` ("Nota"), `clearLabel` ("Limpar nota")

## 3. BoxSlotCell — Note Indicator

- [ ] 3.1 Import a suitable icon (e.g., `PencilLine` or `FileText` from `lucide-react`) for the note indicator
- [ ] 3.2 Add a conditional note indicator to `BoxSlotCell`: render the icon when `slot?.note` is a non-empty string, positioned in the bottom-left corner (or another corner not occupied by existing indicators)
- [ ] 3.3 Set `aria-hidden="true"` on the indicator icon element
- [ ] 3.4 Ensure the indicator does not overflow the slot cell bounds and does not obscure the sprite

## 4. PokemonCard — Note Editor

- [ ] 4.1 Add optional `boxId?: string` and `slotIndex?: number` props to `PokemonCard` (or its caller/trigger site)
- [ ] 4.2 Inside `PokemonCard`, derive the current `note` value by reading `useBoxStore` at `(boxId, slotIndex)` when both props are present
- [ ] 4.3 Add a controlled `<Textarea>` (shadcn/ui) with `maxLength={500}`, the localized placeholder, and local state initialized from the current note
- [ ] 4.4 Implement `onBlur` handler: if the current textarea value differs from the stored note, call `setSlotNote(boxId, slotIndex, value)`
- [ ] 4.5 Guard the entire note section: render it only when both `boxId` and `slotIndex` are defined
- [ ] 4.6 Add a visible character count display (e.g., `"42 / 500"`) below the textarea

## 5. Wiring — Open PokemonCard with Slot Context

- [ ] 5.1 Identify the call site(s) where `PokemonCard` is opened from a `BoxSlotCell` interaction
- [ ] 5.2 Pass `boxId` and `slotIndex` through to `PokemonCard` at those call sites
- [ ] 5.3 Verify that `PokemonCard` opened from the Pokédex page (no slot context) does NOT render the note section

## 6. Verification

- [ ] 6.1 Manually test: add a note to a slot, reload the page, confirm the note persists and the indicator appears
- [ ] 6.2 Manually test: move a Pokémon with a note to another slot; confirm the note travels with it
- [ ] 6.3 Manually test: clear a slot that has a note; confirm the note is gone
- [ ] 6.4 Manually test: open PokemonCard from the Pokédex — confirm no note textarea is shown
- [ ] 6.5 Manually test: paste 600 characters into the textarea — confirm it caps at 500
