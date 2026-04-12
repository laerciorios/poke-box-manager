function getTrigrams(s: string): Set<string> {
  const padded = `  ${s} `
  const trigrams = new Set<string>()
  for (let i = 0; i < padded.length - 2; i++) {
    trigrams.add(padded.slice(i, i + 3))
  }
  return trigrams
}

/**
 * Sørensen–Dice coefficient on character trigrams.
 * Returns a score in [0, 1] where 1 is identical.
 */
export function trigramScore(a: string, b: string): number {
  if (a === b) return 1
  if (a.length < 1 || b.length < 1) return 0

  const triA = getTrigrams(a)
  const triB = getTrigrams(b)

  let intersection = 0
  for (const t of triA) {
    if (triB.has(t)) intersection++
  }

  return (2 * intersection) / (triA.size + triB.size)
}
