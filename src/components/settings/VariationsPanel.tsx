'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { VariationToggles } from '@/types/settings'
import { Switch } from '@/components/ui/switch'
import {
  VARIATION_COUNTS,
  BASE_POKEMON_COUNT,
  computeFilteredTotal,
} from '@/lib/variation-counts'

const TOGGLE_KEYS: (keyof VariationToggles)[] = [
  'regionalForms',
  'genderForms',
  'unownLetters',
  'vivillonPatterns',
  'alcremieVariations',
  'colorVariations',
  'sizeVariations',
  'megaEvolutions',
  'gmaxForms',
  'battleForms',
  'originForms',
  'costumedPokemon',
]

export function VariationsPanel() {
  const t = useTranslations('Settings.variations')
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const setVariation = useSettingsStore((s) => s.setVariation)

  const total = computeFilteredTotal(variations, activeGenerations)
  const extra = total - BASE_POKEMON_COUNT

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/40 p-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            {t('total')}
          </p>
          <p className="font-display text-2xl font-semibold tabular-nums">{total.toLocaleString()}</p>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] tabular-nums text-right max-w-[12rem]">
          {t('totalHint', { base: BASE_POKEMON_COUNT, variations: extra })}
        </p>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {TOGGLE_KEYS.map((key) => (
          <li key={key} className="flex items-center gap-3 py-2.5">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium block" htmlFor={`variation-${key}`}>
                {t(key)}
              </label>
              <p className="text-xs text-[var(--muted-foreground)]">{t(`${key}Hint`)}</p>
            </div>
            <span className="text-[11px] font-mono text-[var(--muted-foreground)] tabular-nums w-12 text-right">
              +{VARIATION_COUNTS[key]}
            </span>
            <Switch
              id={`variation-${key}`}
              checked={variations[key]}
              onChange={(value) => setVariation(key, value)}
              aria-label={t(key)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
