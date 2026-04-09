'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { PresetList } from '@/components/presets/PresetList'
import { PresetEditor } from '@/components/presets/PresetEditor'
import type { OrganizationPreset } from '@/types/preset'

export default function PresetsPage() {
  const t = useTranslations('Presets')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<OrganizationPreset | undefined>()

  function openNew() {
    setEditingPreset(undefined)
    setEditorOpen(true)
  }

  function openEdit(preset: OrganizationPreset) {
    setEditingPreset(preset)
    setEditorOpen(true)
  }

  function handleClose() {
    setEditorOpen(false)
    setEditingPreset(undefined)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('pageSubtitle')}</p>
        </div>
        <Button onClick={openNew}>{t('newPreset')}</Button>
      </div>

      <PresetList onEdit={openEdit} onNew={openNew} />

      <PresetEditor open={editorOpen} onClose={handleClose} initialPreset={editingPreset} />
    </div>
  )
}
