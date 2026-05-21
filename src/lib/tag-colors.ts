export const TAG_COLOR_PALETTE = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#84cc16',
  '#10b981',
  '#f59e0b',
  '#0ea5e9',
] as const

const INK = 'oklch(0.18 0.01 25)'
const BONE = 'oklch(0.985 0.005 25)'

// Each palette color paired with the foreground that reads best on it. Red,
// blue, indigo, violet, purple (saturated cools) take BONE; the rest take INK.
// Tag colors are user-curated from this fixed palette, so static pairing is OK.
const TAG_FOREGROUNDS: Record<string, string> = {
  '#ef4444': BONE,
  '#f97316': INK,
  '#eab308': INK,
  '#22c55e': INK,
  '#14b8a6': INK,
  '#06b6d4': INK,
  '#3b82f6': BONE,
  '#6366f1': BONE,
  '#8b5cf6': BONE,
  '#a855f7': BONE,
  '#d946ef': INK,
  '#ec4899': INK,
  '#84cc16': INK,
  '#10b981': INK,
  '#f59e0b': INK,
  '#0ea5e9': INK,
}

export function tagForeground(color: string): string {
  return TAG_FOREGROUNDS[color] ?? INK
}
