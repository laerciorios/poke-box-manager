## 1. Presets Page Shell

- [x] 1.1 Create `src/components/presets/index.ts` — barrel export for all preset components
- [x] 1.2 Update `src/app/presets/page.tsx` to be a `'use client'` page that renders `PresetList` with a "New Preset" button

## 2. Preset List

- [x] 2.1 Create `src/components/presets/PresetList.tsx` — renders two sections: "Built-in Presets" grid (from `BUILTIN_PRESETS`) and "My Presets" grid (from `usePresetsStore`)
- [x] 2.2 Render built-in preset cards with name, description, and two actions: "Customize" (opens editor pre-filled) and "Duplicate"
- [x] 2.3 Render custom preset cards with name, description, and three actions: "Edit", "Duplicate", "Delete"
- [x] 2.4 Implement empty state for "My Presets" section when no custom presets exist
- [x] 2.5 Wire "Duplicate" to `usePresetsStore.duplicatePreset` for both built-in and custom cards
- [x] 2.6 Wire "Delete" to `usePresetsStore.deletePreset` behind a `window.confirm` confirmation

## 3. RuleRow Component

- [x] 3.1 Create `src/components/presets/RuleRow.tsx` — accepts a `PresetRule` + index + callbacks (onChange, onMoveUp, onMoveDown, onDelete), renders all rule controls
- [x] 3.2 Add "Match remaining" toggle (checkbox): when checked, disables all filter checkboxes and sets `filter` to `{}`
- [x] 3.3 Add category filter checkboxes: normal, legendary, mythical, baby, ultra-beast, paradox — maps to `filter.categories`
- [x] 3.4 Add generation filter checkboxes: 1–9 — maps to `filter.generations`
- [x] 3.5 Add type filter checkboxes (all 18 in canonical order) — maps to `filter.types`
- [x] 3.6 Add sort criteria Select with options: dex-number, name, type-primary, generation, evolution-chain, regional-dex — maps to `rule.sort`
- [x] 3.7 Add box name template text input with a hint tooltip showing available variables: `{n}`, `{total}`, `{start}`, `{end}`, `{gen}`, `{type}`, `{region}` — maps to `rule.boxNameTemplate`
- [x] 3.8 Add ↑/↓ buttons (disabled at top/bottom respectively) and × delete button (disabled when only 1 rule)

## 4. PresetPreview Component

- [x] 4.1 Create `src/components/presets/PresetPreview.tsx` — accepts a `PresetRule[]` and a name, imports `pokemon.json` and `evolution-chains.json` statically, runs `applyPreset` on click, renders results
- [x] 4.2 Render a scrollable grid of box summary cards: box name + filled slot count (e.g., "18/30")
- [x] 4.3 Render a summary line: total box count and total Pokémon placed
- [x] 4.4 Show "Add at least one rule to see a preview" when rules array is empty
- [x] 4.5 Expose a "Preview" button that triggers the computation (not live — on click only)

## 5. PresetEditor Dialog

- [x] 5.1 Create `src/components/presets/PresetEditor.tsx` — a controlled Dialog component accepting `open`, `onClose`, and optional `initialPreset: OrganizationPreset` props
- [x] 5.2 Add preset name text input (required, max 60 chars) with validation — disables Save when empty
- [x] 5.3 Add "Start from built-in" Select listing all 8 `BUILTIN_PRESETS`; on select, populate the rules array with a deep copy of that preset's rules (confirm if existing rules present)
- [x] 5.4 Render a list of `RuleRow` components driven by local editor state (array of `PresetRule`)
- [x] 5.5 Add "Add Rule" button that appends a new empty rule: `{ order: 0, filter: {}, sort: 'dex-number', boxNameTemplate: '' }`
- [x] 5.6 Implement rule reorder handlers (swap adjacent rules in state array) wired to RuleRow ↑/↓ callbacks
- [x] 5.7 Integrate `PresetPreview` — show it below the rules list when preview has been triggered
- [x] 5.8 Wire "Save" button: on click, assign `order` values (1-based index), call `createPreset` for new or `updatePreset` for existing, then close
- [x] 5.9 Wire "Cancel" button: close dialog without saving (confirm if editor is dirty)

## 6. Wire Editor into Preset List

- [x] 6.1 Add `PresetEditor` to `PresetList` (or the page), controlled by `editorOpen` + `editingPreset` state
- [x] 6.2 "New Preset" button: open editor with no `initialPreset`
- [x] 6.3 "Edit" on custom card: open editor with that preset as `initialPreset`
- [x] 6.4 "Customize" on built-in card: open editor with the built-in preset as `initialPreset`, name suffixed with " (Custom)", `isBuiltIn` forced to `false`

## 7. Verification

- [x] 7.1 Verify TypeScript compilation passes with `tsc --noEmit`
- [x] 7.2 Manually verify: create a preset from scratch, preview, save — preset appears in list
- [x] 7.3 Manually verify: customize a built-in preset, modify one rule, save — custom version appears separately from built-in
