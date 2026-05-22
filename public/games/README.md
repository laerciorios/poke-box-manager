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

The `src/data/availability-overrides.json` file holds per-Pokémon
overrides (version-exclusives, removals, event-only flags). Run the
status script in the chat to see which games are fully populated vs.
still using only the default rule.

Last summary (after Gen 1, Gen 2, Gen 6 legendaries, Gen 8 DLCs,
Gen 9 base + DLCs + Z-A): the Switch-era games have most coverage;
gens 3–7 carry only the canonical version-exclusives so far.
