'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { PokedexRow as Row } from '@/lib/pokedex-filters'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  row: Row
  registered: boolean
  onToggle: () => void
  onOpenDetails: () => void
}

export function PokedexTableRow({ row, registered, onToggle, onOpenDetails }: Props) {
  const t = useTranslations('Pokedex')
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 border-b border-[var(--border)]/60 hover:bg-[var(--surface-2)]/50 transition-colors h-14',
        row.isFormRow && 'pl-10 bg-[var(--surface-2)]/30',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={registered}
        aria-label={registered ? t('details.unregister') : t('details.register')}
        className={cn(
          'size-5 rounded-full grid place-items-center shrink-0 transition-colors',
          registered
            ? 'bg-[var(--registered)] text-[var(--registered-foreground)]'
            : 'border border-[var(--border-strong)] hover:bg-[var(--surface-2)] text-transparent',
        )}
      >
        <Check className="size-3" strokeWidth={3} aria-hidden />
      </button>
      <button
        type="button"
        onClick={onOpenDetails}
        className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-md focus-visible:ring-2 focus-visible:ring-(--ring)"
      >
        <Sprite src={row.sprite} alt={row.name} size={36} className="shrink-0" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] tabular-nums shrink-0">
            #{String(row.pokemon.id).padStart(4, '0')}
          </span>
          <span className="text-sm font-medium truncate">{row.name}</span>
          {row.isFormRow && row.form && (
            <Badge variant="outline" className="hidden md:inline-flex shrink-0">
              {row.form.formType}
            </Badge>
          )}
        </div>
        <div className="hidden sm:flex gap-1 shrink-0">
          {row.types.map((type) => (
            <TypeChip key={type} type={type} />
          ))}
        </div>
        <span className="text-[10px] text-[var(--muted-foreground)] font-mono shrink-0 hidden md:inline">
          {t('details.generation', { n: row.generation })}
        </span>
      </button>
    </div>
  )
}

export function PokedexGridCard({ row, registered, onToggle, onOpenDetails }: Props) {
  const t = useTranslations('Pokedex')
  return (
    // Two independent buttons inside a passive wrapper: the toggle (top-right
    // pill) and an absolutely-positioned card-wide button that opens details.
    // Avoids the nested-<button> HTML that Lighthouse and a11y validators flag.
    <div
      className={cn(
        'group relative w-full rounded-(--radius-lg) border bg-[var(--card)] p-3 text-left transition-all duration-150 lift',
        registered
          ? 'border-[var(--registered)]/40 bg-[var(--registered-soft)]'
          : 'border-[var(--border)]',
      )}
    >
      <button
        type="button"
        onClick={onOpenDetails}
        aria-label={t('details.open')}
        className="absolute inset-0 rounded-(--radius-lg) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      />
      <div className="relative pointer-events-none flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] tabular-nums">
          #{String(row.pokemon.id).padStart(4, '0')}
          {row.isFormRow && row.form && <span className="ml-1">·{row.form.formType}</span>}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          aria-pressed={registered}
          aria-label={registered ? t('details.unregister') : t('details.register')}
          className={cn(
            'pointer-events-auto relative z-10 size-5 rounded-full grid place-items-center shrink-0 transition-colors',
            registered
              ? 'bg-[var(--registered)] text-[var(--registered-foreground)]'
              : 'border border-[var(--border-strong)] hover:bg-[var(--surface-2)] text-transparent',
          )}
        >
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </button>
      </div>
      <div className="pointer-events-none">
        <Sprite src={row.sprite} alt={row.name} size={80} className="mx-auto" />
        <p className="mt-2 text-sm font-medium text-center truncate">{row.name}</p>
        <div className="mt-1.5 flex gap-1 justify-center">
          {row.types.map((type) => (
            <TypeChip key={type} type={type} />
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-[var(--muted-foreground)] font-mono text-center">
          {t('details.generation', { n: row.generation })}
        </p>
      </div>
    </div>
  )
}
