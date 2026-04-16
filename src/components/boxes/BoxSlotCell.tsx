"use client"

import { useState } from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleHelp, Check, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SpritePlaceholder } from "@/components/pokemon"
import type { BoxSlot } from "@/types/box"
import { Sparkles } from "lucide-react"

const slotVariants = cva(
  "relative flex items-center justify-center rounded-lg outline-none",
  {
    variants: {
      state: {
        registered: "bg-card",
        missing: "bg-card",
        empty: "border-2 border-dashed border-muted bg-muted/20",
      },
      selected: {
        true: "border-2 border-accent ring-2 ring-accent/30",
        false: "",
      },
    },
    defaultVariants: {
      state: "empty",
      selected: false,
    },
  }
)

type SlotState = "registered" | "missing" | "empty"

interface BoxSlotCellProps extends VariantProps<typeof slotVariants> {
  slot: BoxSlot | null
  pokemonName?: string
  spriteUrl?: string
  selected?: boolean
  keyboardFocused?: boolean
  onClick?: (e?: React.MouseEvent) => void
  className?: string
  sortableId?: string
  showName?: boolean
  suppressTooltip?: boolean
  registrationModeActive?: boolean
  hasShinySprite?: boolean
  onShinyToggle?: (e: React.MouseEvent) => void
  isShiny?: boolean
  /** Roving tabindex value — 0 for active slot, -1 for all others */
  tabIndexValue?: number
  /** Whether the grid is in the viewport; when false, sprites are skipped */
  visible?: boolean
}

function getSlotState(slot: BoxSlot | null): SlotState {
  if (!slot) return "empty"
  return slot.registered ? "registered" : "missing"
}

function getNameFontClass(name: string): string {
  if (name.length <= 8) return "text-[10px]"
  if (name.length <= 13) return "text-[9px]"
  return "text-[8px]"
}

const SPRITE_SIZES =
  "(max-width: 640px) 38px, (max-width: 768px) 48px, (max-width: 1024px) 60px, (max-width: 1280px) 75px, 90px"

function SlotSprite({
  slot,
  spriteUrl,
  pokemonName,
  showName,
  isDragging,
  isDraggable,
  visible,
}: {
  slot: BoxSlot
  spriteUrl?: string
  pokemonName?: string
  showName?: boolean
  isDragging?: boolean
  isDraggable?: boolean
  visible?: boolean
}) {
  const [spriteLoaded, setSpriteLoaded] = useState(false)
  const [spriteError, setSpriteError] = useState(false)
  const state = getSlotState(slot)

  const spriteContainerClass = showName ? "w-[60%]" : "w-[75%]"

  return (
    <>
      <div className={cn("relative aspect-square shrink-0", spriteContainerClass)}>
        {(!spriteLoaded || spriteError) && (
          <SpritePlaceholder className="absolute inset-0 w-full h-full" />
        )}
        {!spriteError && spriteUrl && visible !== false && (
          <Image
            src={spriteUrl}
            alt={pokemonName ?? `#${slot.pokemonId}`}
            fill
            sizes={SPRITE_SIZES}
            className={cn(
              "object-contain transition-[opacity,transform] duration-[var(--transition-fast)] motion-reduce:transition-none",
              spriteLoaded ? "opacity-100" : "opacity-0",
              state === "missing" && "opacity-30",
              isDraggable && !isDragging && "group-hover:scale-110"
            )}
            onLoad={() => setSpriteLoaded(true)}
            onError={() => setSpriteError(true)}
          />
        )}
      </div>

      {showName && pokemonName && (
        <span
          className={cn(
            "w-full truncate text-center leading-none text-muted-foreground px-0.5",
            getNameFontClass(pokemonName)
          )}
        >
          {pokemonName}
        </span>
      )}
    </>
  )
}

function SortableSlotCell({
  slot,
  pokemonName,
  spriteUrl,
  selected = false,
  keyboardFocused = false,
  onClick,
  className,
  sortableId,
  showName,
  suppressTooltip,
  registrationModeActive,
  hasShinySprite,
  onShinyToggle,
  isShiny,
  tabIndexValue = 0,
  visible,
}: BoxSlotCellProps) {
  const state = getSlotState(slot)
  const tA11y = useTranslations("accessibility")

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: sortableId!,
    disabled: !slot,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isDraggable = !!slot
  const cellClassName = cn(
    slotVariants({ state, selected }),
    "group aspect-square hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring max-md:min-w-[44px] max-md:min-h-[44px]",
    showName && slot ? "flex-col gap-0.5 p-1" : "",
    isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
    isDragging && "opacity-30",
    isOver && !isDragging && "ring-2 ring-primary",
    keyboardFocused && "ring-2 ring-primary outline-none",
    className
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick?.()
    }
  }

  // Compute ARIA label based on slot state
  const ariaLabel = !slot
    ? tA11y("emptySlot")
    : slot.registered
    ? tA11y("slotRegistered", { name: pokemonName ?? `#${slot.pokemonId}` })
    : tA11y("slotNotRegistered", { name: pokemonName ?? `#${slot.pokemonId}` })

  const showShinyRegistered = !!slot && (isShiny || (registrationModeActive && !!onShinyToggle))

  const cellContent = (
    <>
      {state === "empty" ? (
        <CircleHelp className="size-6 text-muted-foreground/50" />
      ) : slot ? (
        <>
          <SlotSprite
            slot={slot}
            spriteUrl={spriteUrl}
            pokemonName={pokemonName}
            showName={showName}
            isDragging={isDragging}
            isDraggable={isDraggable}
            visible={visible}
          />
          {state === "registered" && (
            <div className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-green-600 text-white">
              <Check className="size-2.5" />
            </div>
          )}
          {showShinyRegistered && (
            <div
              role={registrationModeActive && onShinyToggle ? "button" : undefined}
              className={cn(
                "absolute top-0.5 left-0.5 z-10 inline-flex size-4 items-center justify-center rounded-full ring-1 shadow-sm transition-all motion-reduce:transition-none",
                isShiny
                  ? "bg-amber-400/90 text-amber-900 ring-amber-400/50 opacity-100"
                  : "bg-card/95 text-muted-foreground ring-border/70 opacity-0 group-hover:opacity-100",
                registrationModeActive && onShinyToggle ? "cursor-pointer" : "pointer-events-none"
              )}
              onClick={registrationModeActive && onShinyToggle ? (e) => {
                e.stopPropagation()
                onShinyToggle(e)
              } : undefined}
            >
              <Sparkles className="size-2.5" />
            </div>
          )}
          {isDraggable && (
            <GripVertical className="absolute bottom-0.5 right-0.5 size-3 text-muted-foreground/40 opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100" />
          )}
        </>
      ) : null}
    </>
  )

  const divProps = {
    ...attributes,
    ...listeners,
    ref: setNodeRef,
    style,
    role: "gridcell" as const,
    tabIndex: tabIndexValue,
    "aria-label": ariaLabel,
    "aria-selected": registrationModeActive ? selected : undefined,
    "aria-roledescription": isDraggable ? tA11y("draggable") : undefined,
    className: cellClassName,
    onClick,
    onKeyDown: handleKeyDown,
  }

  if (slot && pokemonName && !showName && !suppressTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div {...divProps} />}>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent>{pokemonName}</TooltipContent>
      </Tooltip>
    )
  }

  return <div {...divProps}>{cellContent}</div>
}

export function BoxSlotCell({
  slot,
  pokemonName,
  spriteUrl,
  selected = false,
  keyboardFocused = false,
  onClick,
  className,
  sortableId,
  showName,
  suppressTooltip,
  registrationModeActive,
  hasShinySprite,
  onShinyToggle,
  isShiny,
  tabIndexValue = 0,
  visible,
}: BoxSlotCellProps) {
  const [spriteLoaded, setSpriteLoaded] = useState(false)
  const [spriteError, setSpriteError] = useState(false)
  const state = getSlotState(slot)
  const tA11y = useTranslations("accessibility")

  if (sortableId) {
    return (
      <SortableSlotCell
        slot={slot}
        pokemonName={pokemonName}
        spriteUrl={spriteUrl}
        selected={selected}
        keyboardFocused={keyboardFocused}
        onClick={onClick}
        className={className}
        sortableId={sortableId}
        showName={showName}
        suppressTooltip={suppressTooltip}
        registrationModeActive={registrationModeActive}
        hasShinySprite={hasShinySprite}
        onShinyToggle={onShinyToggle}
        isShiny={isShiny}
        tabIndexValue={tabIndexValue}
        visible={visible}
      />
    )
  }

  // Compute ARIA label based on slot state
  const ariaLabel = !slot
    ? tA11y("emptySlot")
    : slot.registered
    ? tA11y("slotRegistered", { name: pokemonName ?? `#${slot.pokemonId}` })
    : tA11y("slotNotRegistered", { name: pokemonName ?? `#${slot.pokemonId}` })

  const cellClassName = cn(
    slotVariants({ state, selected }),
    "group aspect-square cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring max-md:min-w-[44px] max-md:min-h-[44px]",
    showName && slot ? "flex-col gap-0.5 p-1" : "",
    keyboardFocused && "ring-2 ring-primary outline-none",
    className
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick?.()
    }
  }

  const showShinyRegisteredNonSortable = !!slot && (isShiny || (registrationModeActive && !!onShinyToggle))

  const cellContent = (
    <>
      {state === "empty" ? (
        <CircleHelp className="size-6 text-muted-foreground/50" />
      ) : slot ? (
        <>
          <div className={cn("relative aspect-square shrink-0", showName ? "w-[60%]" : "w-[75%]")}>
            {(!spriteLoaded || spriteError) && (
              <SpritePlaceholder className="absolute inset-0 w-full h-full" />
            )}
            {!spriteError && spriteUrl && visible !== false && (
              <Image
                src={spriteUrl}
                alt={pokemonName ?? `#${slot.pokemonId}`}
                fill
                sizes={SPRITE_SIZES}
                className={cn(
                  "object-contain transition-opacity duration-[var(--transition-fast)] motion-reduce:transition-none",
                  spriteLoaded ? "opacity-100" : "opacity-0",
                  state === "missing" && "opacity-30"
                )}
                onLoad={() => setSpriteLoaded(true)}
                onError={() => setSpriteError(true)}
              />
            )}
          </div>
          {showName && pokemonName && (
            <span
              className={cn(
                "w-full truncate text-center leading-none text-muted-foreground px-0.5",
                getNameFontClass(pokemonName)
              )}
            >
              {pokemonName}
            </span>
          )}
          {state === "registered" && (
            <div className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-green-600 text-white">
              <Check className="size-2.5" />
            </div>
          )}
          {showShinyRegisteredNonSortable && (
            <div
              role={registrationModeActive && onShinyToggle ? "button" : undefined}
              className={cn(
                "absolute top-0.5 left-0.5 z-10 inline-flex size-4 items-center justify-center rounded-full ring-1 shadow-sm transition-all motion-reduce:transition-none",
                isShiny
                  ? "bg-amber-400/90 text-amber-900 ring-amber-400/50 opacity-100"
                  : "bg-card/95 text-muted-foreground ring-border/70 opacity-0 group-hover:opacity-100",
                registrationModeActive && onShinyToggle ? "cursor-pointer" : "pointer-events-none"
              )}
              onClick={registrationModeActive && onShinyToggle ? (e) => {
                e.stopPropagation()
                onShinyToggle(e)
              } : undefined}
            >
              <Sparkles className="size-2.5" />
            </div>
          )}
        </>
      ) : null}
    </>
  )

  if (slot && pokemonName && !showName && !suppressTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cellClassName}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          render={
            <div
              role="gridcell"
              tabIndex={tabIndexValue}
              aria-label={ariaLabel}
              aria-selected={registrationModeActive ? selected : undefined}
            />
          }
        >
          {cellContent}
        </TooltipTrigger>
        <TooltipContent>{pokemonName}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div
      role="gridcell"
      tabIndex={tabIndexValue}
      aria-label={ariaLabel}
      aria-selected={registrationModeActive ? selected : undefined}
      className={cellClassName}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {cellContent}
    </div>
  )
}
