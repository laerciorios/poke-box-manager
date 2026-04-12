'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { Locale } from '@/types/locale'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { BUILTIN_PRESETS } from '@/lib/presets/builtin-presets'
import { usePresetsStore } from '@/stores/usePresetsStore'
import type { OrganizationPreset } from '@/types/preset'

interface PresetListProps {
  onEdit: (preset: OrganizationPreset) => void
  onNew: () => void
}

interface PresetCardProps {
  preset: OrganizationPreset
  isBuiltIn?: boolean
  onCustomize?: () => void
  onEdit?: () => void
  onDuplicate: () => void
  onDelete?: () => void
}

function PresetCard({
  preset,
  isBuiltIn,
  onCustomize,
  onEdit,
  onDuplicate,
  onDelete,
}: PresetCardProps) {
  const t = useTranslations('Presets')
  const locale = useLocale() as Locale
  const displayName = preset.names?.[locale] ?? preset.name
  const displayDescription = preset.descriptions?.[locale] ?? preset.description
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{displayName}</span>
            {isBuiltIn && (
              <Badge variant="secondary" className="shrink-0 text-xs" title={t('builtInReadOnly')}>
                {t('builtInBadge')}
              </Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{displayDescription}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('rulesCount', { count: preset.rules.length })}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {isBuiltIn ? (
          <>
            <Button size="sm" variant="outline" onClick={onCustomize}>
              {t('customize')}
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate}>
              {t('duplicate')}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={onEdit}>
              {t('edit')}
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate}>
              {t('duplicate')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              {t('delete')}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

export function PresetList({ onEdit, onNew }: PresetListProps) {
  const t = useTranslations('Presets')
  const { presets, duplicatePreset, deletePreset, createPreset } = usePresetsStore()

  function handleDuplicateBuiltin(preset: OrganizationPreset) {
    createPreset({
      ...preset,
      name: `${preset.name} (${t('copySuffix')})`,
      isBuiltIn: false,
    })
  }

  function handleDelete(presetId: string) {
    if (window.confirm(t('confirmDeleteDescription'))) {
      deletePreset(presetId)
    }
  }

  function handleCustomize(preset: OrganizationPreset) {
    onEdit({
      ...preset,
      id: '',
      name: `${preset.name} (${t('customSuffix')})`,
      isBuiltIn: false,
    })
  }

  return (
    <div className="space-y-8">
      {/* Built-in presets */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('builtInPresets')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUILTIN_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isBuiltIn
              onCustomize={() => handleCustomize(preset)}
              onDuplicate={() => handleDuplicateBuiltin(preset)}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Custom presets */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('myPresets')}</h2>
        {presets.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">{t('noPresets')}</p>
            <Button className="mt-4" onClick={onNew}>
              {t('createFirstPreset')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onEdit={() => onEdit(preset)}
                onDuplicate={() => duplicatePreset(preset.id)}
                onDelete={() => handleDelete(preset.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
