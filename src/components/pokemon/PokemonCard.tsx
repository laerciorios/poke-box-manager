'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'

import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { getPokemonById, getEvolutionChain } from '@/lib/pokemon-lookup'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SpritePlaceholder } from './SpritePlaceholder'
import type { PokemonForm } from '@/types/pokemon'

// Classic Pokémon type colors
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

interface PokemonCardProps {
  pokemonId: number
  isOpen: boolean
  onClose: () => void
}

function SpriteImage({
  src,
  name,
}: {
  src: string
  name: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-36 h-36 mx-auto">
      {(!loaded || error) && (
        <SpritePlaceholder size={96} className="absolute inset-0 m-auto" />
      )}
      {!error && (
        <Image
          src={src}
          alt={name}
          fill
          sizes="144px"
          className={cn(
            'object-contain transition-opacity duration-150',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

export function PokemonCard({ pokemonId, isOpen, onClose }: PokemonCardProps) {
  const locale = useSettingsStore((s) => s.locale)
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)
  const isShinyRegistered = usePokedexStore((s) => s.isShinyRegistered)
  const toggleShinyRegistered = usePokedexStore((s) => s.toggleShinyRegistered)
  const t = useTranslations('Pokemon')

  const [isShiny, setIsShiny] = useState(false)
  const [activeFormId, setActiveFormId] = useState<string | null>(null)

  const pokemon = getPokemonById(pokemonId)

  if (!pokemon) return null

  const activeForm: PokemonForm | undefined = activeFormId
    ? pokemon.forms.find((f) => f.id === activeFormId)
    : undefined

  const displayName = activeForm
    ? getFormName(activeForm, locale)
    : getPokemonName(pokemon, locale)

  const baseSprite = activeForm?.sprite ?? pokemon.sprite
  const shinySprite = activeForm?.spriteShiny ?? pokemon.spriteShiny
  const displaySprite = isShiny && shinySprite ? shinySprite : baseSprite

  const displayTypes = activeForm?.types ?? pokemon.types
  const hasShiny = !!shinySprite

  const evolutionChain = pokemon.evolutionChainId
    ? getEvolutionChain(pokemon.evolutionChainId)
    : undefined

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      setIsShiny(false)
      setActiveFormId(null)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader className="pb-2">
          <p className="text-xs text-muted-foreground font-mono">
            #{String(pokemon.id).padStart(4, '0')}
          </p>
          <SheetTitle>{displayName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          {/* Sprite + shiny toggle */}
          <div className="flex flex-col items-center gap-2">
            <SpriteImage src={displaySprite} name={displayName} />
            <Button
              variant={isShiny ? 'default' : 'outline'}
              size="sm"
              disabled={!hasShiny}
              onClick={() => setIsShiny((v) => !v)}
              className="gap-1.5"
            >
              <Sparkles className="size-3.5" />
              {t('shiny')}
            </Button>
            {shinyTrackerEnabled && (() => {
              const shinyKey = activeFormId ?? undefined
              const registered = isShinyRegistered(pokemonId, shinyKey)
              return (
                <Button
                  variant={registered ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleShinyRegistered(pokemonId, shinyKey)}
                  className="gap-1.5"
                >
                  <Sparkles className="size-3.5" />
                  {registered ? t('registeredShiny') : t('registerShiny')}
                </Button>
              )
            })()}
          </div>

          {/* Types */}
          <div className="flex justify-center gap-2">
            {displayTypes.filter(Boolean).map((type) => (
              <span
                key={type}
                className="px-3 py-0.5 rounded-full text-xs font-medium text-white capitalize"
                style={{ backgroundColor: TYPE_COLORS[type!] ?? '#888' }}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Generation + category */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="font-medium">{t('generation', { n: pokemon.generation })}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">{t('category')}</p>
              <p className="font-medium capitalize">{pokemon.category}</p>
            </div>
          </div>

          {/* Form switcher */}
          {pokemon.forms.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t('forms')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveFormId(null)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg p-1.5 text-xs border transition-colors',
                    activeFormId === null
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={pokemon.sprite}
                      alt={getPokemonName(pokemon, locale)}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <span className="max-w-[64px] truncate text-center leading-tight">
                    {getPokemonName(pokemon, locale)}
                  </span>
                </button>

                {pokemon.forms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setActiveFormId(form.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg p-1.5 text-xs border transition-colors',
                      activeFormId === form.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted',
                    )}
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={form.sprite}
                        alt={getFormName(form, locale)}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <span className="max-w-[64px] truncate text-center leading-tight">
                      {getFormName(form, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Evolution chain */}
          {evolutionChain && evolutionChain.pokemonIds.length > 1 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t('evolution')}
              </p>
              <div className="flex flex-wrap gap-2">
                {evolutionChain.pokemonIds.map((evoId, idx) => {
                  const evo = getPokemonById(evoId)
                  if (!evo) return null
                  return (
                    <div key={evoId} className="flex items-center gap-1">
                      {idx > 0 && (
                        <span className="text-muted-foreground text-xs">→</span>
                      )}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="relative w-12 h-12">
                          <Image
                            src={evo.sprite}
                            alt={getPokemonName(evo, locale)}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground max-w-[48px] truncate text-center">
                          {getPokemonName(evo, locale)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
