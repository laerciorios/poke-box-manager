'use client'

import * as React from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PresetRuleEditor } from './PresetRuleEditor'
import { PresetPreview } from './PresetPreview'
import pokemonFormsData from '@/data/forms.json'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'
import type { OrganizationPreset, PresetRule } from '@/types/preset'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { applyPreset } from '@/lib/preset-engine'

const ALL_POKEMON = pokemonData as PokemonEntry[]
const ALL_FORMS = pokemonFormsData as unknown as Record<string, PokemonForm>

interface Props {
  open: boolean
  onClose: () => void
  initial: OrganizationPreset | null
  onSave: (preset: OrganizationPreset) => void
}

function emptyRule(order: number): PresetRule {
  return {
    order,
    filter: {},
    sort: 'dex-number',
  }
}

function defaultPreset(): OrganizationPreset {
  return {
    id: crypto.randomUUID(),
    name: '',
    names: { 'pt-BR': '', en: '' },
    description: '',
    descriptions: { 'pt-BR': '', en: '' },
    isBuiltIn: false,
    rules: [emptyRule(1)],
  }
}

export function PresetEditor({ open, onClose, initial, onSave }: Props) {
  const t = useTranslations('Presets.editor')
  const tCommon = useTranslations('Common')
  const locale = useSettingsStore((s) => s.locale)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const registered = usePokedexStore((s) => s.registered)

  const [draft, setDraft] = React.useState<OrganizationPreset>(
    initial ?? defaultPreset(),
  )
  const [showPreview, setShowPreview] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setDraft(initial ?? defaultPreset())
      setShowPreview(false)
    }
  }, [open, initial])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIdx = Number(String(active.id).split(':')[1])
    const toIdx = Number(String(over.id).split(':')[1])
    if (Number.isNaN(fromIdx) || Number.isNaN(toIdx)) return
    setDraft((d) => ({
      ...d,
      rules: arrayMove(d.rules, fromIdx, toIdx).map((r, i) => ({ ...r, order: i + 1 })),
    }))
  }

  const updateRule = (idx: number, next: PresetRule) => {
    setDraft((d) => ({
      ...d,
      rules: d.rules.map((r, i) => (i === idx ? next : r)),
    }))
  }

  const deleteRule = (idx: number) => {
    setDraft((d) => ({
      ...d,
      rules: d.rules.filter((_, i) => i !== idx).map((r, i) => ({ ...r, order: i + 1 })),
    }))
  }

  const addRule = () => {
    setDraft((d) => ({
      ...d,
      rules: [...d.rules, emptyRule(d.rules.length + 1)],
    }))
  }

  const previewBoxes = React.useMemo(() => {
    if (!showPreview) return []
    try {
      return applyPreset(
        draft,
        ALL_POKEMON.filter((p) => activeGenerations.includes(p.generation)),
        ALL_FORMS,
        variations,
        new Set(registered),
      )
    } catch {
      return []
    }
  }, [showPreview, draft, variations, activeGenerations, registered])

  const handleSave = () => {
    const name = (draft.names?.[locale] || draft.name || '').trim()
    if (!name) return
    const finalPreset: OrganizationPreset = {
      ...draft,
      name,
      names: {
        'pt-BR': draft.names['pt-BR']?.trim() || name,
        en: draft.names.en?.trim() || name,
      },
      description: draft.descriptions?.[locale] || draft.description || '',
      descriptions: {
        'pt-BR': draft.descriptions['pt-BR']?.trim() || '',
        en: draft.descriptions.en?.trim() || '',
      },
      // Re-number rules to ensure no gaps.
      rules: draft.rules.map((r, i) => ({ ...r, order: i + 1 })),
    }
    onSave(finalPreset)
    onClose()
  }

  const canSave = (draft.names?.[locale] || draft.name).trim().length > 0 && draft.rules.length > 0
  const ruleIds = draft.rules.map((_, i) => `rule:${i}`)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={initial ? t('editTitle') : t('newTitle')}
      description={t('subtitle')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {tCommon('cancel')}
          </Button>
          <Button variant="accent" onClick={handleSave} disabled={!canSave}>
            {tCommon('save')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] block mb-1.5">
            {t('name')}
          </label>
          <Input
            value={draft.names?.[locale] ?? ''}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                name: e.target.value,
                names: { ...d.names, [locale]: e.target.value },
              }))
            }
            placeholder={t('namePlaceholder')}
            autoFocus
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] block mb-1.5">
            {t('description')}
          </label>
          <Input
            value={draft.descriptions?.[locale] ?? ''}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                description: e.target.value,
                descriptions: { ...d.descriptions, [locale]: e.target.value },
              }))
            }
            placeholder={t('descriptionPlaceholder')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
              {t('rules')}
            </p>
            <Button size="sm" variant="ghost" onClick={addRule}>
              <Plus className="size-3.5" />
              {t('addRule')}
            </Button>
          </div>

          {draft.rules.length === 0 ? (
            <div className="rounded-(--radius-md) border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted-foreground)]">
              {t('noRules')}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={ruleIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {draft.rules.map((rule, i) => (
                    <PresetRuleEditor
                      key={`rule:${i}`}
                      rule={rule}
                      index={i}
                      onChange={(next) => updateRule(i, next)}
                      onDelete={() => deleteRule(i)}
                      generations={activeGenerations}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
              {t('preview')}
            </p>
            <Button
              variant={showPreview ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowPreview((p) => !p)}
            >
              <Eye className="size-3.5" />
              {showPreview ? t('hidePreview') : t('showPreview')}
            </Button>
          </div>
          {showPreview && <PresetPreview boxes={previewBoxes} />}
        </div>
      </div>
    </Dialog>
  )
}
