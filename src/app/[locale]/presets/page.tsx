'use client'

import * as React from 'react'
import { Plus, Upload, Download, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonFormsData from '@/data/forms.json'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'
import type { OrganizationPreset } from '@/types/preset'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePresetsStore } from '@/stores/usePresetsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { BUILTIN_PRESETS } from '@/lib/presets/builtin-presets'
import { applyPreset } from '@/lib/preset-engine'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { FadeIn } from '@/components/motion'
import { useToast } from '@/components/ui/toast'
import { PresetCard } from '@/components/presets/PresetCard'
import dynamic from 'next/dynamic'

// Editor pulls in @dnd-kit/sortable + PresetRuleEditor/PresetPreview only when
// the user opens it. Saves ~20 KiB from the route's initial bundle.
const PresetEditor = dynamic(
  () => import('@/components/presets/PresetEditor').then((m) => m.PresetEditor),
  { ssr: false },
)

const ALL_POKEMON = pokemonData as PokemonEntry[]
const ALL_FORMS = pokemonFormsData as unknown as Record<string, PokemonForm>

export default function PresetsPage() {
  const t = useTranslations('Presets')
  const tCommon = useTranslations('Common')
  const tToast = useTranslations('Toasts')
  const { push: pushToast } = useToast()
  const locale = useSettingsStore((s) => s.locale)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const presets = usePresetsStore((s) => s.presets)
  const createPreset = usePresetsStore((s) => s.createPreset)
  const updatePreset = usePresetsStore((s) => s.updatePreset)
  const deletePreset = usePresetsStore((s) => s.deletePreset)
  const duplicatePreset = usePresetsStore((s) => s.duplicatePreset)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const registered = usePokedexStore((s) => s.registered)

  const [editing, setEditing] = React.useState<OrganizationPreset | null>(null)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [applyConfirm, setApplyConfirm] = React.useState<OrganizationPreset | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<OrganizationPreset | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Merge built-in (read-only) with user-defined.
  const allPresets: OrganizationPreset[] = React.useMemo(() => {
    const byId = new Map<string, OrganizationPreset>()
    for (const p of BUILTIN_PRESETS) byId.set(p.id, p)
    for (const p of presets) byId.set(p.id, p)
    return Array.from(byId.values())
  }, [presets])

  const handleApply = (preset: OrganizationPreset) => setApplyConfirm(preset)

  const confirmApply = () => {
    if (!applyConfirm) return
    const presetName = applyConfirm.names?.[locale] ?? applyConfirm.name
    const boxes = applyPreset(
      applyConfirm,
      ALL_POKEMON.filter((p) => activeGenerations.includes(p.generation)),
      ALL_FORMS,
      variations,
      new Set(registered),
    )
    setBoxes(boxes)
    setApplyConfirm(null)
    pushToast({
      title: tToast('presetApplied', { name: presetName }),
      description: tToast('presetAppliedHint', { count: boxes.length }),
      variant: 'success',
    })
  }

  const handleEdit = (preset: OrganizationPreset) => {
    setEditing(preset)
    setEditorOpen(true)
  }

  const handleNew = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const handleSave = (preset: OrganizationPreset) => {
    const existing = presets.find((p) => p.id === preset.id)
    if (existing) {
      updatePreset(preset.id, preset)
    } else {
      // createPreset expects Omit<OrganizationPreset, 'id'> and assigns its own id.
      // We discard the draft id so the store can generate a stable one.
      const { id: _drop, ...rest } = preset
      void _drop
      createPreset(rest)
    }
  }

  const handleDuplicate = (preset: OrganizationPreset) => {
    if (preset.isBuiltIn) {
      // Builtin presets aren't stored — copy them into the user list manually.
      const { id: _drop, ...rest } = preset
      void _drop
      createPreset({
        ...rest,
        isBuiltIn: false,
        name: `${preset.name} (copy)`,
        names: {
          'pt-BR': `${preset.names['pt-BR']} (cópia)`,
          en: `${preset.names.en} (copy)`,
        },
      })
    } else {
      duplicatePreset(preset.id)
    }
  }

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      presets,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pokebox-presets-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { presets?: OrganizationPreset[] }
      if (!parsed.presets || !Array.isArray(parsed.presets)) {
        throw new Error('Missing presets[] field')
      }
      const existingIds = new Set(presets.map((p) => p.id))
      let added = 0
      for (const p of parsed.presets) {
        if (existingIds.has(p.id)) continue
        const { id: _drop, ...rest } = p
        void _drop
        createPreset({ ...rest, isBuiltIn: false })
        added++
      }
      window.alert(t('importSuccess', { count: added }))
    } catch (err) {
      window.alert(t('importFailed', { error: (err as Error).message }))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              {t('import')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleImport}
            />
            <Button variant="outline" onClick={handleExport} disabled={presets.length === 0}>
              <Download className="size-4" />
              {t('export')}
            </Button>
            <Button variant="accent" onClick={handleNew}>
              <Plus className="size-4" />
              {t('newPreset')}
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPresets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            locale={locale}
            onApply={() => handleApply(preset)}
            onEdit={() => handleEdit(preset)}
            onDuplicate={() => handleDuplicate(preset)}
            onDelete={() => setDeleteConfirm(preset)}
          />
        ))}
      </div>

      <PresetEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false)
          setEditing(null)
        }}
        initial={editing}
        onSave={handleSave}
      />

      <Dialog
        open={applyConfirm !== null}
        onClose={() => setApplyConfirm(null)}
        size="sm"
        title={t('applyConfirm.title')}
        description={t('applyConfirm.description')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setApplyConfirm(null)}>
              {tCommon('cancel')}
            </Button>
            <Button variant="accent" onClick={confirmApply}>
              {tCommon('apply')}
            </Button>
          </>
        }
      >
        <div className="rounded-md border border-[var(--warning)]/30 bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-3 flex gap-2">
          <AlertTriangle className="size-4 shrink-0 text-[var(--warning)] mt-0.5" />
          <p className="text-sm text-[var(--foreground)]">
            {t('applyConfirm.warning')}
          </p>
        </div>
      </Dialog>

      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        size="sm"
        title={t('deleteConfirm.title')}
        description={t('deleteConfirm.description', {
          name: deleteConfirm ? (deleteConfirm.names?.[locale] ?? deleteConfirm.name) : '',
        })}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) deletePreset(deleteConfirm.id)
                setDeleteConfirm(null)
              }}
            >
              {tCommon('delete')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          {t('deleteConfirm.body')}
        </p>
      </Dialog>
    </div>
  )
}
