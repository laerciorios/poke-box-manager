"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoxStore } from "@/stores/useBoxStore"
import { BOX_LABEL_COLORS, BOX_LABEL_KEYS } from "@/lib/box-label-colors"

export { BOX_LABEL_COLORS } from "@/lib/box-label-colors"

interface BoxColorPickerProps {
  boxId: string
  currentLabel?: string
}

export function BoxColorPicker({ boxId, currentLabel }: BoxColorPickerProps) {
  const t = useTranslations("Boxes")
  const setBoxLabel = useBoxStore((s) => s.setBoxLabel)
  const [open, setOpen] = useState(false)

  function handleSelectColor(key: string) {
    setBoxLabel(boxId, key)
    setOpen(false)
  }

  function handleClear() {
    setBoxLabel(boxId, undefined)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            aria-label={t("boxColorPicker")}
          />
        }
      >
        <Palette className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-auto min-w-0 p-2">
        <div className="grid grid-cols-4 gap-1.5 pb-1.5">
          {BOX_LABEL_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleSelectColor(key)}
              aria-label={t(`colors.${key}`)}
              className={cn(
                "size-7 rounded-full transition-transform motion-reduce:transition-none hover:scale-110 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                BOX_LABEL_COLORS[key],
                currentLabel === key && "ring-2 ring-offset-1 ring-foreground"
              )}
            />
          ))}
        </div>
        <DropdownMenuItem
          onClick={handleClear}
          className="justify-center text-xs text-muted-foreground"
        >
          {t("clearColor")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
