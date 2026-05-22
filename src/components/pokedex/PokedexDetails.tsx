'use client'

import { useTranslations } from 'next-intl'
import { Sparkles, Check, Star } from 'lucide-react'
import type { PokemonEntry, PokemonCategory } from '@/types/pokemon'
import { Dialog } from '@/components/ui/dialog'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { AvailabilityPanel } from './AvailabilityPanel'
import { EvolutionChain } from './EvolutionChain'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'
import evolutionChains from '@/data/evolution-chains.json'
import pokemonData from '@/data/pokemon.json'
import type { EvolutionChain as EvolutionChainData } from '@/types/game'
import { cn } from '@/lib/utils'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

const CHAINS = evolutionChains as unknown as Record<string, EvolutionChainData>

const CATEGORY_VARIANT: Record<
  Exclude<PokemonCategory, 'normal'>,
  'accent' | 'shiny' | 'warning' | 'registered'
> = {
  legendary: 'shiny',
  mythical: 'accent',
  baby: 'registered',
  'ultra-beast': 'warning',
  paradox: 'warning',
}

interface Props {
  pokemon: PokemonEntry | null
  onClose: () => void
}

export function PokedexDetails({ pokemon, onClose }: Props) {
  const t = useTranslations('Pokedex.details')
  const tCategories = useTranslations('Pokedex.categories')
  const tForms = useTranslations('Pokedex.formTypes')
  const locale = useSettingsStore((s) => s.locale)
  const shinyEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)

  if (!pokemon) return null

  const chain = pokemon.evolutionChainId ? CHAINS[String(pokemon.evolutionChainId)] : undefined
  const registered = isRegistered(pokemon.id)
  const showCategory = pokemon.category !== 'normal'

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
      <div className="space-y-5">
        <Hero
          pokemon={pokemon}
          registered={registered}
          shinyEnabled={shinyEnabled}
          showCategory={showCategory}
          categoryLabel={showCategory ? tCategories(pokemon.category) : undefined}
          tDetails={t}
          onToggleRegistered={() => toggleRegistered(pokemon.id)}
        />

        {pokemon.forms.length > 0 && (
          <Section title={t('forms')}>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pokemon.forms.map((form) => {
                const formReg = isRegistered(pokemon.id, form.id)
                return (
                  <li
                    key={form.id}
                    className={cn(
                      'rounded-(--radius-lg) border bg-[var(--card)] p-2.5 flex flex-col items-center gap-1.5 transition-colors',
                      formReg
                        ? 'border-[var(--registered)]/40 bg-[var(--registered-soft)]'
                        : 'border-[var(--border)]',
                    )}
                  >
                    <Sprite src={form.sprite} alt={form.name} size={56} />
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
          </Section>
        )}

        <Section title={t('availability')}>
          <AvailabilityPanel pokemonId={pokemon.id} forms={pokemon.forms} />
        </Section>

        <Section title={t('evolution')}>
          {!chain ? (
            <p className="text-sm text-[var(--muted-foreground)]">{t('noEvolution')}</p>
          ) : (
            <EvolutionChain
              chain={chain}
              highlightId={pokemon.id}
              locale={locale}
              pokemonIndex={POKEMON_INDEX}
            />
          )}
        </Section>
      </div>
    </Dialog>
  )
}

/**
 * Hero strip: large sprite on the left, identity + actions on the right.
 * On mobile (< sm) the layout stacks; the sprite block becomes a centered
 * banner and the meta column sits below it.
 */
function Hero({
  pokemon,
  registered,
  shinyEnabled,
  showCategory,
  categoryLabel,
  tDetails,
  onToggleRegistered,
}: {
  pokemon: PokemonEntry
  registered: boolean
  shinyEnabled: boolean
  showCategory: boolean
  categoryLabel: string | undefined
  tDetails: ReturnType<typeof useTranslations<'Pokedex.details'>>
  onToggleRegistered: () => void
}) {
  const categoryVariant =
    showCategory && pokemon.category !== 'normal'
      ? CATEGORY_VARIANT[pokemon.category]
      : undefined

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      <div className="flex gap-2 sm:flex-col sm:items-center sm:w-[170px] shrink-0">
        <div className="relative flex-1 sm:flex-none rounded-(--radius-lg) border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface-2)_0%,var(--card)_100%)] p-4 flex items-center justify-center min-h-[150px]">
          <Sprite src={pokemon.sprite} alt={pokemon.name} size={120} />
          {registered && (
            <span
              className="absolute top-2 right-2 inline-flex items-center gap-0.5 rounded-(--radius-pill) bg-[var(--registered)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--registered-foreground)] shadow-sm"
              title={tDetails('register')}
            >
              <Check className="size-2.5" />
            </span>
          )}
        </div>
        {shinyEnabled && (
          <div
            className="relative shrink-0 sm:w-full rounded-(--radius-lg) border border-[var(--shiny)]/40 bg-[var(--shiny-soft)] p-2 flex items-center justify-center min-h-[68px]"
            title={tDetails('shinyHint')}
          >
            <Sparkles className="absolute top-1 left-1 size-3 text-[var(--shiny)]" />
            <Sprite src={pokemon.sprite} shiny alt={`${pokemon.name} shiny`} size={48} />
            <p className="sr-only">{tDetails('shinySide')}</p>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2.5 justify-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {pokemon.types.filter(Boolean).map((type) => (
            <TypeChip key={type as string} type={type as string} />
          ))}
          {showCategory && categoryLabel && categoryVariant && (
            <Badge variant={categoryVariant} className="text-[9px]">
              <Star className="size-2.5" />
              {categoryLabel}
            </Badge>
          )}
        </div>

        <Button
          variant={registered ? 'outline' : 'accent'}
          onClick={onToggleRegistered}
          className="self-start"
        >
          <Check className="size-3.5" />
          {registered ? tDetails('unregister') : tDetails('register')}
        </Button>

        {shinyEnabled && (
          <p className="text-[11px] text-[var(--muted-foreground)] leading-snug max-w-prose">
            <Sparkles className="inline size-3 align-[-2px] text-[var(--shiny)] mr-1" />
            {tDetails('shinyHint')}
          </p>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
        {title}
      </p>
      {children}
    </section>
  )
}
