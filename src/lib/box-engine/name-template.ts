export interface BoxNameContext {
  n: number
  total: number
  start: number
  end: number
  gen?: number
  type?: string
  region?: string
}

function pad3(n: number): string {
  return String(n).padStart(3, '0')
}

export function renderBoxName(
  template: string,
  context: Partial<BoxNameContext>,
): string {
  return template
    .replace(/{n}/g, context.n !== undefined ? String(context.n) : '{n}')
    .replace(/{total}/g, context.total !== undefined ? String(context.total) : '{total}')
    .replace(/{start}/g, context.start !== undefined ? pad3(context.start) : '{start}')
    .replace(/{end}/g, context.end !== undefined ? pad3(context.end) : '{end}')
    .replace(/{gen}/g, context.gen !== undefined ? String(context.gen) : '{gen}')
    .replace(/{type}/g, context.type !== undefined ? context.type : '{type}')
    .replace(/{region}/g, context.region !== undefined ? context.region : '{region}')
}
