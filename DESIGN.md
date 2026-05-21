---
name: Poke Box Manager
description: Offline-first Pokémon Home companion. Quiet planning tool for collectors.
colors:
  signal-red: "#e63946"
  signal-red-foreground: "oklch(0.985 0.005 25)"
  surface-light: "oklch(0.99 0.005 25)"
  surface-dark: "#1a1a2e"
  background-light: "oklch(0.98 0.005 25)"
  background-dark: "oklch(0.16 0.008 25)"
  foreground-light: "oklch(0.18 0.01 25)"
  foreground-dark: "oklch(0.93 0.005 25)"
  muted-light: "oklch(0.96 0.005 25)"
  muted-dark: "#1e293b"
  muted-foreground-light: "oklch(0.55 0.02 25)"
  muted-foreground-dark: "#94a3b8"
  border-light: "oklch(0.91 0.008 25)"
  border-dark: "#2d2d44"
  card-light: "oklch(0.99 0.005 25)"
  card-dark: "oklch(0.22 0.008 25)"
  primary-light: "oklch(0.22 0.008 25)"
  primary-dark: "oklch(0.92 0.005 25)"
  destructive-light: "oklch(0.577 0.245 27.325)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
  registered-light: "oklch(0.55 0.13 145)"
  registered-dark: "oklch(0.62 0.14 145)"
  registered-foreground: "oklch(0.985 0.005 25)"
  shiny-light: "oklch(0.78 0.17 80)"
  shiny-dark: "oklch(0.82 0.17 80)"
  shiny-foreground: "oklch(0.25 0.08 80)"
  warning-light: "oklch(0.65 0.15 65)"
  warning-dark: "oklch(0.72 0.15 65)"
  warning-foreground-light: "oklch(0.985 0.005 25)"
  warning-foreground-dark: "oklch(0.18 0.04 65)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.05em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  pill: "26px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.surface-light}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.surface-light}"
  button-outline:
    backgroundColor: "{colors.background-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  button-destructive:
    backgroundColor: "{colors.destructive-light}"
    textColor: "{colors.destructive-light}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
    height: "32px"
  card-default:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-default:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.surface-light}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  badge-secondary:
    backgroundColor: "{colors.muted-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  nav-link-default:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground-light}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-link-active:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.signal-red-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  slot-registered:
    backgroundColor: "{colors.card-light}"
    rounded: "{rounded.md}"
    size: "auto"
  slot-empty:
    backgroundColor: "{colors.muted-light}"
    rounded: "{rounded.md}"
    size: "auto"
  slot-selected:
    backgroundColor: "{colors.card-light}"
    rounded: "{rounded.md}"
    size: "auto"
---

# Design System: Poke Box Manager

## 1. Overview

**Creative North Star: "The Collector's Binder"**

The interface is the binder; the user's Pokémon are the content. Every surface is neutral and quiet so that sprites, registration checks, shiny pips, and type chips carry every meaningful color on the screen. The only saturated tone in the chrome is **Signal Red**, used sparingly to mark exactly one thing at a time: which navigation item is active, which slot is selected, where the focus ring sits. Everything else is a tinted neutral.

The system honors Pokémon Home's 6×5 grid as a literal structural element, then dresses it down. No pixel fonts, no glossy badge buttons, no red-yellow gradients, no celebratory motion. The reward for using this tool is the user's own sense of order, not the tool congratulating them. Density is moderate and considered: the home page leads with one progress ring, then a tight 3 to 4 column grid of stat tiles, then quiet section strips. The visual language sits in the same neighborhood as Linear, Things 3, and Raycast; it explicitly rejects every Pokémon fan dashboard since 2008.

**Key Characteristics:**

- One saturated brand color (Signal Red), used as a state marker on ≤5% of any screen.
- Tinted-neutral surface ramp with a hairline ring (`ring-1 ring-foreground/10`) instead of borders or shadows on cards.
- Inter for everything, JetBrains Mono reserved for IDs, counts, and small metadata.
- Spacing rhythm in 4/8/12/16/24px steps; uppercase tracked-wide labels mark section starts.
- Type colors live exclusively *inside* data (chips, stat grids). They never leak into the chrome.

## 2. Colors: The Restrained Palette

The strategy is **Restrained**: tinted neutrals plus one accent, used on no more than ~5% of any given screen. Light theme and dark theme each get a coherent ramp; the accent is identical in both so brand identity carries across themes.

### Primary

- **Signal Red** (`#e63946`): The single brand color. Used for the active sidebar link, the logo glyph (`Grid3X3` icon), the box selection ring (`border-accent` + `ring-accent/30`), the focus ring (`--ring`), the mobile bottom-nav active state, and active-tab text. It does not appear on default buttons, on card chrome, on hover states, on dividers, on backgrounds, or on type chips. It is the loudest color in the system and it earns its silence by being rare.

### Secondary

- **Neutral Primary** (`#252525` light / `#e8e8e8` dark): The "ink" color for primary buttons, milestone pip fills, drop-target rings, and the keyboard-focused-slot ring. Carries weight that Signal Red carries character.

### Tertiary (state colors)

State colors are first-class CSS tokens, not Tailwind palette classes. Each one has a `--color-{name}` and a `--color-{name}-foreground` so they support both solid and tinted usage (`bg-registered`, `bg-registered/15`, `text-registered`, `text-registered-foreground`).

- **Registered Green** (`oklch(0.55 0.13 145)` light / `oklch(0.62 0.14 145)` dark): The checkmark badge in the top-right of every registered slot, the Pokédex "registered" status pill (used as `bg-registered/15 text-registered`), the `BoxOverview` mini-grid dots, the `BoxHeatmap` complete-state cells, the `BoxSummary` complete tile. The token name is `registered`; the Tailwind utility is `bg-registered` / `text-registered`. Foreground (for solid-fill pips): `oklch(0.985 0.005 25)`. Never used outside registration semantics.
- **Shiny Amber** (`oklch(0.78 0.17 80)` light / `oklch(0.82 0.17 80)` dark): The shiny pip in the top-left of slots marked shiny, the `Sparkles` icon in `ShinyProgressSection`, the shiny progress bar fill. Foreground (for solid-fill pips): `oklch(0.25 0.08 80)` (dark amber/brown). Same role across themes: shiny is desirable; the color is celebratory but contained to actual shiny indicators.
- **Warning Amber** (`oklch(0.65 0.15 65)` light / `oklch(0.72 0.15 65)` dark): The `BackupReminderBanner`, the `VariationToggleItem` data-loss warning icon, the `BoxHeatmap` partial-state cells, the `BoxSummary` partial tile. Distinct from Shiny on purpose: Shiny is hue 80 (true amber), Warning is hue 65 (slightly more orange) so they don't visually collide. Warning means "you should respond," not "this is broken."
- **Destructive Red** (`oklch(0.577 0.245 27.325)` light / `oklch(0.704 0.191 22.216)` dark): Errors, delete actions, `aria-invalid` rings. Distinct hue from Signal Red on purpose: the brand color must never get confused with a destructive action.

### Neutral

The neutral ramp runs in **two directions** by design. In light mode, every neutral tints warm toward Signal Red's hue (~25) at chroma 0.005 to 0.02. In dark mode, the surface family (Surface, Muted, Border) tints cool toward `#1a1a2e`'s blue-purple hue (~270) for a faint atmospheric sense of depth, while content surfaces (Card, Popover, Foreground) tint warm to read as content against that cool chrome. The brand accent is identical in both themes.

- **Surface** (`oklch(0.99 0.005 25)` light / `#1a1a2e` dark): Sidebar, header, sheet, top-of-the-page rails. Cooler than Background in dark mode for the depth cue.
- **Background** (`oklch(0.98 0.005 25)` light / `oklch(0.16 0.008 25)` dark): The page itself. Body lives here.
- **Card** (`oklch(0.99 0.005 25)` light / `oklch(0.22 0.008 25)` dark): Cards, slot cells in the registered/missing state, stat tiles, popovers, dialogs.
- **Muted** (`oklch(0.96 0.005 25)` light / `#1e293b` dark): Hover fills, empty slot backgrounds (at 20% opacity), card footers (at 50% opacity).
- **Muted Foreground** (`oklch(0.55 0.02 25)` light / `#94a3b8` dark): Section heading labels, secondary text, inactive nav, slot names under sprites.
- **Foreground** (`oklch(0.18 0.01 25)` light / `oklch(0.93 0.005 25)` dark): Primary text, headings, stat values.
- **Border** (`oklch(0.91 0.008 25)` light / `#2d2d44` dark): Hairlines, dividers, input strokes, header bottom, mobile-nav top.

### Type colors (data layer only)

The 18 Pokémon type colors (`fire #F08030`, `water #6890F0`, `grass #78C850`, etc.) live in `src/lib/type-colors.ts` alongside a per-type foreground table (`TYPE_FOREGROUNDS`) and a `typeChipStyle(type)` helper. Each type's foreground is chosen for ≥4.5:1 contrast against its background: 13 light type colors get dark text (`oklch(0.18 0.01 25)`), and 5 dark types (fighting, poison, ghost, dragon, dark) get light text (`oklch(0.985 0.005 25)`). Components rendering type chips import `typeChipStyle` and spread it: `style={typeChipStyle(type)}`. Type colors are reserved for type chips on Pokémon cards, the type grid in `/stats`, and search result rows. They never appear in app chrome.

### Named Rules

**The Signal Red Rule.** Signal Red marks the answer to "where am I?" or "what did I just pick?" on a given screen. If a second element is competing for that answer, one of them is wrong. Never use Signal Red for hover states, for non-selection highlights, for decorative borders, for chart series, or for type/generation chips.

**The Type-Color Containment Rule.** Pokémon type colors live inside data, never around it. A type chip can be `#F08030`. A card containing a Fire-type Pokémon cannot be `#F08030`. Backgrounds, borders, headers, and dividers never inherit type color.

**The Tinted-Neutral Direction.** Every neutral carries chroma. In light mode, push hue 25 (warm, toward Signal Red) at chroma 0.005 to 0.02. In dark mode, the surface family (Surface, Muted, Border) keeps hue 270 (cool, toward `#1a1a2e`) for depth; content surfaces (Card, Popover, Foreground, Primary) tint warm so they read as content against the cool chrome. The single rule across both directions: no pure `#000`, no pure `#fff`, ever. New tokens that need a hex form (e.g. for legacy compatibility) must already round-trip to OKLCH with non-zero chroma.

## 3. Typography

**Display, Headline, Title, Body:** Inter (with `ui-sans-serif`, `system-ui`, `sans-serif` fallback)
**Label, Mono:** JetBrains Mono (with `ui-monospace`, `SFMono-Regular` fallback)

**Character:** Inter does the talking; JetBrains Mono does the counting. Single-typeface UI with mono reserved for tabular data (counts, IDs, ratios, durations). No serif, no display face, no script. The pairing is functional, not decorative. Both typefaces are loaded via `next/font/google` and exposed as `--font-sans` and `--font-jetbrains-mono`.

### Hierarchy

- **Display** (700, 1.5rem / 24px, line-height 1): Stat tile values on the Home page (e.g. registered counts), the `tabular-nums` numeric headlines. Bold weight is structural, not decorative. Reserved for the largest numbers on the screen. Bigger than the page title on purpose: the data is the lead, the page name is orientation.
- **Page title** (600, 1.25rem / 20px, line-height tight): The `<h1>` on every page, rendered via the `<PageTitle>` primitive in `src/components/layout/PageTitle.tsx`. Optional subtitle in Body Muted (14px / 400 muted-foreground) sits directly beneath. Optional `actions` slot on the right for the page's primary CTA. Home uses `visuallyHidden` so the progress ring leads visually while the h1 stays present for assistive tech.
- **Headline** (500, 1rem / 16px, line-height 1.4): Card titles. `font-heading` in code; inherits from Inter, no separate display face.
- **Title** (500, 0.875rem / 14px, line-height 1.4): Nav link labels, button labels, dialog headings.
- **Body** (400, 0.875rem / 14px, line-height 1.5): Default body text. Cap line length at 65–75ch wherever long prose appears (settings descriptions, help overlay copy).
- **Label** (600, 0.75rem / 12px, letter-spacing 0.05em, UPPERCASE): Section headings on the Home page (`SectionHeading` component). Marks the start of a region. Sparingly used elsewhere.
- **Mono** (500, 0.75rem / 12px): Stat sub-values (`/ 1025`), Pokédex IDs (`#0001`), keyboard shortcut keys in the help overlay, ratios.

### Named Rules

**The Mono-for-Numbers Rule.** Anything that's a count, an ID, a ratio, or a duration uses JetBrains Mono with `tabular-nums`. Anything that's a name, a label, or prose uses Inter. The rule is mechanical; there are no exceptions.

**The Tracked-Label Rule.** Section starts are signaled by an uppercase, tracked, muted-foreground label, never by an oversized heading. The Home page is the reference: `SectionHeading` is the smallest type on the page, not the largest.

**The No-Hero-Type Rule.** No `font-size: clamp(2rem, 7vw, 5rem)` hero displays. The largest type in the product is the 24px stat value. Drama comes from rhythm, not from scale.

**The Page-Title Rule.** Every page has exactly one `<h1>`, rendered through the `<PageTitle>` primitive. It is smaller than stat values (20px vs 24px) because the user navigated to the page, they know where they are. The loudest element is always the data, never the orientation label. Home is allowed to use `visuallyHidden` to keep the h1 present for assistive tech without competing visually with the progress ring.

## 4. Elevation

**Flat by default, ring-for-separation, shadow-on-interaction.** Surfaces do not lift unless the user is doing something with them. Cards live on the page with a hairline ring (`ring-1 ring-foreground/10`), never a drop shadow. Borders are used only where a stroke is structurally needed: inputs, the header's bottom edge, the mobile nav's top edge, the sidebar's right edge. Cards use ring, not border, on purpose: ring renders inside the box and never disturbs layout.

Shadows appear only as a response to state, never as decoration. The shiny pip uses `shadow-sm` to lift the badge off the sprite. Box slots use `hover:shadow-md` to confirm the cell is interactive. Dialogs, alert dialogs, and sheets use the codified `shadow-overlay` token.

### Shadow Vocabulary

- **slot-hover** (`box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.06)`, equivalent to Tailwind's `shadow-md`): Box-slot interactive feedback. Hover only. Also used on dropdown, context, and select menus (floating menus, lower elevation tier than modals).
- **pip** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`, Tailwind's `shadow-sm`): Lifts shiny and registration pips off the sprite background.
- **overlay** (`box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.16), 0 2px 6px -2px rgb(0 0 0 / 0.08)`, available as `shadow-overlay`): Dialogs, alert dialogs, sheets. The highest elevation tier in the system. Use only for surfaces that are conceptually modal.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. If a card has a shadow with no interaction, it's wrong; replace the shadow with a `ring-1 ring-foreground/10`.

**The Ring-Over-Border Rule.** For card-like containers, prefer `ring-1` over `border` so the stroke doesn't shift the box model. Borders are reserved for inputs, navigation rails, and dividers; rings for cards and overlays.

**The No-Decorative-Shadow Rule.** A shadow on a stat tile, a section header, a chip, or a sidebar item is always wrong. Shadows are feedback. If something doesn't respond to the cursor or keyboard, it doesn't get a shadow.

## 5. Components

### Buttons

- **Shape:** Rounded rectangle (`var(--radius-md)`, 10px). Subtle: not pill, not square.
- **Sizes:** `xs` 24px, `sm` 28px, default 32px, `lg` 36px, icon variants matching. Default size is compact and dense; this is a power-user tool.
- **Primary:** `bg-primary text-primary-foreground` (near-black on light, near-white on dark). Used for confirmation actions. Never colored with Signal Red.
- **Outline:** `bg-background border border-border`. The everyday button. Auto-fill, Edit, secondary CTAs.
- **Ghost:** Transparent until hover. Icon-only actions in headers and toolbars.
- **Destructive:** `bg-destructive/10 text-destructive` (tinted red on red text). Soft, not loud. Confirmation dialogs amplify the action; the button itself stays quiet.
- **Press feedback:** `active:translate-y-px` (one pixel down). Tactile but never bouncy.
- **Focus:** `focus-visible:ring-3 focus-visible:ring-ring/50` plus `focus-visible:border-ring`. The Signal Red focus ring is the most visible state any button has.

### Inputs

- **Shape:** Rounded rectangle (`var(--radius-md)`, 10px).
- **Stroke:** `border-input` (a tinted neutral). Transparent background.
- **Height:** 32px default (`h-8`).
- **Focus:** Border shifts to Signal Red (`focus-visible:border-ring`) and a 3px Signal Red glow at 50% opacity (`focus-visible:ring-3 focus-visible:ring-ring/50`). This is the primary focus treatment across the system.
- **Error:** `aria-invalid` swaps border to `destructive` and ring to `destructive/20`.
- **Disabled:** 50% opacity, no pointer, tinted background.

### Cards

- **Shape:** Rounded rectangle (`var(--radius-lg)`, 12px) for primary cards; stat tiles use `rounded-xl` (14px).
- **Stroke:** `ring-1 ring-foreground/10` (hairline ring, never border).
- **Background:** `bg-card` (`#ffffff` light / `#2b2b2b` dark).
- **Padding:** 16px default, 12px in `size="sm"` variant.
- **Footer (when present):** `bg-muted/50` (tinted band) with `border-t`. Footer reads as a quieter inset zone for actions.
- **Shadow:** None at rest. Period.

### Chips / Badges

- **Shape:** Full pill (`rounded-4xl` = 26px on a 20px-tall element). Geometric and unambiguous.
- **Height:** 20px (`h-5`).
- **Type chip variant:** Uses the type-color palette as background, with a 4.5:1-contrast text color and a type abbreviation glyph alongside the name (see Do's and Don'ts).
- **Default variant:** `bg-primary text-primary-foreground` for status badges.
- **Secondary variant:** `bg-secondary` for soft labels.

### Navigation

- **Sidebar:** 224px wide expanded (`w-56`), 64px collapsed (`w-16`). `bg-surface border-r border-border`. Padding shifts with collapse state.
- **Nav link default:** `rounded-md py-2 px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground`.
- **Nav link active:** `bg-accent text-accent-foreground` (the Signal Red bar). Exactly one nav link is active at a time; this is the "where am I?" answer for the entire app.
- **Logo glyph:** `Grid3X3` icon in `text-accent` (Signal Red). The app's only piece of always-on brand color.
- **Mobile bottom nav:** `border-t border-border bg-surface`, 56px tall, four primary destinations plus a "more" overflow. Active item: `text-accent` only (no background fill on mobile — the chrome stays cleaner on small screens).

### Box Slot Cell (Signature Component)

The single most important visual element in the product. A 6×5 grid of these makes up every box, mirroring Pokémon Home itself.

- **Shape:** Square (`aspect-square`), `rounded-md` (10px).
- **States:**
  - **Registered:** `bg-card`, sprite at 100% opacity, green check pip in top-right.
  - **Missing:** `bg-card`, sprite at 30% opacity (a desaturated ghost of the Pokémon).
  - **Empty:** `border-2 border-dashed border-muted bg-muted/20`, a `CircleHelp` icon at 50% opacity in the center.
  - **Selected:** Adds `border-2 border-accent ring-2 ring-accent/30` (Signal Red double-ring).
  - **Drop target:** `ring-2 ring-primary` (near-black; uses primary not accent to distinguish from selection).
  - **Keyboard-focused:** `ring-2 ring-primary outline-none` (same as drop target, since both communicate "this is the current cell").
- **Interaction affordances:** Hover lifts with `shadow-md` and scales the sprite to 110%. A `GripVertical` icon fades in at the bottom-right to signal draggability. Tooltip on hover gives the Pokémon name and any tags.
- **Decoration:** Shiny pip (amber sparkle) in the top-left when the slot is registered shiny. Tag dots and a `PencilLine` note indicator in the bottom-left. Nothing else.
- **Accessibility:** Every slot is a `role="gridcell"` with full ARIA labels announcing position, contents, and registration status. Keyboard parity for every drag interaction is non-negotiable.

## 6. Do's and Don'ts

### Do

- **Do** use Signal Red (`#e63946`) as a state marker only: active nav, selected slot, focus ring, primary CTA never (use Neutral Primary `#252525` for primary CTAs).
- **Do** use `ring-1 ring-foreground/10` for card-like containers; reserve `border` for inputs, nav rails, and dividers.
- **Do** use JetBrains Mono with `tabular-nums` for every count, ID, ratio, and duration. Use Inter for everything else.
- **Do** lead a section with `text-xs font-semibold uppercase tracking-wide text-muted-foreground` (the `SectionHeading` pattern). The Home page is the canonical reference.
- **Do** pair every color signal with a glyph, abbreviation, or text. Type chips always carry the type name; registered slots always carry the green check; shiny slots always carry the sparkle. Color is never the sole signal.
- **Do** lean on the default easing. `--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1)` is set as `--default-transition-timing-function`, so every `transition-*` utility without an explicit easing eases out exponentially. Use `ease-out-quart` when an explicit easing class is needed.
- **Do** keep `ease-in-out` only for explicit layout-transform overrides (the sidebar collapse, padding shifts in `AppShell.tsx` and `Sidebar.tsx`). Layout transforms read better with a symmetric S-curve. Everything else eases out.
- **Do** keep transition durations on the existing tokens: `--transition-fast: 150ms` (hover, focus), `--transition-normal: 200ms` (state changes, theme), `--transition-slow: 300ms` (sidebar collapse, layout).
- **Do** respect `prefers-reduced-motion`: every transition currently uses `motion-reduce:transition-none`, and new ones must too.
- **Do** use the existing radius scale (6/10/12/14/26 px) rather than inventing new values.
- **Do** keep the type-color palette (`src/lib/type-colors.ts`) inside Pokémon data: type chips, the stats type grid, search result rows. Nowhere else. Always use `typeChipStyle(type)` for chip backgrounds; never set `color: white` directly. The helper returns a paired foreground color that meets WCAG 4.5:1 against the type background.
- **Do** use the semantic state tokens (`bg-registered`, `bg-shiny`, `bg-warning`, `bg-destructive`) for any state indicator. Solid fills get the paired `-foreground` token. Tints use opacity modifiers like `bg-registered/15 text-registered`. Empty / inactive states use `bg-muted text-muted-foreground`, not destructive.

### Don't

- **Don't** ship any of PRODUCT.md's anti-references. To name them explicitly here:
  - **Don't** use pixel fonts, Game Boy bezels, glossy 3D pokéballs, red/yellow gradient backgrounds, pokéball-shaped buttons, sparkle effects in chrome, or "Gotta catch 'em all" copy. The fan-site lane is off-limits.
  - **Don't** ship the generic SaaS look: off-white plus single blue accent, identical icon-and-heading card grids, hero-metric blocks (big number + small label + supporting stat + gradient accent), gradient pill buttons, "Welcome back" copy. The default-template-without-craft look is off-limits.
  - **Don't** ship loud gamified RPG dashboards: animated stat bars, level-up flourishes, neon glows, badge spam, particle effects, achievement toasts, XP rings, "combo" celebrations. Progress is visible, never theatrical.
  - **Don't** ship the bento-grid AI app look: rounded-2xl cards in a 12-column bento, glass blurs, gradient mesh backgrounds, oversized hero typography that says nothing. The 2024 to 2026 startup template look is off-limits.
- **Don't** use Signal Red (`#e63946`) for hover states, dividers, chart series, decorative borders, or any non-selection highlight. If you find yourself reaching for the accent, ask which existing accent usage you're competing with.
- **Don't** use any of the 18 Pokémon type colors outside of type chips, the stats type grid, or search result rows. Type colors never appear on app chrome.
- **Don't** hardcode `bg-green-*`, `bg-amber-*`, `bg-yellow-*`, `bg-red-*` Tailwind palette classes for state semantics. Use `bg-registered`, `bg-shiny`, `bg-warning`, `bg-destructive` instead. The Tailwind palette ships green-500 / amber-400 / yellow-400 with no hue control; the system tokens are tuned for the warm-neutral chrome and have paired foreground colors.
- **Don't** put `text-white` on a type chip. White text fails AA on 13 of the 18 Pokémon type colors (every light-luminance type). Use `typeChipStyle(type)`.
- **Don't** color empty / inactive states with `destructive`. Empty is not error. Use `bg-muted text-muted-foreground` or `bg-muted-foreground/30`.
- **Don't** add `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Side-stripe borders are absolutely banned.
- **Don't** use `background-clip: text` with a gradient. Gradient text is absolutely banned.
- **Don't** use blurs or glass cards as a default treatment. They are reserved for the search results overlay and dialog backdrops; nowhere else.
- **Don't** reach for a modal first. The codebase has good inline alternatives (popovers, sheets, context menus, `MoveToDialog` is a counter-example used because the action is genuinely modal). Use inline editing wherever possible.
- **Don't** ship pure `#ffffff` or pure `#000000` in new tokens. Every neutral carries chroma 0.005 to 0.02 at hue 25 (light, content surfaces in dark) or hue 270 (dark surface family). If a hex is required for legacy compatibility, pick one that round-trips to OKLCH with non-zero chroma.
- **Don't** add drop shadows to surfaces at rest. If you want depth, use the ring; if you want emphasis, use weight or spacing.
- **Don't** invent a new font, weight, or size scale outside the existing hierarchy. Inter + JetBrains Mono is the entire system.
- **Don't** localize "PokeBox" or product strings into emoji or icon-only forms. pt-BR is the default locale and gets first-class strings.
- **Don't** ship a "completion celebration" animation. The user's count going up is the reward. No confetti, no toast, no sound.
