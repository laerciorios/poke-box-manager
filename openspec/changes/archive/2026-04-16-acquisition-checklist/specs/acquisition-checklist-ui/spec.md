## ADDED Requirements

### Requirement: Step label derivation function
The system SHALL provide a pure function `getStepLabel(method: EvolutionMethod, locale: 'pt-BR' | 'en'): string` in `src/lib/evolution-step-labels.ts` that maps an `EvolutionMethod` to a human-readable string in the given locale.

The function SHALL produce labels for at minimum the following cases:
- `trigger: "trade"` + `heldItem` → "Trade holding {item}" / "Troca segurando {item}"
- `trigger: "trade"` (no conditions) → "Trade" / "Troca"
- `trigger: "trade"` + `tradeSpeciesId` → "Trade with {species}" / "Troca com {species}"
- `trigger: "use-item"` + `item` → "Use {item}" / "Usar {item}"
- `trigger: "level-up"` + `minLevel` → "Level {n}" / "Nível {n}"
- `trigger: "level-up"` + `happiness` → "High friendship" / "Alta amizade"
- `trigger: "level-up"` + `location` → "Level up at {location}" / "Subir nível em {location}"
- `trigger: "level-up"` + `timeOfDay: "day"` → "Level up during the day" / "Subir nível de dia"
- `trigger: "level-up"` + `timeOfDay: "night"` → "Level up at night" / "Subir nível à noite"
- `trigger: "level-up"` + `knownMove` → "Level up knowing {move}" / "Subir nível sabendo {move}"
- `trigger: "level-up"` + `needsRain` → "Level up in the rain" / "Subir nível na chuva"
- `trigger: "level-up"` + `turnUpsideDown` → "Hold console upside down" / "Segurar console de cabeça para baixo"
- `trigger: "other"` → "Special method" / "Método especial"

#### Scenario: Label for trade with held item (EN)
- **WHEN** `getStepLabel({ trigger: "trade", heldItem: "metal-coat" }, "en")` is called
- **THEN** it SHALL return a string containing "Metal Coat" and "Trade"

#### Scenario: Label for trade with held item (PT-BR)
- **WHEN** `getStepLabel({ trigger: "trade", heldItem: "metal-coat" }, "pt-BR")` is called
- **THEN** it SHALL return a string in Portuguese referencing the item

#### Scenario: Unknown trigger falls back gracefully
- **WHEN** `getStepLabel` is called with a trigger not in the known list
- **THEN** it SHALL return a non-empty fallback string without throwing

### Requirement: Trivial evolution step detection
The system SHALL export a pure function `isTrivialStep(method: EvolutionMethod): boolean` from `src/lib/evolution-step-labels.ts` that returns `true` if the step requires no user action beyond levelling up (i.e., `trigger === "level-up"` with only `minLevel` set and no other conditions).

#### Scenario: Level-up with only minLevel is trivial
- **WHEN** `isTrivialStep({ trigger: "level-up", minLevel: 16 })` is called
- **THEN** it SHALL return `true`

#### Scenario: Level-up with location is non-trivial
- **WHEN** `isTrivialStep({ trigger: "level-up", location: "mt-coronet" })` is called
- **THEN** it SHALL return `false`

#### Scenario: Trade is always non-trivial
- **WHEN** `isTrivialStep({ trigger: "trade" })` is called
- **THEN** it SHALL return `false`

### Requirement: AcquisitionChecklist component
The system SHALL provide an `AcquisitionChecklist` component at `src/components/pokemon/AcquisitionChecklist.tsx` that accepts `pokemonId: number` and renders a list of checkable acquisition steps derived from the Pokémon's evolution chain.

The component SHALL:
- Look up the Pokémon's `evolutionChainId` from `pokemon.json`
- Load the chain's `steps` from `evolution-chains.json`
- Filter steps to those where `toId === pokemonId`
- Exclude trivial steps (using `isTrivialStep`)
- Render nothing if all steps are trivial or if there are no relevant steps
- For each non-trivial step, render a checkbox + step label and an arrow + target Pokémon name

#### Scenario: Checklist shown for trade evolution
- **WHEN** `AcquisitionChecklist` is rendered for Scizor (Pokémon ID 212)
- **THEN** the component SHALL render at least one step containing "Metal Coat" (or equivalent)

#### Scenario: Checklist hidden for simple level-up evolution
- **WHEN** `AcquisitionChecklist` is rendered for Charmeleon (ID 5) — level-up only
- **THEN** no checklist section SHALL be rendered

#### Scenario: Checkbox toggles step state
- **WHEN** the user checks a step checkbox
- **THEN** `useAcquisitionStore.toggleStep(pokemonId, stepIndex)` SHALL be called
- **THEN** the checkbox SHALL render in a checked state

#### Scenario: Checked state restored from store
- **WHEN** `AcquisitionChecklist` is rendered for a Pokémon with previously checked steps
- **THEN** the corresponding checkboxes SHALL be pre-checked

#### Scenario: Clear button resets all steps
- **WHEN** the user activates the "Clear" control (if any steps are checked)
- **THEN** `useAcquisitionStore.clearChecklist(pokemonId)` SHALL be called
- **THEN** all checkboxes SHALL render unchecked
