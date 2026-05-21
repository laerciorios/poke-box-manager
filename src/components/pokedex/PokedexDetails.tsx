'use client'

import { useTranslations } from 'next-intl'
import { Sparkles, Check } from 'lucide-react'
import type { PokemonEntry } from '@/types/pokemon'
import { Dialog } from '@/components/ui/dialog'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'
import { getEvolutionMethodLabel } from '@/lib/evolution-method-label'
import evolutionChains from '@/data/evolution-chains.json'
import pokemonData from '@/data/pokemon.json'
import type { EvolutionChain, EvolutionStep } from '@/types/game'
import type { Locale } from '@/types/locale'
import { cn } from '@/lib/utils'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

const CHAINS = evolutionChains as unknown as Record<string, EvolutionChain>

interface Props {
  pokemon: PokemonEntry | null
  onClose: () => void
}

export function PokedexDetails({ pokemon, onClose }: Props) {
  const t = useTranslations('Pokedex.details')
  const tForms = useTranslations('Pokedex.formTypes')
  const locale = useSettingsStore((s) => s.locale)
  const shinyEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)

  if (!pokemon) return null

  const chain = pokemon.evolutionChainId ? CHAINS[String(pokemon.evolutionChainId)] : undefined

  const registered = isRegistered(pokemon.id)

  return (
    <Dialog
      open={!!pokemon}
      onClose={onClose}
      size="lg"
      title={getPokemonName(pokemon, locale)}
      description={
        <span className="font-mono">
          #{String(pokemon.id).padStart(4, '0')} · {t('generation', { n: pokemon.generation })}
        </span>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-3">
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
              <Sprite src={pokemon.sprite} alt={pokemon.name} size={112} />
            </div>
            {shinyEnabled && (
              <div className="rounded-md border border-[var(--shiny)]/40 bg-[var(--shiny-soft)] p-3 relative">
                <Sparkles className="absolute top-1.5 left-1.5 size-3 text-[var(--shiny)]" />
                <Sprite
                  src={pokemon.sprite}
                  shiny
                  alt={`${pokemon.name} shiny`}
                  size={112}
                />
                <p className="text-[10px] mt-1 text-center text-[var(--shiny-foreground)] uppercase tracking-wider font-semibold">
                  {t('shinySide')}
                </p>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap gap-1.5">
              {pokemon.types.filter(Boolean).map((type) => (
                <TypeChip key={type as string} type={type as string} />
              ))}
            </div>
            <Button
              variant={registered ? 'outline' : 'accent'}
              onClick={() => toggleRegistered(pokemon.id)}
            >
              <Check className="size-3.5" />
              {registered ? t('unregister') : t('register')}
            </Button>
          </div>
        </div>

        <Section title={t('forms')}>
          {pokemon.forms.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">{t('noForms')}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pokemon.forms.map((form) => {
                const formReg = isRegistered(pokemon.id, form.id)
                return (
                  <li
                    key={form.id}
                    className={cn(
                      'rounded-md border bg-[var(--card)] p-2.5 flex flex-col items-center gap-1.5',
                      formReg
                        ? 'border-[var(--registered)]/40 bg-[var(--registered-soft)]'
                        : 'border-[var(--border)]',
                    )}
                  >
                    <Sprite src={form.sprite} alt={form.name} size={48} />
                    <p className="text-xs font-medium text-center truncate w-full">
                      {getFormName(form, locale)}
                    </p>
                    <Badge variant="outline" className="text-[9px]">
                      {tForms(form.formType)}
                    </Badge>
                    <Button
                      size="sm"
                      variant={formReg ? 'outline' : 'accent'}
                      onClick={() => toggleRegistered(pokemon.id, form.id)}
                      className="h-7 px-2 text-[11px] w-full"
                    >
                      {formReg ? t('unregister') : t('register')}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        <Section title={t('evolution')}>
          {!chain ? (
            <p className="text-sm text-[var(--muted-foreground)]">{t('noEvolution')}</p>
          ) : (
            <EvolutionLine chain={chain} highlightId={pokemon.id} locale={locale} />
          )}
        </Section>
      </div>
    </Dialog>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
        {title}
      </p>
      {children}
    </div>
  )
}

/**
 * Renders an evolution chain as a tiered tree.
 *
 * Why a tree (and not a single horizontal line):
 * - Eevee has 8 parallel evolutions — drawing them in one row treats them as
 *   sequential, which they aren't.
 * - Pokémon like Leafeon / Glaceon have multiple alternative methods to
 *   reach the same destination (location-based vs. stone-based). Each
 *   destination must appear once, with its methods grouped as alternatives.
 *
 * Strategy:
 * 1. Group all steps by (fromId, toId) so duplicate destinations become one
 *    edge carrying a list of methods (joined with "OU").
 * 2. BFS from the chain root to compute each Pokémon's depth — that becomes
 *    its column.
 * 3. Render one column per depth level. Inside each non-root column, every
 *    node carries its incoming method labels right above the card, so the
 *    edge is implicit (top label = "how to get here").
 */
function EvolutionLine({
  chain,
  highlightId,
  locale,
}: {
  chain: EvolutionChain
  highlightId: number
  locale: Locale
}) {
  const t = useTranslations('Pokedex.details')

  // No edges → single-stage Pokémon. Just render it centered.
  if (chain.steps.length === 0) {
    const only = POKEMON_INDEX.get(chain.pokemonIds[0])
    if (!only) return null
    return (
      <div className="flex justify-center">
        <EvolutionNode entry={only} highlight={only.id === highlightId} locale={locale} />
      </div>
    )
  }

  // 1. Group steps by (fromId, toId).
  type Edge = { fromId: number; toId: number; methods: EvolutionStep['method'][] }
  const edgeKey = (from: number, to: number) => `${from}->${to}`
  const edgeMap = new Map<string, Edge>()
  for (const step of chain.steps) {
    const key = edgeKey(step.fromId, step.toId)
    const existing = edgeMap.get(key)
    if (existing) existing.methods.push(step.method)
    else edgeMap.set(key, { fromId: step.fromId, toId: step.toId, methods: [step.method] })
  }
  const edges = Array.from(edgeMap.values())

  // 2. Compute depth (level) of each Pokémon via BFS from roots.
  // A root is any Pokémon that never appears as a `toId`.
  const inDegree = new Map<number, number>()
  for (const id of chain.pokemonIds) inDegree.set(id, 0)
  for (const edge of edges) {
    inDegree.set(edge.toId, (inDegree.get(edge.toId) ?? 0) + 1)
  }
  const roots = chain.pokemonIds.filter((id) => (inDegree.get(id) ?? 0) === 0)

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

  // Group Pokémon by depth column.
  const maxDepth = Math.max(0, ...Array.from(depth.values()))
  const columns: number[][] = Array.from({ length: maxDepth + 1 }, () => [])
  for (const id of chain.pokemonIds) {
    const d = depth.get(id) ?? 0
    columns[d]?.push(id)
  }

  // Index edges by destination so we can render the incoming methods above
  // each non-root node.
  const incoming = new Map<number, Edge[]>()
  for (const edge of edges) {
    const list = incoming.get(edge.toId) ?? []
    list.push(edge)
    incoming.set(edge.toId, list)
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="inline-flex items-stretch gap-3 sm:gap-5 min-w-full">
        {columns.map((column, colIdx) => (
          <div
            key={colIdx}
            className={cn(
              'flex flex-col gap-3 min-w-[120px]',
              colIdx === 0 ? 'justify-center' : 'justify-start',
            )}
          >
            {column.map((id) => {
              const entry = POKEMON_INDEX.get(id)
              if (!entry) return null
              const inEdges = incoming.get(id) ?? []
              return (
                <div key={id} className="flex flex-col items-stretch gap-1.5">
                  {colIdx > 0 && inEdges.length > 0 && (
                    <MethodPills edges={inEdges} locale={locale} orJoin={t('orJoin')} />
                  )}
                  <EvolutionNode
                    entry={entry}
                    highlight={entry.id === highlightId}
                    locale={locale}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function MethodPills({
  edges,
  locale,
  orJoin,
}: {
  edges: { fromId: number; methods: EvolutionStep['method'][] }[]
  locale: Locale
  orJoin: string
}) {
  // Flatten all methods across edges. Within a column we typically only
  // have one source (one parent), so this is usually one edge's methods.
  const labels = edges.flatMap((e) => e.methods.map((m) => getEvolutionMethodLabel(m, locale)))

  return (
    <div className="flex flex-wrap items-center gap-1 justify-center">
      {labels.map((label, i) => (
        <span key={`${label}-${i}`} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]/70">
              {orJoin}
            </span>
          )}
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)]/60 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] leading-tight">
            {label}
          </span>
        </span>
      ))}
    </div>
  )
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
        'rounded-md border bg-[var(--card)] p-2 text-center min-w-[110px]',
        highlight
          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/40'
          : 'border-[var(--border)]',
      )}
    >
      <Sprite src={entry.sprite} alt={entry.name} size={48} className="mx-auto" />
      <p className="text-[11px] font-medium mt-1 truncate">{getPokemonName(entry, locale)}</p>
    </div>
  )
}
