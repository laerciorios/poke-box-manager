"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SpritePlaceholder } from "@/components/pokemon/SpritePlaceholder"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { FORM_TYPE_TO_TOGGLE_KEY } from "@/lib/form-type-map"
import { getPokemonName, getFormName } from "@/lib/pokemon-names"
import pokemonData from "@/data/pokemon.json"
import formsData from "@/data/forms.json"
import type { PokemonEntry, PokemonForm } from "@/types/pokemon"
import type { Locale } from "@/types/locale"

const allPokemon = pokemonData as unknown as PokemonEntry[]
const allForms = formsData as unknown as Record<string, PokemonForm>

interface PickerItem {
  pokemonId: number
  formId?: string
  name: string
  sprite: string
  dexNumber: number
}

interface PokemonPickerDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (item: { pokemonId: number; formId?: string }) => void
}

function SpriteCell({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false)
  if (!src || error) return <SpritePlaceholder size={40} />
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      className="object-contain"
      onError={() => setError(true)}
      unoptimized
    />
  )
}

export function PokemonPickerDialog({ open, onClose, onSelect }: PokemonPickerDialogProps) {
  const t = useTranslations("Boxes")
  const locale = useLocale() as Locale
  const variations = useSettingsStore((s) => s.variations)
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [open])

  const allItems = useMemo<PickerItem[]>(() => {
    const items: PickerItem[] = []
    for (const pokemon of allPokemon) {
      if (pokemon.sprite) {
        items.push({
          pokemonId: pokemon.id,
          name: getPokemonName(pokemon, locale) ?? pokemon.name,
          sprite: pokemon.sprite,
          dexNumber: pokemon.id,
        })
      }
      for (const form of pokemon.forms) {
        const toggleKey = FORM_TYPE_TO_TOGGLE_KEY.get(form.formType)
        if (toggleKey && !variations[toggleKey]) continue
        const formEntry = allForms[form.id]
        if (!formEntry?.sprite) continue
        items.push({
          pokemonId: pokemon.id,
          formId: form.id,
          name: getFormName(form, locale) ?? form.name,
          sprite: formEntry.sprite,
          dexNumber: pokemon.id,
        })
      }
    }
    return items
  }, [locale, variations])

  const filtered = useMemo<PickerItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allItems
    const byNumber = q.startsWith("#") ? q.slice(1) : null
    return allItems.filter((item) => {
      if (byNumber !== null) return String(item.dexNumber) === byNumber
      return item.name.toLowerCase().includes(q) || String(item.dexNumber).includes(q)
    })
  }, [allItems, query])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-md flex flex-col gap-3 p-4" showCloseButton>
        <DialogHeader>
          <DialogTitle>{t("pickerTitle")}</DialogTitle>
        </DialogHeader>

        <Input
          ref={searchRef}
          placeholder={t("pickerPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="shrink-0"
        />

        <div className="overflow-y-auto" style={{ maxHeight: "min(60dvh, 420px)" }}>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("pickerEmpty")}</p>
          ) : (
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
              {filtered.map((item) => (
                <button
                  key={item.formId ? `${item.pokemonId}:${item.formId}` : String(item.pokemonId)}
                  type="button"
                  title={item.name}
                  onClick={() => {
                    onSelect({ pokemonId: item.pokemonId, formId: item.formId })
                    onClose()
                  }}
                  className="flex items-center justify-center rounded-md p-1 hover:bg-accent transition-colors"
                  style={{ aspectRatio: "1" }}
                >
                  <SpriteCell src={item.sprite} name={item.name} />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
