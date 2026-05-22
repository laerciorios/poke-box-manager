'use client'

import { useTranslations } from 'next-intl'
import { Gift, AlertCircle, HelpCircle, Plus } from 'lucide-react'
import {
  getAvailability,
  getFormAvailability,
  hasFormOverride,
  groupGamesByGeneration,
  hasRestrictedDexGames,
  filterToSwitchEra,
  getGame,
} from '@/lib/availability'
import { GameBadge } from './GameBadge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getFormName } from '@/lib/pokemon-names'
import type { GameEntry } from '@/types/availability'
import type { PokemonForm } from '@/types/pokemon'

interface Props {
  pokemonId: number
  forms?: PokemonForm[]
  className?: string
}

/**
 * Lists the games where the species can be obtained.
 *
 * Layout: one card per generation, with main games rendered as a logo row
 * and DLCs grouped underneath as a separate "Expansões" block whose entries
 * carry a small caption naming the base game(s) they attach to (via
 * `GameEntry.parentOf`). This keeps the linkage explicit instead of relying
 * on indentation alone.
 *
 * Per-form overrides (e.g. Tauros Paldea forms being Scarlet- or Violet-only)
 * render as a separate panel at the bottom.
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
        <div className="flex items-start gap-2 rounded-(--radius-lg) border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
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
              const allGames = groups.flatMap((g) => [...g.main, ...g.dlc])
              return (
                <li
                  key={form.id}
                  className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--surface-2)]/30 p-2.5"
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
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      {allGames.map((g) => (
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
        <div className="flex items-start gap-2 rounded-(--radius-lg) border border-[var(--warning)]/30 bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-3">
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
        <ul className="space-y-2.5">
          {groups.map((group) => (
            <li key={group.generation ?? 'spinoff'}>
              <GenerationCard group={group} t={t} />
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

/**
 * One bordered card per generation. Inside the card, main games sit in a
 * uniform logo row and DLCs land in a sub-block with a "+" glyph and a
 * caption indicating which base game(s) each DLC extends.
 */
function GenerationCard({
  group,
  t,
}: {
  group: { generation: number | null; main: GameEntry[]; dlc: GameEntry[] }
  t: ReturnType<typeof useTranslations<'Pokedex.availability'>>
}) {
  const total = group.main.length + group.dlc.length
  const label = group.generation === null ? t('spinoffLabel') : t('genLabel', { n: group.generation })

  return (
    <div className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--surface-2)]/30 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
          {label}
        </p>
        <span className="text-[10px] font-mono text-[var(--muted-foreground)]/80">
          {total}
        </span>
      </div>

      <div className="p-3 space-y-3">
        {group.main.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {group.main.map((game) => (
              <GameBadge key={game.id} game={game} size="md" />
            ))}
          </div>
        )}

        {group.dlc.length > 0 && (
          <div className="rounded-(--radius-md) border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Plus className="size-3 text-[var(--muted-foreground)]" />
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
                {t('dlcLabel')}
              </p>
            </div>
            <ul className="space-y-1.5">
              {group.dlc.map((dlc) => (
                <li
                  key={dlc.id}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1"
                >
                  <GameBadge game={dlc} size="sm" />
                  <DlcParentRef dlc={dlc} fallbackLabel={t('dlcLabel')} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Tiny caption next to a DLC chip indicating which base game(s) it extends.
 * Pulls from `GameEntry.parentOf` so the wording stays in sync with data.
 */
function DlcParentRef({ dlc, fallbackLabel }: { dlc: GameEntry; fallbackLabel: string }) {
  const parents = (dlc.parentOf ?? [])
    .map((id) => getGame(id))
    .filter((g): g is GameEntry => !!g)

  if (parents.length === 0) {
    return (
      <span className="text-[10px] text-[var(--muted-foreground)]/80">
        {fallbackLabel}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
      <svg
        viewBox="0 0 16 16"
        className="size-2.5 text-[var(--muted-foreground)]/70"
        aria-hidden
      >
        <path
          d="M2 4 L8 4 L8 11 L13 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 9 L13 11 L11 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {parents.map((p, i) => (
        <span key={p.id} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-[var(--muted-foreground)]/60">·</span>}
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: p.color }}
            aria-hidden
          />
          <span>{p.shortName}</span>
        </span>
      ))}
    </span>
  )
}
