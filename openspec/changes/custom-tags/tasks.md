## 1. Types and Data Model

- [ ] 1.1 Create `src/types/tags.ts` with `Tag` interface (`id`, `name`, `color`, `createdAt`)
- [ ] 1.2 Extend `BoxSlot` in `src/types/box.ts` with optional `tagIds?: string[]` field
- [ ] 1.3 Create `src/lib/tag-colors.ts` with `TAG_COLOR_PALETTE` constant (≥12 hex colors)

## 2. Tags Store

- [ ] 2.1 Create `src/stores/useTagsStore.ts` with `tags` array, `createTag`, `updateTag`, `deleteTag` actions
- [ ] 2.2 Wire `deleteTag` to call `useBoxStore.getState().purgeTagId(id)` after removing the tag
- [ ] 2.3 Persist `useTagsStore` to IndexedDB using `createPersistedStore` with store name `"tags"` and version `1`

## 3. Box Store Extensions

- [ ] 3.1 Add `addTagToSlot(boxId, slotIndex, tagId)` action to `useBoxStore` (no-op on null slot, no duplicates)
- [ ] 3.2 Add `removeTagFromSlot(boxId, slotIndex, tagId)` action to `useBoxStore`
- [ ] 3.3 Add `purgeTagId(tagId)` action to `useBoxStore` (removes tagId from all slots in all boxes)
- [ ] 3.4 Verify `moveSlot` preserves `tagIds` on the moved slot (adjust if needed)

## 4. Tag UI Components

- [ ] 4.1 Create `src/components/tags/TagDot.tsx` — 8px colored circle with `aria-label` from tag name
- [ ] 4.2 Create `src/components/tags/TagDotGroup.tsx` — renders up to 3 `TagDot`s plus `+N` overflow label
- [ ] 4.3 Create `src/components/tags/TagColorSwatch.tsx` — clickable color swatch for palette picker
- [ ] 4.4 Create `src/components/tags/TagManagerModal.tsx` — list existing tags, create/edit/delete, color picker via swatches
- [ ] 4.5 Create `src/components/tags/TagAssignmentPanel.tsx` — checklist of all tags for toggling on a given slot
- [ ] 4.6 Create `src/components/tags/TagFilterPanel.tsx` — row of toggleable tag filter chips; hidden when no tags exist
- [ ] 4.7 Add i18n translation keys for all tag UI strings in PT-BR and EN locale files

## 5. BoxSlotCell Integration

- [ ] 5.1 Add optional `tags?: Tag[]` prop to `BoxSlotCell`
- [ ] 5.2 Render `TagDotGroup` in the bottom-left corner of `BoxSlotCell` when `tags` is non-empty
- [ ] 5.3 Update the slot tooltip to include tag names alongside the Pokémon name

## 6. Tag Assignment on Slot

- [ ] 6.1 Add a "Tags" action entry to the slot context menu / slot action panel
- [ ] 6.2 On click, open `TagAssignmentPanel` for the target slot
- [ ] 6.3 Wire checkbox toggles to `addTagToSlot` / `removeTagFromSlot` in `useBoxStore`
- [ ] 6.4 Show "No tags yet — create tags first" empty state with link to `TagManagerModal` when no tags exist

## 7. Screen Integration — Boxes

- [ ] 7.1 Pass resolved `Tag[]` objects to each `BoxSlotCell` based on slot's `tagIds` and `useTagsStore`
- [ ] 7.2 Add `TagFilterPanel` to the Boxes screen toolbar
- [ ] 7.3 Implement slot filtering/dimming logic: when tags selected, dim slots without matching tags

## 8. Screen Integration — Missing Pokémon

- [ ] 8.1 Add `TagFilterPanel` to the Missing Pokémon screen
- [ ] 8.2 Filter the missing list to entries where at least one slot carries a selected tag

## 9. Screen Integration — Pokédex

- [ ] 9.1 Add `TagFilterPanel` to the Pokédex screen
- [ ] 9.2 Filter Pokédex entries to those where at least one slot carries a selected tag

## 10. Tag Manager Access

- [ ] 10.1 Add a "Manage Tags" entry to the sidebar or settings area to open `TagManagerModal`
- [ ] 10.2 Ensure the modal is accessible via keyboard and screen reader
