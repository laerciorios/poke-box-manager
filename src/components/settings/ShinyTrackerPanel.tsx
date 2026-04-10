'use client'

import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'

export function ShinyTrackerPanel() {
  const t = useTranslations('Settings')
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)
  const setShinyTrackerEnabled = useSettingsStore((s) => s.setShinyTrackerEnabled)
  const registeredShiny = usePokedexStore((s) => s.registeredShiny)

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
      {shinyTrackerEnabled && registeredShiny.length > 0 && (
        <div className="py-3">
          <p className="text-sm text-muted-foreground">
            {t('shinyRegisteredCount', { count: registeredShiny.length })}
          </p>
        </div>
      )}
    </div>
  )
}
