## ADDED Requirements

### Requirement: CSS transitions are suppressed when prefers-reduced-motion is active

All Tailwind transition classes (`transition-*`, `duration-*`, `animate-*`) used in the app SHALL be paired with a `motion-reduce:` variant that removes or shortens the animation. When the OS/browser `prefers-reduced-motion: reduce` media query is active, transitions SHALL either be instant or omitted entirely.

#### Scenario: Slot hover transition removed under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and the user hovers a `BoxSlotCell`
- **THEN** no transition animation SHALL play (state change is instant)

#### Scenario: Sidebar open/close animation removed under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and the sidebar opens or closes
- **THEN** the panel SHALL appear/disappear instantly without a slide or fade animation

#### Scenario: Sheet open/close animation removed under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and a Sheet opens or closes
- **THEN** the sheet SHALL appear/disappear instantly

### Requirement: DnD overlay animation is suppressed under reduced motion

The `DragOverlay` ghost sprite and any drop-target highlight transitions SHALL be instantaneous when `prefers-reduced-motion: reduce` is active.

#### Scenario: Ghost sprite appears instantly under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and the user initiates a drag
- **THEN** the ghost overlay SHALL appear at the pointer position immediately, without a fade-in

#### Scenario: Drop highlight appears instantly under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and the drag pointer enters a droppable slot
- **THEN** the drop highlight SHALL appear immediately without a transition

### Requirement: Spinner and loading skeletons respect reduced motion

Any spinner, skeleton shimmer, or pulse animation SHALL be stopped or replaced with a static state when `prefers-reduced-motion: reduce` is active.

#### Scenario: Sprite loading placeholder is static under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and a sprite image is loading
- **THEN** the placeholder SHALL be a static silhouette (no pulse/shimmer)
