'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Search, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonName } from '@/lib/pokemon-names'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/motion'
import { cn } from '@/lib/utils'

const ALL_POKEMON = pokemonData as PokemonEntry[]
const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function PokedexPage() {
  const t = useTranslations('Pokedex')
  const locale = useSettingsStore((s) => s.locale)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const registered = usePokedexStore((s) => s.registered)
  const reduce = useReducedMotion()

  const [query, setQuery] = React.useState('')
  const [activeGen, setActiveGen] = React.useState<number | 'all'>('all')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_POKEMON.filter((p) => {
      if (activeGen !== 'all' && p.generation !== activeGen) return false
      if (!q) return true
      if (/^#?\d+$/.test(q)) return p.id === Number(q.replace('#', ''))
      const name = getPokemonName(p, locale).toLowerCase()
      return name.includes(q) || p.name.toLowerCase().includes(q)
    })
  }, [query, activeGen, locale])

  const visible = filtered.slice(0, 240)
  const overflow = filtered.length - visible.length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t('subtitle', { count: registered.length, total: ALL_POKEMON.length })}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)] pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 -mb-1 md:flex-wrap">
            <Button
              size="sm"
              variant={activeGen === 'all' ? 'accent' : 'outline'}
              onClick={() => setActiveGen('all')}
            >
              {t('all')}
            </Button>
            {GENERATIONS.map((g) => (
              <Button
                key={g}
                size="sm"
                variant={activeGen === g ? 'accent' : 'outline'}
                onClick={() => setActiveGen(g)}
              >
                Gen {g}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        initial={reduce ? undefined : 'hidden'}
        animate={reduce ? undefined : 'show'}
        variants={
          reduce
            ? undefined
            : {
                hidden: {},
                show: { transition: { staggerChildren: 0.015 } },
              }
        }
      >
        {visible.map((p) => {
          const reg = isRegistered(p.id)
          return (
            <motion.li
              key={p.id}
              variants={
                reduce
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }
              }
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => toggleRegistered(p.id)}
                className={cn(
                  'group w-full rounded-(--radius-lg) border bg-[var(--card)] p-3 text-left transition-all duration-150 lift',
                  reg
                    ? 'border-[var(--registered)]/40 bg-[var(--registered-soft)]'
                    : 'border-[var(--border)]',
                )}
                aria-pressed={reg}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] tabular-nums">
                    #{String(p.id).padStart(4, '0')}
                  </span>
                  {reg ? (
                    <Badge variant="registered" className="gap-0.5">
                      <Check className="size-2.5" strokeWidth={3} />
                      {t('registered')}
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      Gen {p.generation}
                    </span>
                  )}
                </div>
                <Sprite src={p.sprite} alt={getPokemonName(p, locale)} size={80} className="mx-auto" />
                <p className="mt-2 text-sm font-medium text-center truncate">
                  {getPokemonName(p, locale)}
                </p>
                <div className="mt-1.5 flex gap-1 justify-center">
                  {p.types.filter(Boolean).map((type) => (
                    <TypeChip key={type} type={type as string} />
                  ))}
                </div>
              </button>
            </motion.li>
          )
        })}
      </motion.ul>

      {overflow > 0 && (
        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          {t('more', { count: overflow })}
        </p>
      )}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--muted-foreground)]">{t('empty')}</div>
      )}
    </div>
  )
}
