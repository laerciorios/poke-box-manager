## ADDED Requirements

### Requirement: Text colors meet WCAG AA contrast ratio in light theme

All text rendered against the light theme background SHALL achieve a minimum contrast ratio of 4.5:1 for normal text (< 18pt / < 14pt bold) and 3:1 for large text (≥ 18pt / ≥ 14pt bold), as defined by WCAG 2.1 SC 1.4.3.

#### Scenario: Body text passes in light theme

- **WHEN** the light theme is active
- **THEN** the `--foreground` token against `--background` SHALL have a contrast ratio ≥ 4.5:1

#### Scenario: Muted/secondary text passes in light theme

- **WHEN** the light theme is active
- **THEN** the `--muted-foreground` token against its background SHALL have a contrast ratio ≥ 4.5:1

### Requirement: Text colors meet WCAG AA contrast ratio in dark theme

All text rendered against the dark theme background SHALL achieve the same WCAG AA thresholds as for the light theme.

#### Scenario: Body text passes in dark theme

- **WHEN** the dark theme is active
- **THEN** the `--foreground` token against `--background` SHALL have a contrast ratio ≥ 4.5:1

#### Scenario: Muted/secondary text passes in dark theme

- **WHEN** the dark theme is active
- **THEN** the `--muted-foreground` token against its background SHALL have a contrast ratio ≥ 4.5:1

### Requirement: Interactive UI component colors meet WCAG AA 3:1 for boundaries

Non-text UI components (buttons, input borders, focus rings, slot borders) SHALL have a contrast ratio of at least 3:1 against their adjacent background, per WCAG 2.1 SC 1.4.11 (Non-text Contrast).

#### Scenario: Button border/background passes contrast

- **WHEN** either theme is active
- **THEN** the primary button background against page background SHALL achieve ≥ 3:1

#### Scenario: Focus ring passes contrast

- **WHEN** either theme is active
- **THEN** the `--ring` token against the adjacent background SHALL achieve ≥ 3:1

#### Scenario: Empty slot dashed border passes contrast

- **WHEN** either theme is active
- **THEN** the dashed border of an empty `BoxSlotCell` against `--background` SHALL achieve ≥ 3:1

### Requirement: Registered state indicator (green checkmark) meets contrast

The green checkmark/indicator used on registered slots SHALL meet WCAG AA non-text contrast (3:1) against the slot background in both themes.

#### Scenario: Registration indicator color passes

- **WHEN** either theme is active
- **THEN** the green indicator color against the slot cell background SHALL achieve ≥ 3:1
