'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonName } from '@/lib/pokemon-names'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ALL_POKEMON = pokemonData as PokemonEntry[]

interface Props {
  open: boolean
  onClose: () => void
  onPick: (pokemon: PokemonEntry) => void
}

export function PokemonPicker({ open, onClose, onPick }: Props) {
  const t = useTranslations('Picker')
  const locale = useSettingsStore((s) => s.locale)
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  React.useEffect(() => {
    if (open) {
      setQuery('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_POKEMON.slice(0, 60)
    if (/^#?\d+$/.test(q)) {
      const id = Number(q.replace('#', ''))
      const match = ALL_POKEMON.find((p) => p.id === id)
      return match ? [match] : []
    }
    return ALL_POKEMON.filter((p) => {
      const name = getPokemonName(p, locale).toLowerCase()
      return name.includes(q) || p.name.toLowerCase().includes(q)
    }).slice(0, 120)
  }, [query, locale])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            className="fixed left-1/2 top-[10vh] -translate-x-1/2 z-50 w-[min(640px,92vw)] rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] overflow-hidden"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <Search className="size-4 text-[var(--muted-foreground)] shrink-0" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="border-0 shadow-none focus-visible:ring-0 h-9 px-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label={t('close')}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-sm text-[var(--muted-foreground)]">
                  {t('empty')}
                </div>
              ) : (
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                  {filtered.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onPick(p)
                          onClose()
                        }}
                        className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-[var(--surface-2)] text-left transition-colors"
                      >
                        <Sprite src={p.sprite} alt={getPokemonName(p, locale)} size={40} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-[var(--muted-foreground)] tabular-nums">
                            #{String(p.id).padStart(4, '0')}
                          </p>
                          <p className="text-sm font-medium truncate">
                            {getPokemonName(p, locale)}
                          </p>
                          <div className="flex gap-1 mt-0.5">
                            {p.types.filter(Boolean).map((type) => (
                              <TypeChip key={type} type={type as string} />
                            ))}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
