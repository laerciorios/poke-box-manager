'use client'

import { useTranslations } from 'next-intl'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function BoxDisplayPanel() {
  const t = useTranslations('Settings')
  const showPokemonNamesInBox = useSettingsStore((s) => s.showPokemonNamesInBox)
  const setShowPokemonNamesInBox = useSettingsStore((s) => s.setShowPokemonNamesInBox)

  return (
    <div className="divide-y">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium">{t('showPokemonNamesInBox')}</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('showPokemonNamesInBoxSubtitle')}
          </p>
        </div>
        <Switch
          checked={showPokemonNamesInBox}
          onCheckedChange={setShowPokemonNamesInBox}
          aria-label={t('showPokemonNamesInBox')}
        />
      </div>
    </div>
  )
}
