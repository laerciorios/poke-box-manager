# Game Logos

Drop a PNG or SVG file here named after the game id (see
`src/data/games-list.json`). The app auto-loads it in the Pokédex
availability panel. Until a file exists, an SVG placeholder (rounded
square with the game's color and initials) renders instead.

## Expected filenames

Each filename matches the `id` field in `src/data/games-list.json`,
which now follows the same naming as the PokéAPI version index. PNG
preferred (transparent background, square or roughly square, ~256×256
ideal). SVG also works if you change the extension in `GameBadge.tsx`.

```
red.png            blue.png            yellow.png
gold.png           silver.png          crystal.png

ruby.png           sapphire.png        emerald.png
firered.png        leafgreen.png

diamond.png        pearl.png           platinum.png
heartgold.png      soulsilver.png

black.png          white.png           black-2.png         white-2.png

x.png              y.png
omega-ruby.png     alpha-sapphire.png

sun.png            moon.png
ultra-sun.png      ultra-moon.png
lets-go-pikachu.png lets-go-eevee.png

sword.png          shield.png
the-isle-of-armor.png  the-crown-tundra.png
brilliant-diamond.png shining-pearl.png
legends-arceus.png

scarlet.png        violet.png
the-teal-mask.png  the-indigo-disk.png
legends-za.png     mega-dimension.png
```

43 files total.

## Status of game-specific availability data

`src/data/availability-overrides.json` (schema v3) holds the absolute
per-Pokémon game list. Each species' `games` array is the complete,
verified set of finalized games where it can be obtained: no defaults,
no deltas. Species without an entry render as "not yet curated" in the
UI. Per-form exclusivity (e.g. Tauros Blaze Breed in Scarlet only) lives
in `forms.{formId}.games` inside the species entry.

Finalized games (verified against official Pokédex lists):

- Gen 1: Red, Blue, Yellow
- Gen 2: Gold, Silver, Crystal
- Gen 3: FireRed, LeafGreen
- Gen 7: Let's Go Pikachu, Let's Go Eevee
- Gen 8: Brilliant Diamond, Shining Pearl, The Isle of Armor (DLC),
  The Crown Tundra (DLC), Legends Arceus
- Gen 9: Scarlet, Violet, The Teal Mask, The Indigo Disk, Legends Z-A,
  Mega Dimension

21 games finalized. Remaining titles still wait for their official
Pokédex lists.

Pending refinement: form-level exclusivity (e.g. Tauros Blaze Breed is
Scarlet-only and Aqua Breed is Violet-only). The current schema is
species-level only.
