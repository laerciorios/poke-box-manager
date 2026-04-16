'use client'

import { useTranslations } from 'next-intl'
import { useShallow } from 'zustand/react/shallow'
import { Archive } from 'lucide-react'

import { useSettingsStore } from '@/stores/useSettingsStore'
import { computeFilteredTotal, computeBoxCount } from '@/lib/variation-counts'
import { BOX_SIZE } from '@/types/box'

export function BoxCalculatorCard() {
  const t = useTranslations('BoxCalculator')
  const { variations, activeGenerations, locale } = useSettingsStore(
    useShallow((s) => ({
      variations: s.variations,
      activeGenerations: s.activeGenerations,
      locale: s.locale,
    })),
  )

  const pokemonCount = computeFilteredTotal(variations, activeGenerations)
  const { boxes, lastBoxSlots, emptySlots } = computeBoxCount(pokemonCount)

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en').format(n)

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Archive className="size-4 shrink-0" />
        <span className="text-xs font-medium uppercase tracking-wide">{t('boxesNeeded')}</span>
      </div>

      <p className="text-4xl font-bold tabular-nums">{fmt(boxes)}</p>

      <p className="text-sm text-muted-foreground">
        {t('pokemonPerBox', { count: fmt(pokemonCount), perBox: BOX_SIZE })}
      </p>

      {emptySlots > 0 && (
        <p className="text-xs text-muted-foreground">
          {t('lastBoxDetail', { slots: lastBoxSlots, total: BOX_SIZE })}
        </p>
      )}

      <p className="text-xs text-muted-foreground/60 mt-1">{t('basedOnSettings')}</p>
    </div>
  )
}
