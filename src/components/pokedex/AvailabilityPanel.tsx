'use client'

import { useTranslations } from 'next-intl'
import { Gift, AlertCircle, HelpCircle } from 'lucide-react'
import {
  getAvailability,
  getFormAvailability,
  hasFormOverride,
  groupGamesByGeneration,
  hasRestrictedDexGames,
  filterToSwitchEra,
} from '@/lib/availability'
import { GameBadge } from './GameBadge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getFormName } from '@/lib/pokemon-names'
import type { PokemonForm } from '@/types/pokemon'

interface Props {
  pokemonId: number
  forms?: PokemonForm[]
  className?: string
}

/**
 * Lists the games where the species can be obtained, plus any forms whose
 * availability differs from the parent species (e.g. Tauros Blaze Breed is
 * Scarlet-only while the species sits across multiple games).
 *
 * Data source: `availability-overrides.json` (schema v3). The resolver returns
 * an absolute list of curated games; no defaults are inferred, so species
 * with no curated data render an "uncurated" hint.
 */
export function AvailabilityPanel({ pokemonId, forms = [], className }: Props) {
  const t = useTranslations('Pokedex.availability')
  const locale = useSettingsStore((s) => s.locale)
  const switchOnly = useSettingsStore((s) => s.availabilitySwitchOnly)
  const rawResolved = getAvailability(pokemonId)
  const resolved = switchOnly
    ? { ...rawResolved, games: filterToSwitchEra(rawResolved.games) }
    : rawResolved

  // Forms whose availability differs from the species.
  const formsWithOverrides = forms.filter((f) => hasFormOverride(pokemonId, f.id))

  // Hint when the filter actively trimmed the list.
  const filtered = switchOnly && rawResolved.games.length > resolved.games.length

  if (resolved.isUncurated && !resolved.isEvent) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
          <HelpCircle className="size-4 shrink-0 text-[var(--muted-foreground)] mt-0.5" />
          <div className="text-xs">
            <p className="font-medium text-[var(--foreground)]">{t('uncuratedTitle')}</p>
            <p className="text-[var(--muted-foreground)] mt-0.5 leading-snug">
              {t('uncuratedDescription')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <SpeciesAvailability resolved={resolved} t={t} />
      {filtered && (
        <p className="text-[10px] text-[var(--muted-foreground)] italic">
          {t('switchOnlyFilteredHint')}
        </p>
      )}
      {formsWithOverrides.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
            {t('formsHeading')}
          </p>
          <ul className="space-y-2">
            {formsWithOverrides.map((form) => {
              const rawForm = getFormAvailability(pokemonId, form.id)
              const formResolved = switchOnly
                ? { ...rawForm, games: filterToSwitchEra(rawForm.games) }
                : rawForm
              const groups = groupGamesByGeneration(formResolved.games)
              return (
                <li
                  key={form.id}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/30 p-2.5"
                >
                  <p className="text-xs font-medium mb-1.5">{getFormName(form, locale)}</p>
                  {formResolved.games.length === 0 && formResolved.isEvent ? (
                    <Badge variant="outline" className="text-[10px]">
                      <Gift className="size-3 mr-1" />
                      {t('eventBadge')}
                    </Badge>
                  ) : formResolved.games.length === 0 ? (
                    <p className="text-[11px] text-[var(--muted-foreground)]">{t('empty')}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {groups.flatMap((group) => [...group.main, ...group.dlc]).map((g) => (
                        <GameBadge key={g.id} game={g} size="sm" />
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function SpeciesAvailability({
  resolved,
  t,
}: {
  resolved: ReturnType<typeof getAvailability>
  t: ReturnType<typeof useTranslations<'Pokedex.availability'>>
}) {
  const groups = groupGamesByGeneration(resolved.games)
  const hasRestricted = hasRestrictedDexGames(resolved.games)

  if (resolved.games.length === 0 && !resolved.isEvent) {
    return <p className="text-sm text-[var(--muted-foreground)]">{t('empty')}</p>
  }

  return (
    <>
      {resolved.isEvent && (
        <div className="flex items-start gap-2 rounded-md border border-[var(--warning)]/30 bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-3">
          <Gift className="size-4 shrink-0 text-[var(--warning)] mt-0.5" />
          <div className="text-xs text-[var(--foreground)]">
            <p className="font-medium">{t('eventTitle')}</p>
            <p className="text-[var(--muted-foreground)] mt-0.5">{t('eventDescription')}</p>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">{t('noRegular')}</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.generation}>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
                {t('genLabel', { n: group.generation })}
              </p>
              {group.main.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {group.main.map((game) => (
                    <GameBadge key={game.id} game={game} size="md" />
                  ))}
                </div>
              )}
              {group.dlc.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-[var(--border)] flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Badge variant="outline" className="text-[9px]">
                    {t('dlcLabel')}
                  </Badge>
                  {group.dlc.map((game) => (
                    <GameBadge key={game.id} game={game} size="md" />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasRestricted && (
        <div className="flex items-start gap-2 text-[11px] text-[var(--muted-foreground)]">
          <AlertCircle className="size-3 shrink-0 mt-0.5" />
          <p className="leading-snug">{t('restrictedDexHint')}</p>
        </div>
      )}
    </>
  )
}
