## MODIFIED Requirements

### Requirement: Sprite lazy loading with placeholder transition
Pokémon sprites in `BoxSlotCell` SHALL lazy-load with a smooth transition from placeholder to actual sprite. Sprites SHALL NOT begin loading until the parent `BoxGrid` has entered the viewport (see `sprite-lazy-loading` capability). The `BoxSlotCell` SHALL accept a `visible` prop from its parent `BoxGrid`; when `visible` is `false`, only the `SpritePlaceholder` is rendered and no `<picture>` or `<img>` elements are emitted.

#### Scenario: Placeholder shown before box enters viewport
- **WHEN** a `BoxGrid` has not yet entered the viewport
- **THEN** `BoxSlotCell` SHALL render only the `SpritePlaceholder`
- **THEN** no `<img>` or `<source>` elements SHALL be present in the DOM for that slot

#### Scenario: Placeholder shown while sprite is loading after box enters viewport
- **WHEN** the parent `BoxGrid` has become visible and the sprite image has not yet loaded
- **THEN** the `SpritePlaceholder` SHALL be visible
- **THEN** the `<picture>` element with `<source type="image/webp">` and `<img>` fallback SHALL be present but the image SHALL not yet be visible

#### Scenario: Smooth transition when sprite loads
- **WHEN** the sprite image finishes loading (fires `onLoad`)
- **THEN** the sprite SHALL fade in using a CSS transition (`--transition-fast`, 150ms)
- **THEN** the placeholder SHALL be hidden

#### Scenario: Fallback when sprite fails to load
- **WHEN** the sprite image fails to load (fires `onError`)
- **THEN** the `SpritePlaceholder` SHALL remain visible
- **THEN** no broken image icon SHALL be displayed
