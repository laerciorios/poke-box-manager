"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBoxStore } from "@/stores/useBoxStore"
import { usePresetsStore } from "@/stores/usePresetsStore"
import { usePokedexStore } from "@/stores/usePokedexStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { BUILTIN_PRESETS } from "@/lib/presets/builtin-presets"
import { applyPreset } from "@/lib/preset-engine"
import { useModalStack } from "@/contexts/ModalStackContext"
import { BOX_SIZE } from "@/types/box"
import pokemonData from "@/data/pokemon.json"
import formsData from "@/data/forms.json"
import type { PokemonEntry, PokemonForm } from "@/types/pokemon"

const allPokemon = pokemonData as unknown as PokemonEntry[]
const allForms = formsData as unknown as Record<string, PokemonForm>

interface BoxActionsMenuProps {
  boxId: string
  onDeleteBox: (boxId: string) => void
}

export function BoxActionsMenu({ boxId, onDeleteBox }: BoxActionsMenuProps) {
  const t = useTranslations("Boxes")
  const tCommon = useTranslations("Common")

  const boxes = useBoxStore((s) => s.boxes)
  const clearSlot = useBoxStore((s) => s.clearSlot)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const userPresets = usePresetsStore((s) => s.presets)
  const registered = usePokedexStore((s) => s.registered)
  const variations = useSettingsStore((s) => s.variations)

  const { push, pop } = useModalStack()

  const [clearOpen, setClearOpen] = useState(false)
  const [reapplyOpen, setReapplyOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (clearOpen) push("box-clear-confirm", () => setClearOpen(false))
    else pop("box-clear-confirm")
  }, [clearOpen, push, pop])

  useEffect(() => {
    if (reapplyOpen) push("box-reapply-confirm", () => setReapplyOpen(false))
    else pop("box-reapply-confirm")
  }, [reapplyOpen, push, pop])

  useEffect(() => {
    if (deleteOpen) push("box-delete-confirm", () => setDeleteOpen(false))
    else pop("box-delete-confirm")
  }, [deleteOpen, push, pop])

  const box = boxes.find((b) => b.id === boxId)
  const filledCount = box ? box.slots.filter(Boolean).length : 0

  const allPresets = [...BUILTIN_PRESETS, ...userPresets]
  const hasPresets = allPresets.length > 0

  function handleClearBox() {
    if (!box) return
    for (let i = 0; i < BOX_SIZE; i++) {
      clearSlot(boxId, i)
    }
    setClearOpen(false)
  }

  function handleReapplyPreset() {
    const preset = allPresets[0]
    if (!preset) return
    const registeredKeys = new Set(registered)
    const result = applyPreset(preset, allPokemon, allForms, variations, registeredKeys)
    setBoxes(result)
    setReapplyOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label={t("boxActions")} className="size-8" />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={() => setClearOpen(true)}>
            {t("clearBox")}
          </DropdownMenuItem>

          {hasPresets ? (
            <DropdownMenuItem onClick={() => setReapplyOpen(true)}>
              {t("reapplyPreset")}
            </DropdownMenuItem>
          ) : (
            <Tooltip>
              <TooltipTrigger render={<span className="block" />}>
                <DropdownMenuItem disabled>
                  {t("reapplyPreset")}
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>{t("noPresetTooltip")}</TooltipContent>
            </Tooltip>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            {t("deleteBox")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear box confirmation */}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clearBoxConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("clearBoxConfirmDesc", { count: filledCount })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={
              <Button variant="outline" onClick={() => setClearOpen(false)} />
            }>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction render={
              <Button variant="destructive" onClick={handleClearBox} />
            }>
              {t("clearBox")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Re-apply preset confirmation */}
      <AlertDialog open={reapplyOpen} onOpenChange={setReapplyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("reapplyPresetConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("reapplyPresetConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={
              <Button variant="outline" onClick={() => setReapplyOpen(false)} />
            }>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction render={
              <Button variant="destructive" onClick={handleReapplyPreset} />
            }>
              {t("reapplyPreset")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete box confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteBoxConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBoxConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={
              <Button variant="outline" onClick={() => setDeleteOpen(false)} />
            }>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction render={
              <Button variant="destructive" onClick={() => {
                onDeleteBox(boxId)
                setDeleteOpen(false)
              }} />
            }>
              {t("deleteBox")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
