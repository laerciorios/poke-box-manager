'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useBoxStore } from '@/stores/useBoxStore'

export function ShinyTrackerPanel() {
  const t = useTranslations('Settings')
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)
  const setShinyTrackerEnabled = useSettingsStore((s) => s.setShinyTrackerEnabled)
  const boxes = useBoxStore((s) => s.boxes)

  const shinyCount = useMemo(() => {
    const keys = new Set<string>()
    for (const box of boxes) {
      for (const slot of box.slots) {
        if (!slot?.shiny) continue
        keys.add(slot.formId ? `${slot.pokemonId}:${slot.formId}` : `${slot.pokemonId}`)
      }
    }
    return keys.size
  }, [boxes])

  return (
    <div className="divide-y">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium">{t('shinyTrackerEnable')}</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('shinyTrackerEnableSubtitle')}
          </p>
        </div>
        <Switch
          checked={shinyTrackerEnabled}
          onCheckedChange={setShinyTrackerEnabled}
          aria-label={t('shinyTrackerEnable')}
        />
      </div>
      {shinyTrackerEnabled && shinyCount > 0 && (
        <div className="py-3">
          <p className="text-sm text-muted-foreground">
            {t('shinyRegisteredCount', { count: shinyCount })}
          </p>
        </div>
      )}
    </div>
  )
}
