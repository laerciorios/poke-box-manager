'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonById } from '@/lib/pokemon-lookup'
import { getPokemonName } from '@/lib/pokemon-names'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PokemonCard } from './PokemonCard'
import { SpritePlaceholder } from './SpritePlaceholder'

// Classic Pokémon type colors (duplicated from PokemonCard to keep components self-contained)
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

interface PokemonTooltipProps {
  pokemonId: number | null | undefined
  children: ReactNode
}

function TooltipPreview({ pokemonId }: { pokemonId: number }) {
  const locale = useSettingsStore((s) => s.locale)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const pokemon = getPokemonById(pokemonId)
  if (!pokemon) return null

  const name = getPokemonName(pokemon, locale)

  return (
    <div className="flex items-center gap-3 p-1">
      <div className="relative w-12 h-12 shrink-0">
        {(!loaded || error) && (
          <SpritePlaceholder size={32} className="absolute inset-0 m-auto" />
        )}
        {!error && pokemon.sprite && (
          <Image
            src={pokemon.sprite}
            alt={name}
            fill
            sizes="48px"
            className="object-contain"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-medium text-sm leading-none">{name}</span>
          <span className="text-xs text-muted-foreground font-mono">
            #{String(pokemon.id).padStart(4, '0')}
          </span>
        </div>
        <div className="flex gap-1">
          {pokemon.types.filter(Boolean).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white capitalize"
              style={{ backgroundColor: TYPE_COLORS[type!] ?? '#888' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PokemonTooltip({ pokemonId, children }: PokemonTooltipProps) {
  const [isCardOpen, setIsCardOpen] = useState(false)

  if (!pokemonId) {
    return <>{children}</>
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={<div onClick={() => setIsCardOpen(true)} />}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          className="bg-popover text-popover-foreground border border-border shadow-md p-0 max-w-xs"
          side="top"
          sideOffset={6}
        >
          <TooltipPreview pokemonId={pokemonId} />
        </TooltipContent>
      </Tooltip>

      <PokemonCard
        pokemonId={pokemonId}
        isOpen={isCardOpen}
        onClose={() => setIsCardOpen(false)}
      />
    </>
  )
}
