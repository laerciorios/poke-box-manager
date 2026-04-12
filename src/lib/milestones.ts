export interface Milestone {
  threshold: number
  reached: boolean
}

export function getMilestones(percentage: number): Milestone[] {
  return [25, 50, 75, 90, 100].map((t) => ({ threshold: t, reached: percentage >= t }))
}
