## Why

The preset engine and all 8 built-in presets are implemented, but users have no UI to create their own organization layouts or customize existing ones. The `/presets` page is a placeholder. Without the editor, the app locks users into the built-in options — the entire custom preset workflow from spec section 3.2.2 is missing.

## What Changes

- Build out the `/presets` page as the preset management hub: list of built-in + custom presets with apply, duplicate, and delete actions
- Create a `PresetEditor` component (rendered as a Dialog) for creating presets from scratch or customizing a built-in preset as a base
- Each rule in the editor exposes: filter controls (category multiselect, generation multiselect, type multiselect), sort criteria selector, and box name template input
- Add/remove rules with drag-to-reorder
- "Preview" mode: run `applyPreset` client-side with the static Pokémon data and render the resulting box names + slot count as a miniature grid before committing
- Wire the editor's Save to `usePresetsStore.createPreset` / `updatePreset`

## Capabilities

### New Capabilities
- `preset-editor`: Visual editor UI for creating and modifying custom `OrganizationPreset` objects — rule list with filter/sort/template controls, save/cancel flow, and integration with the presets store
- `preset-preview`: Client-side live preview that runs `applyPreset` on the current editor state and renders a summary grid of box names and Pokémon counts, shown before the user commits

### Modified Capabilities
- `project-foundation`: The `/presets` page changes from a placeholder to a functional feature page — layout and routing behavior is unchanged but the page now mounts client-side stores and static data

## Impact

- **Modified files**: `src/app/presets/page.tsx`
- **New files**: `src/components/presets/PresetList.tsx`, `src/components/presets/PresetEditor.tsx`, `src/components/presets/RuleRow.tsx`, `src/components/presets/PresetPreview.tsx`, `src/components/presets/index.ts`
- **Static data used at runtime**: `src/data/pokemon.json`, `src/data/evolution-chains.json` (imported in the page for preview)
- **Store**: `usePresetsStore` (already has createPreset, updatePreset, deletePreset, duplicatePreset — no store changes needed)
- **Engine**: `applyPreset`, `BUILTIN_PRESETS` (already built — consumed but not changed)
- **New shadcn/ui components needed**: `Dialog`, `Select` (already installed)
- **No new npm dependencies**
- **Relates to**: spec section 3.2.2 (preset configuration and editor)
