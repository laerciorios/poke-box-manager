export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

const INK = 'oklch(0.18 0.01 25)'
const BONE = 'oklch(0.985 0.005 25)'

// Each type color paired with an AA-contrast text color (≥ 4.5:1 for chip labels).
// Five types are dark enough for light text; the remaining 13 are too light, so white
// text would fail WCAG and must be dark instead. Verified against the official Pokémon
// type palette in `TYPE_COLORS`.
export const TYPE_FOREGROUNDS: Record<string, string> = {
  normal: INK,
  fire: INK,
  water: INK,
  grass: INK,
  electric: INK,
  ice: INK,
  fighting: BONE,
  poison: BONE,
  ground: INK,
  flying: INK,
  psychic: INK,
  bug: INK,
  rock: INK,
  ghost: BONE,
  dragon: BONE,
  dark: BONE,
  steel: INK,
  fairy: INK,
}

export function typeChipStyle(type: string): { backgroundColor: string; color: string } {
  return {
    backgroundColor: TYPE_COLORS[type] ?? '#999',
    color: TYPE_FOREGROUNDS[type] ?? INK,
  }
}
