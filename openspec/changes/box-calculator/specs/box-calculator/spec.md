## ADDED Requirements

### Requirement: computeBoxCount utility
The system SHALL export a `computeBoxCount(pokemonCount: number): { boxes: number; lastBoxSlots: number; emptySlots: number }` function from `src/lib/variation-counts.ts`.

- `boxes`: `Math.ceil(pokemonCount / BOX_SIZE)` — total boxes needed
- `lastBoxSlots`: `pokemonCount % BOX_SIZE` — slots used in the final box (0 when perfectly full)
- `emptySlots`: `BOX_SIZE - lastBoxSlots` when `lastBoxSlots > 0`, else `0`

#### Scenario: Exact multiple of BOX_SIZE
- **WHEN** `computeBoxCount(30)` is called
- **THEN** it SHALL return `{ boxes: 1, lastBoxSlots: 0, emptySlots: 0 }`

#### Scenario: Non-exact count rounds up
- **WHEN** `computeBoxCount(31)` is called
- **THEN** it SHALL return `{ boxes: 2, lastBoxSlots: 1, emptySlots: 29 }`

#### Scenario: Zero Pokémon
- **WHEN** `computeBoxCount(0)` is called
- **THEN** it SHALL return `{ boxes: 0, lastBoxSlots: 0, emptySlots: 0 }`

### Requirement: BoxCalculatorCard component
The system SHALL provide a `BoxCalculatorCard` component at `src/components/settings/BoxCalculatorCard.tsx` that reads `variations` and `activeGenerations` from `useSettingsStore`, computes the filtered Pokémon total and box count, and displays the result.

The card SHALL display:
- Primary text: "You need **X boxes**" where X is `computeBoxCount(total).boxes`
- Secondary text: "Y Pokémon / 30 per box" where Y is the filtered total
- Tertiary detail: "Last box: Z / 30 slots used" when the last box is not full (hidden when perfectly full)

#### Scenario: Card shows correct box count
- **WHEN** `computeFilteredTotal` returns `90` (exactly 3 full boxes)
- **THEN** the card SHALL display "3 boxes" and "90 Pokémon / 30 per box"
- **THEN** the last-box detail SHALL be hidden

#### Scenario: Card shows partial last box
- **WHEN** `computeFilteredTotal` returns `91`
- **THEN** the card SHALL display "4 boxes" and "91 Pokémon / 30 per box"
- **THEN** the card SHALL display "Last box: 1 / 30 slots used"

#### Scenario: Card updates when variation toggle changes
- **WHEN** the user enables a variation toggle in `VariationTogglesPanel`
- **THEN** the `BoxCalculatorCard` SHALL re-render with the updated count without a page reload

#### Scenario: Card updates when generation filter changes
- **WHEN** the user changes `activeGenerations` in settings
- **THEN** the `BoxCalculatorCard` SHALL re-render with the updated count

#### Scenario: Card handles all-generations default
- **WHEN** `activeGenerations` is `[1, 2, 3, 4, 5, 6, 7, 8, 9]` (the default)
- **THEN** the card SHALL display the count across all generations

### Requirement: BoxCalculatorCard is accessible and localised
The `BoxCalculatorCard` SHALL use localised strings for all user-facing text via the app's i18n system (both PT-BR and EN).

#### Scenario: Labels appear in user's locale
- **WHEN** the user's locale is `pt-BR`
- **THEN** all card labels SHALL be displayed in Portuguese

#### Scenario: Numeric values use locale-appropriate formatting
- **WHEN** the box or Pokémon count exceeds 999
- **THEN** numbers SHALL be formatted with locale-appropriate thousand separators
