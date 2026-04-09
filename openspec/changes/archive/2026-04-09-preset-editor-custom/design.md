## Context

The preset infrastructure is complete: `OrganizationPreset` / `PresetRule` types, `applyPreset` engine, `BUILTIN_PRESETS`, and `usePresetsStore` (createPreset, updatePreset, deletePreset, duplicatePreset). The `/presets` page is a placeholder. The UI stack is shadcn/ui built on `@base-ui/react`, so Dialog and Select use base-ui primitives. All filter/sort options map directly to the existing `PokemonFilter` and `SortCriteria` types.

## Goals / Non-Goals

**Goals:**
- Build the `/presets` page listing built-in presets (read-only) and custom presets (editable)
- Build a `PresetEditor` dialog for creating/editing custom presets with per-rule controls
- Build a `PresetPreview` panel that runs `applyPreset` client-side and renders box summary
- Wire Save/Delete/Duplicate actions to `usePresetsStore`

**Non-Goals:**
- Actually applying the preset to the user's boxes (that wires to `useBoxStore.setBoxes` — a separate action/page concern)
- Drag-and-drop rule reordering (rules are reordered via up/down buttons; DnD is a later enhancement)
- i18n of user-entered preset names (stored as plain strings; only the UI labels are in the locale)
- Undo/redo for editor state

## Decisions

### 1. `/presets` page as the management hub

**Choice**: The `/presets` page renders a `PresetList` showing two sections — "Built-in Presets" and "My Presets" — with a top-level "New Preset" button. Editing opens a `PresetEditor` dialog over the same page.

**Why**: A dialog-per-preset is simpler than a separate `/presets/[id]` route. It avoids a full-page transition for what is essentially a form. The spec mockup shows the editor as a panel, not a separate route.

**Alternative considered**: Dedicated `/presets/new` and `/presets/[id]/edit` routes — rejected because it adds routing complexity for a form that fits comfortably in a Dialog.

### 2. Filter controls per rule

**Choice**: Each rule's filter UI offers three independent multiselect groups:
- **Category** (checkboxes): normal, legendary, mythical, baby, ultra-beast, paradox
- **Generation** (checkboxes 1–9): checked = included
- **Type** (checkboxes, canonical order): checked = included
- Leaving all checkboxes unchecked in a group = that field is `undefined` (no filter on that dimension)

**Why**: Multiselect checkboxes are simpler than a custom tag input and map 1:1 to `PokemonFilter.categories`, `.generations`, `.types`. The filter AND logic is already implemented in the engine.

**"Remaining" shortcut**: A "Match remaining" toggle sets the filter to `{}` (empty = catch-all), making it easy to define a catch-all rule without checking every option.

### 3. Rule order via up/down buttons

**Choice**: Each rule has ↑/↓ buttons to reorder. Order is stored as the index in the rules array; `PresetRule.order` is assigned as `index + 1` on save.

**Why**: Drag-and-drop requires @dnd-kit integration scoped to this form, which adds complexity. Up/down buttons are accessible, simple, and sufficient for a typical preset (2–4 rules).

### 4. Preview runs applyPreset client-side

**Choice**: The `PresetPreview` component accepts the current editor state as an `OrganizationPreset`, imports `pokemon.json` and `evolution-chains.json` as static JSON, and runs `applyPreset` synchronously. It renders a scrollable grid of boxes showing name + filled/empty slot count.

**Why**: The data is available client-side as static JSON (no fetch needed). `applyPreset` is a pure function with no side effects. Preview is triggered by a "Preview" button, not live-updated on every keystroke (which would be too expensive for 1025 Pokémon).

**Preview format**:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Legendaries 1│ │ Legendaries 2│ │ Mythicals 1  │
│ ███░░░░░░░░░ │ │ ████░░░░░░░ │ │ ███░░░░░░░░░ │
│ 18/30        │ │ 12/30        │ │ 21/30        │
└──────────────┘ ...
```

### 5. Base preset seeding

**Choice**: A "Start from built-in" Select at the top of the editor populates the rules array with a copy of the selected built-in preset's rules. Changing the selection replaces all rules (with a confirmation if rules already exist). When creating from scratch, the editor starts with one empty rule.

**Why**: This fulfills the spec's "Customize from a preset" flow without storing the base reference. The result is always a standalone `OrganizationPreset` — no inheritance chain to manage.

## Risks / Trade-offs

**[Risk] Preview is slow for complex presets** → `applyPreset` on 1025 Pokémon is fast (~1ms), but importing `pokemon.json` (877KB) adds initial parse time. The static JSON is parsed once and cached by the module bundler. Mitigation: show a loading state while the JSON module resolves.

**[Risk] "Match remaining" rule with no other rules** → Results in one rule that matches everything, equivalent to National Dex Order. Valid but potentially confusing. Mitigation: show a hint when only one rule exists.

**[Trade-off] No live preview on every keystroke** → Preview is manual (button click). This avoids expensive re-runs on every filter checkbox toggle. Acceptable since the preview is for validation, not real-time feedback.
