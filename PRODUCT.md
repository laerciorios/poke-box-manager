## Register

product

## Users

**Primary: the author.** This is a personal tool and a portfolio piece. The user is a software engineer who collects Pokémon across games and wants a planning surface outside of Pokémon Home itself: somewhere to map boxes ahead of time, decide what to transfer, see what's missing, and track progress without juggling spreadsheets.

**Secondary: serious collectors.** Living-dex hunters, multi-game players, shiny hunters. They already know the domain (forms, regional variants, generations, types). They have opinions about how their boxes should be arranged. They open this tool on a desktop with intent, not on a phone while half-watching TV. They want speed, precision, and trust, not onboarding tours.

Context of use: planning sessions, not gameplay. They are deciding, not playing. The tool is opened next to Pokémon Home, not instead of it.

## Product Purpose

An offline-first companion for Pokémon Home: organize boxes (6×5 grids, 30 slots each, matching Home), track Pokédex registration across forms and generations, analyze what's missing, and save reusable organization presets. All user data lives in the browser via IndexedDB. There is no account, no sync, no backend, no telemetry.

Success looks like: the user can plan an entire dex's worth of boxes faster here than in any spreadsheet or in Home itself, trusts that nothing is lost between sessions, and never thinks about the chrome.

## Brand Personality

**Precise, calm, expert.**

The interface speaks to someone who already knows what a Hisuian form is. It does not over-explain, does not celebrate every interaction, does not nudge the user toward a "next step." It states things and gets out of the way. Copy is short and exact. Empty states are honest, not motivational. Confirmations are quiet. No mascots, no flourishes, no easter eggs that interrupt the work.

Emotionally, the tool should feel like a well-organized binder, not a video game menu. The reward for using it is the user's own sense of progress, not the tool congratulating them.

## Anti-references

This product must not look like any of the following:

- **Fan-site Pokédex clichés.** Pixel fonts, Game Boy bezels, glossy 3D pokéballs, red/yellow gradient backgrounds, pokéball-shaped buttons, sparkle effects, "Gotta catch 'em all" copy, type-color rainbow chrome. The aesthetic of every Pokémon fan dashboard since 2008 is off-limits.
- **Generic SaaS cream/blue.** Off-white background, single blue accent, identical icon-and-heading card grids, hero-metric blocks (big number, small label, supporting stats, gradient accent), gradient pill buttons, "Welcome back, here's your dashboard" copy. The default Vercel/Linear-template-without-the-craft look.
- **Loud gamified RPG dashboard.** Animated stat bars, level-up flourishes, neon glows, badge spam, particle effects, achievement toasts, XP progress rings on everything, "completion combo" celebrations. Progress should be visible, never theatrical.
- **Bento-grid AI app aesthetic.** Rounded-2xl cards arranged in 12-column bento layouts, glass blurs, gradient mesh backgrounds, oversized hero typography that says nothing, "AI-powered" framing. The 2024 to 2026 startup-template look.

If the design starts to drift toward any of these, the answer is "rewrite the element with different structure," not "tone it down."

## Design Principles

1. **Pokémon is the content, the shell is not.** The app chrome stays neutral and quiet so that sprites, type chips, and the data carry every color and texture. Decorative use of pokéball red or type colors in the chrome is a smell. Type/generation colors live inside the data, never around it.

2. **Treat the user as an expert.** Skip the explanations they don't need. No tooltips for things the label already says. Keyboard paths exist for every drag interaction. Defaults are sensible, not safe.

3. **Be honest about local state.** Because everything lives in IndexedDB on one device, the tool should always make backup, export, and restore visible and effortless. Never imply data is synced or safe across devices. The recent backup-reminder banner is the right instinct; that posture should hold across new features.

4. **Quiet over loud, structure over decoration.** Match the craft of Linear, Things 3, and Raycast, not the visual language of Pokémon apps. Rhythm comes from typography and spacing; emphasis comes from weight and scale, not from color or borders. Empty space is a feature.

5. **Accessibility is part of correctness.** A box tool that can't be operated by keyboard or read by a screen reader is broken, not "Phase 2." Type and generation are conveyed by glyph or text alongside any color, never by color alone.

## Accessibility & Inclusion

**Target: WCAG 2.2 AA across the entire app.** This is not aspirational; it is the bar for "done."

Specific commitments:

- **Keyboard parity for drag interactions.** Every box reorder, slot move, and grid manipulation has an equivalent keyboard path. `@dnd-kit/accessibility` is already in the stack and should stay first-class.
- **Visible focus everywhere.** Focus rings are designed, not browser-default. Focus is never trapped except in modals.
- **Color is never the sole signal.** Pokémon type chips, generation tags, shiny indicators, and box color labels must always pair color with a glyph, abbreviation, or text. Color-blind users see no degraded experience.
- **Contrast.** Body text ≥4.5:1; large text and UI components ≥3:1. The OKLCH neutral ramp must be checked at both extremes of each theme.
- **Reduced motion is respected.** `prefers-reduced-motion` short-circuits decorative transitions; functional motion (focus moves, drop indicators) survives but without easing flourishes.
- **Screen reader labels on the grid.** Each slot announces its position, contents (Pokémon name + form + shiny status), and action affordances.
- **Locales are first-class.** pt-BR is the default, not a fallback. UI strings, dates, numbers, and Pokémon names all localize.
