'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, Sparkles, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'
import type { BoxSlot as BoxSlotType } from '@/types/box'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'
import { Sprite } from '@/components/pokemon/Sprite'
import { TagDotGroup } from '@/components/tags/TagDotGroup'
import { cn } from '@/lib/utils'
import { toSlotId } from '@/lib/dnd-utils'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface Props {
  slot: BoxSlotType | null
  index: number
  boxId: string
  selected?: boolean
  dimmed?: boolean
  onActivate: (modifiers: { shift: boolean; meta: boolean }) => void
  onToggleRegistered?: () => void
  /** Provided only when slot is filled AND shinyTrackerEnabled is true. */
  onToggleShiny?: () => void
  onContextMenu: (e: React.MouseEvent | React.TouchEvent, anchor: { x: number; y: number }) => void
}

function getSlotSprite(slot: BoxSlotType): { src?: string; name: string; pokemon?: PokemonEntry; form?: PokemonForm } {
  const pokemon = POKEMON_INDEX.get(slot.pokemonId)
  if (!pokemon) return { name: String(slot.pokemonId) }
  const form = slot.formId ? pokemon.forms.find((f) => f.id === slot.formId) : undefined
  const src = form ? form.sprite : pokemon.sprite
  return { src, name: pokemon.name, pokemon, form }
}

export function BoxSlotCell({
  slot,
  index,
  boxId,
  selected,
  dimmed,
  onActivate,
  onToggleRegistered,
  onToggleShiny,
  onContextMenu,
}: Props) {
  const t = useTranslations('Boxes')
  const locale = useSettingsStore((s) => s.locale)
  const showNames = useSettingsStore((s) => s.showPokemonNamesInBox)
  const reduce = useReducedMotion()

  // Subscribe to the Pokédex set so the slot's "registered" status always
  // matches the source of truth. We intentionally derive this rather than
  // reading slot.registered, which can drift if a slot was created before
  // the user marked the Pokémon as registered elsewhere.
  const pokedexRegistered = usePokedexStore((s) => s.registered)
  const isSlotRegistered = React.useMemo(() => {
    if (!slot) return false
    const key = slot.formId
      ? `${slot.pokemonId}:${slot.formId}`
      : String(slot.pokemonId)
    return pokedexRegistered.includes(key)
  }, [slot, pokedexRegistered])

  const id = toSlotId(boxId, index)
  const sortable = useSortable({ id })
  const { setNodeRef, attributes, listeners, transform, transition, isDragging, isOver } = sortable

  // Unregistered slots render at lower opacity so registered ones stand out
  // at a glance. Drag overrides everything (0.4) so the ghost stays subtle.
  const restingOpacity = slot && !isSlotRegistered ? 0.55 : 1
  const dragStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : restingOpacity,
  }

  // long-press timer for touch context menu
  const pressTimer = React.useRef<number | null>(null)
  const pressStart = React.useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    pressStart.current = { x: touch.clientX, y: touch.clientY }
    pressTimer.current = window.setTimeout(() => {
      onContextMenu(e, { x: touch.clientX, y: touch.clientY })
    }, 550)
  }
  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const s = pressStart.current
    if (!s) return
    if (Math.hypot(touch.clientX - s.x, touch.clientY - s.y) > 8) {
      handleTouchEnd()
    }
  }

  const handleContextClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(e, { x: e.clientX, y: e.clientY })
  }

  if (!slot) {
    return (
      <div
        ref={setNodeRef}
        style={dragStyle}
        {...attributes}
        {...listeners}
        className={cn(
          'group relative aspect-square rounded-md border border-dashed border-[var(--border)]',
          'bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]',
          'transition-[colors,opacity] touch-none',
          isOver && 'border-[var(--accent)] bg-[var(--accent-soft)]',
          selected && 'ring-2 ring-[var(--accent)]',
          dimmed && 'opacity-30',
        )}
        onContextMenu={handleContextClick}
        data-slot-empty
        data-slot-index={index}
      >
        <button
          type="button"
          onClick={(e) => onActivate({ shift: e.shiftKey, meta: e.metaKey || e.ctrlKey })}
          className="absolute inset-0 grid place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label={t('emptySlot', { index: index + 1 })}
        >
          <Plus className="size-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    )
  }

  const { src, pokemon, form } = getSlotSprite(slot)
  const baseName = pokemon ? getPokemonName(pokemon, locale) : String(slot.pokemonId)
  const formName = form ? getFormName(form, locale) : null
  const displayName = formName ?? baseName

  return (
    <motion.div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      layout={!reduce}
      initial={reduce ? { opacity: restingOpacity } : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: isDragging ? 0.4 : restingOpacity, scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative aspect-square rounded-md border bg-[var(--card)] touch-none transition-opacity',
        isSlotRegistered ? 'border-[var(--border)]' : 'border-[var(--border-strong)]',
        isOver && 'border-[var(--accent)] ring-2 ring-[var(--accent)]',
        selected && 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card)]',
        dimmed && 'opacity-30',
      )}
      onContextMenu={handleContextClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onTouchMove={handleTouchMove}
      data-slot-index={index}
    >
      <button
        type="button"
        onClick={(e) => onActivate({ shift: e.shiftKey, meta: e.metaKey || e.ctrlKey })}
        className="absolute inset-0 grid place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        aria-label={displayName}
      >
        <Sprite
          src={src}
          alt={displayName}
          size={56}
          shiny={!!slot.shiny}
          className="w-full h-full"
        />
      </button>

      {/*
        Shiny toggle — mirrors the registered check button on the opposite
        corner. Only rendered when shinyTrackerEnabled is on (the parent
        passes `onToggleShiny` only in that case). Active state fills the
        button with the shiny token color; idle state stays neutral so the
        affordance is visible without dominating the slot.
      */}
      {onToggleShiny ? (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleShiny()
          }}
          className={cn(
            'absolute top-1 left-1 size-4 rounded-full grid place-items-center transition-colors z-10',
            slot.shiny
              ? 'bg-[var(--shiny)] text-[var(--shiny-foreground)]'
              : 'bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--muted-foreground)] hover:bg-[var(--surface-3)] hover:text-[var(--shiny)]',
          )}
          aria-label={slot.shiny ? t('unmarkShiny') : t('markShiny')}
          aria-pressed={!!slot.shiny}
        >
          <Sparkles className="size-2.5" strokeWidth={slot.shiny ? 2.5 : 2} />
        </button>
      ) : (
        // Read-only badge: shiny tracker is off (no onToggleShiny passed)
        // but the slot was marked shiny in a previous session. Show the
        // indicator so the user doesn't think the data was lost.
        slot.shiny && (
          <span className="absolute top-1 left-1 size-3.5 rounded-full bg-[var(--shiny)] grid place-items-center pointer-events-none">
            <Sparkles className="size-2 text-[var(--shiny-foreground)]" />
          </span>
        )
      )}

      {onToggleRegistered && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleRegistered()
          }}
          className={cn(
            'absolute top-1 right-1 size-4 rounded-full grid place-items-center transition-colors z-10',
            isSlotRegistered
              ? 'bg-[var(--registered)] text-[var(--registered-foreground)]'
              : 'bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--muted-foreground)] hover:bg-[var(--surface-3)]',
          )}
          aria-label={isSlotRegistered ? t('unmarkRegistered') : t('markRegistered')}
          aria-pressed={isSlotRegistered}
        >
          {isSlotRegistered && <Check className="size-2.5" strokeWidth={3} />}
        </button>
      )}

      {showNames && (
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 rounded-b-md bg-[var(--card)]/85 backdrop-blur-sm',
            'text-[9px] font-mono px-1 py-0.5 text-center text-[var(--foreground)] truncate pointer-events-none',
          )}
        >
          {displayName}
        </span>
      )}

      {slot.tagIds && slot.tagIds.length > 0 && (
        <span
          className={cn(
            'absolute left-1 pointer-events-none',
            showNames ? 'bottom-3.5' : 'bottom-1',
          )}
        >
          <TagDotGroup tagIds={slot.tagIds} />
        </span>
      )}
    </motion.div>
  )
}

/** Visual-only clone of a slot used in the DragOverlay. */
export function BoxSlotPreview({ slot }: { slot: BoxSlotType | null }) {
  const locale = useSettingsStore((s) => s.locale)
  if (!slot) {
    return (
      <div className="aspect-square w-14 rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]" />
    )
  }
  const { src, pokemon, form } = getSlotSprite(slot)
  const baseName = pokemon ? getPokemonName(pokemon, locale) : String(slot.pokemonId)
  const formName = form ? getFormName(form, locale) : null
  return (
    <div className="aspect-square w-14 rounded-md border-2 border-[var(--accent)] bg-[var(--card)] shadow-[var(--shadow-pop)] grid place-items-center">
      <Sprite
        src={src}
        alt={formName ?? baseName}
        size={56}
        shiny={!!slot.shiny}
        className="w-full h-full"
      />
    </div>
  )
}
