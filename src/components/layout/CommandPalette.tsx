'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { getPokemonName } from '@/lib/pokemon-names'

const ALL_POKEMON = pokemonData as PokemonEntry[]

const PokedexDetails = dynamic(
  () => import('@/components/pokedex/PokedexDetails').then((m) => m.PokedexDetails),
  { ssr: false },
)

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * Minimal Cmd+K palette. Filters the full Pokédex by name/number and opens
 * `PokedexDetails` on select. Intentionally narrow scope — not a "go to any
 * page" launcher, just a fast way to find a species without leaving the
 * current route.
 */
export function CommandPalette({ open, onClose }: Props) {
  const t = useTranslations('CommandPalette')
  const locale = useSettingsStore((s) => s.locale)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const registered = usePokedexStore((s) => s.registered)
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState<PokemonEntry | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) setQuery('')
  }, [open])

  // Focus the input when the dialog mounts.
  React.useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => window.clearTimeout(id)
  }, [open])

  const registeredSet = React.useMemo(() => new Set(registered), [registered])
  const activeGenSet = React.useMemo(() => new Set(activeGenerations), [activeGenerations])

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as PokemonEntry[]
    const isNumeric = /^#?\d+$/.test(q)
    const num = isNumeric ? Number(q.replace('#', '')) : null
    const out: PokemonEntry[] = []
    for (const p of ALL_POKEMON) {
      if (!activeGenSet.has(p.generation)) continue
      if (num !== null) {
        if (p.id === num) out.push(p)
      } else {
        const localized = getPokemonName(p, locale).toLowerCase()
        if (p.name.toLowerCase().includes(q) || localized.includes(q)) {
          out.push(p)
        }
      }
      if (out.length >= 20) break
    }
    return out
  }, [query, locale, activeGenSet])

  const handleSelect = (pokemon: PokemonEntry) => {
    setSelected(pokemon)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} size="md" title={t('title')}>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)] pointer-events-none" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              className="pl-9 h-11"
            />
          </div>

          {query.trim() && (
            <ul className="max-h-[50vh] overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">
                  {t('noResults')}
                </li>
              ) : (
                results.map((p) => {
                  const reg = registeredSet.has(String(p.id))
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(p)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-left hover:bg-[var(--surface-2)] focus-visible:bg-[var(--surface-2)] focus-visible:outline-none"
                      >
                        <Sprite src={p.sprite} alt={p.name} size={40} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                              #{String(p.id).padStart(4, '0')}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {getPokemonName(p, locale)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.types.filter(Boolean).map((tt) => (
                              <TypeChip key={tt as string} type={tt as string} />
                            ))}
                          </div>
                        </div>
                        {reg && (
                          <span
                            className="size-1.5 rounded-full bg-[var(--registered)] shrink-0"
                            aria-label={t('registered')}
                          />
                        )}
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          )}
        </div>
      </Dialog>

      <PokedexDetails pokemon={selected} onClose={() => setSelected(null)} />
    </>
  )
}
