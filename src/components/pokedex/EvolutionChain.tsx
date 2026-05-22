'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import type { PokemonEntry } from '@/types/pokemon'
import type { EvolutionChain as EvolutionChainData, EvolutionStep } from '@/types/game'
import type { Locale } from '@/types/locale'
import { Sprite } from '@/components/pokemon/Sprite'
import { getPokemonName } from '@/lib/pokemon-names'
import { getEvolutionMethodLabel } from '@/lib/evolution-method-label'
import { cn } from '@/lib/utils'

interface Props {
  chain: EvolutionChainData
  highlightId: number
  locale: Locale
  pokemonIndex: Map<number, PokemonEntry>
}

type Edge = { fromId: number; toId: number; methods: EvolutionStep['method'][] }

type ArrowSpec = {
  key: string
  fromId: number
  toId: number
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * Renders an evolution chain as a tree of cards connected by SVG arrows.
 *
 * Layout strategy:
 *   1. Group steps by (fromId, toId) so duplicate destinations collapse into
 *      one edge with a list of alternative methods (e.g. Leafeon via Mossy
 *      Rock OR Leaf Stone).
 *   2. Compute the depth of each Pokémon via BFS from the chain roots with
 *      longest-path semantics, so convergent nodes (Leafeon, Glaceon) land
 *      past their pre-evolutions.
 *   3. Render one HTML column per depth. Inside each column, each non-root
 *      node carries its own "via X" method chip directly above its card.
 *      Anchoring the chip to the destination (instead of floating it on the
 *      arrow midpoint) keeps labels from piling up in the gap between
 *      columns — critical for high-fanout chains like Eevee (8 evolutions
 *      from one source).
 *   4. After mount, measure each card's bounding box and overlay an SVG
 *      layer with cubic-Bézier arrows that bend horizontally between
 *      columns. The arrows carry no text — the method chip above each
 *      destination card already names the trigger.
 *
 * The whole component sits inside an `overflow-x-auto` shell so wide chains
 * scroll horizontally on phones instead of squishing.
 */
export function EvolutionChain({ chain, highlightId, locale, pokemonIndex }: Props) {
  const t = useTranslations('Pokedex.details')

  // 1. Group steps by (from, to). When the chain has no steps (single-stage
  //    Pokémon), `edges` is empty and we render the lone node further down.
  const edges = React.useMemo(() => buildEdges(chain.steps), [chain.steps])

  // 2. Index incoming edges per destination so each card knows the method(s)
  //    used to reach it.
  const incomingByTo = React.useMemo(() => {
    const m = new Map<number, Edge[]>()
    for (const e of edges) {
      const list = m.get(e.toId) ?? []
      list.push(e)
      m.set(e.toId, list)
    }
    return m
  }, [edges])

  // 3. Compute columns from depth.
  const { columns } = React.useMemo(
    () => computeColumns(chain.pokemonIds, edges),
    [chain.pokemonIds, edges],
  )

  // Refs to each card for arrow measurement.
  const containerRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)
  const nodeRefs = React.useRef<Map<number, HTMLDivElement | null>>(new Map())
  const [arrows, setArrows] = React.useState<ArrowSpec[]>([])
  const [size, setSize] = React.useState({ w: 0, h: 0 })

  const recompute = React.useCallback(() => {
    const inner = innerRef.current
    if (!inner) return
    const base = inner.getBoundingClientRect()
    const out: ArrowSpec[] = []
    for (const edge of edges) {
      const fromEl = nodeRefs.current.get(edge.fromId)
      const toEl = nodeRefs.current.get(edge.toId)
      if (!fromEl || !toEl) continue
      const f = fromEl.getBoundingClientRect()
      const tr = toEl.getBoundingClientRect()
      out.push({
        key: `${edge.fromId}->${edge.toId}`,
        fromId: edge.fromId,
        toId: edge.toId,
        x1: f.right - base.left,
        y1: f.top + f.height / 2 - base.top,
        x2: tr.left - base.left,
        y2: tr.top + tr.height / 2 - base.top,
      })
    }
    setArrows(out)
    setSize({ w: inner.scrollWidth, h: inner.scrollHeight })
  }, [edges])

  React.useLayoutEffect(() => {
    recompute()
    const inner = innerRef.current
    if (!inner) return
    const ro = new ResizeObserver(() => recompute())
    ro.observe(inner)
    return () => ro.disconnect()
  }, [recompute])

  // Single-stage Pokémon: just center the one node.
  if (chain.steps.length === 0) {
    const only = pokemonIndex.get(chain.pokemonIds[0])
    if (!only) return null
    return (
      <div className="flex justify-center py-2">
        <EvolutionNode entry={only} highlight={only.id === highlightId} locale={locale} />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="overflow-x-auto -mx-1 px-1 pb-1">
      <div
        ref={innerRef}
        className="relative inline-flex items-stretch gap-10 sm:gap-14 min-w-full py-3"
      >
        <svg
          className="absolute inset-0 pointer-events-none text-[var(--border-strong)]"
          width={size.w || '100%'}
          height={size.h || '100%'}
          aria-hidden
        >
          <defs>
            <marker
              id="evo-arrow-head"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {arrows.map((a) => {
            const dx = Math.max(20, (a.x2 - a.x1) * 0.55)
            const c1x = a.x1 + dx
            const c2x = a.x2 - dx
            return (
              <path
                key={a.key}
                d={`M ${a.x1} ${a.y1} C ${c1x} ${a.y1}, ${c2x} ${a.y2}, ${a.x2} ${a.y2}`}
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
                markerEnd="url(#evo-arrow-head)"
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {columns.map((column, colIdx) => (
          <div
            key={colIdx}
            className="relative flex flex-col gap-6 min-w-[128px] justify-center"
          >
            {column.map((id) => {
              const entry = pokemonIndex.get(id)
              if (!entry) return null
              const incoming = incomingByTo.get(id) ?? []
              return (
                <div key={id} className="flex flex-col items-center gap-1.5">
                  {colIdx > 0 && incoming.length > 0 && (
                    <MethodChipStack
                      edges={incoming}
                      locale={locale}
                      orJoin={t('orJoin')}
                    />
                  )}
                  <div
                    ref={(el) => {
                      nodeRefs.current.set(id, el)
                    }}
                    className="relative z-10"
                  >
                    <EvolutionNode
                      entry={entry}
                      highlight={entry.id === highlightId}
                      locale={locale}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function buildEdges(steps: EvolutionStep[]): Edge[] {
  const map = new Map<string, Edge>()
  for (const step of steps) {
    const key = `${step.fromId}->${step.toId}`
    const existing = map.get(key)
    if (existing) existing.methods.push(step.method)
    else map.set(key, { fromId: step.fromId, toId: step.toId, methods: [step.method] })
  }
  return Array.from(map.values())
}

function computeColumns(
  pokemonIds: number[],
  edges: Edge[],
): { columns: number[][] } {
  const inDegree = new Map<number, number>()
  for (const id of pokemonIds) inDegree.set(id, 0)
  for (const edge of edges) {
    inDegree.set(edge.toId, (inDegree.get(edge.toId) ?? 0) + 1)
  }
  const roots = pokemonIds.filter((id) => (inDegree.get(id) ?? 0) === 0)

  const depth = new Map<number, number>()
  const queue: number[] = []
  for (const r of roots) {
    depth.set(r, 0)
    queue.push(r)
  }
  while (queue.length > 0) {
    const node = queue.shift()!
    const nodeDepth = depth.get(node)!
    for (const edge of edges) {
      if (edge.fromId !== node) continue
      const nextDepth = nodeDepth + 1
      const existingDepth = depth.get(edge.toId)
      if (existingDepth === undefined || nextDepth > existingDepth) {
        depth.set(edge.toId, nextDepth)
        queue.push(edge.toId)
      }
    }
  }

  const maxDepth = Math.max(0, ...Array.from(depth.values()))
  const columns: number[][] = Array.from({ length: maxDepth + 1 }, () => [])
  for (const id of pokemonIds) {
    const d = depth.get(id) ?? 0
    columns[d]?.push(id)
  }
  return { columns }
}

function EvolutionNode({
  entry,
  highlight,
  locale,
}: {
  entry: PokemonEntry
  highlight: boolean
  locale: Locale
}) {
  return (
    <div
      className={cn(
        'rounded-(--radius-lg) border bg-[var(--card)] px-2.5 py-2 text-center min-w-[112px] shadow-sm',
        highlight
          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/40 bg-[var(--accent-soft)]'
          : 'border-[var(--border)]',
      )}
    >
      <Sprite src={entry.sprite} alt={entry.name} size={56} className="mx-auto" />
      <p className="text-[11px] font-mono text-[var(--muted-foreground)] mt-0.5">
        #{String(entry.id).padStart(4, '0')}
      </p>
      <p className="text-[12px] font-medium leading-tight truncate">
        {getPokemonName(entry, locale)}
      </p>
    </div>
  )
}

/**
 * Stack of method chips rendered above a destination card. When a single
 * edge carries multiple alternative methods (Leafeon: Mossy Rock OR Leaf
 * Stone), they appear stacked with an "OU" separator. Multiple incoming
 * edges (rare — would mean a Pokémon has more than one possible parent
 * species) flatten into the same stack.
 */
function MethodChipStack({
  edges,
  locale,
  orJoin,
}: {
  edges: Edge[]
  locale: Locale
  orJoin: string
}) {
  const labels = edges.flatMap((e) =>
    e.methods.map((m) => getEvolutionMethodLabel(m, locale)),
  )
  return (
    <div className="flex flex-col items-center gap-0.5 max-w-[140px]">
      {labels.map((label, i) => (
        <React.Fragment key={`${label}-${i}`}>
          {i > 0 && (
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]/70">
              {orJoin}
            </span>
          )}
          <span className="rounded-(--radius-pill) border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] leading-tight shadow-[0_1px_2px_rgba(0,0,0,0.06)] max-w-full text-center break-words">
            {label}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
