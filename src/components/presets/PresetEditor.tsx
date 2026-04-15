'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { RuleRow } from './RuleRow'
import { PresetPreview } from './PresetPreview'
import { BUILTIN_PRESETS } from '@/lib/presets/builtin-presets'
import { usePresetsStore } from '@/stores/usePresetsStore'
import { useModalStack } from '@/contexts/ModalStackContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { OrganizationPreset, PresetRule } from '@/types/preset'

const EMPTY_RULE: PresetRule = {
  order: 0,
  filter: {},
  sort: 'dex-number',
  boxNameTemplate: '',
}

function makeEmptyRule(): PresetRule {
  return { ...EMPTY_RULE }
}

interface PresetEditorProps {
  open: boolean
  onClose: () => void
  initialPreset?: OrganizationPreset
}

interface PresetEditorContentProps {
  t: ReturnType<typeof useTranslations<'Presets'>>
  name: string
  rules: PresetRule[]
  canSave: boolean
  isEditMode: boolean
  onNameChange: (val: string) => void
  onSeedFromBuiltin: (presetId: string | null) => void
  onRuleChange: (index: number, updated: PresetRule) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onDeleteRule: (index: number) => void
  onAddRule: () => void
  onSave: () => void
  onCancel: () => void
}

function PresetEditorContent({
  t,
  name,
  rules,
  canSave,
  isEditMode,
  onNameChange,
  onSeedFromBuiltin,
  onRuleChange,
  onMoveUp,
  onMoveDown,
  onDeleteRule,
  onAddRule,
  onSave,
  onCancel,
}: PresetEditorContentProps) {
  return (
    <>
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t('nameLabel')} *</label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={60}
            placeholder={t('newPresetNamePlaceholder')}
            aria-required
          />
          {!canSave && name.length > 0 && (
            <p className="text-xs text-destructive">{t('nameRequired')}</p>
          )}
        </div>

        {/* Seed from built-in */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium shrink-0">{t('seedFrom')}</span>
          <Select onValueChange={onSeedFromBuiltin}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder={t('selectBuiltInPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {BUILTIN_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Rules */}
        <div className="space-y-3">
          <p className="text-sm font-medium">{t('rulesLabel')}</p>
          {rules.map((rule, i) => (
            <RuleRow
              key={i}
              rule={rule}
              index={i}
              total={rules.length}
              onChange={(updated) => onRuleChange(i, updated)}
              onMoveUp={() => onMoveUp(i)}
              onMoveDown={() => onMoveDown(i)}
              onDelete={() => onDeleteRule(i)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddRule}
            className="w-full"
          >
            <Plus className="mr-2 size-4" />
            {t('addRule')}
          </Button>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('previewLabel')}</p>
          <PresetPreview rules={rules} name={name || 'Preview'} />
        </div>
      </div>

      {/* Footer (used in both Dialog and Sheet) */}
      <div className="shrink-0 flex justify-end gap-2 p-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button onClick={onSave} disabled={!canSave}>
          {t('save')}
        </Button>
      </div>
    </>
  )
}

export function PresetEditor({ open, onClose, initialPreset }: PresetEditorProps) {
  const t = useTranslations('Presets')
  const { createPreset, updatePreset } = usePresetsStore()
  const { push, pop } = useModalStack()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [name, setName] = useState('')
  const [rules, setRules] = useState<PresetRule[]>([makeEmptyRule()])
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (open) {
      push('preset-editor', onClose)
    } else {
      pop('preset-editor')
    }
  }, [open, onClose, push, pop])

  // Reset state when dialog opens/initialPreset changes
  useEffect(() => {
    if (open) {
      if (initialPreset) {
        setName(initialPreset.name)
        setRules(initialPreset.rules.map((r) => ({ ...r })))
      } else {
        setName('')
        setRules([makeEmptyRule()])
      }
      setIsDirty(false)
    }
  }, [open, initialPreset])

  function handleNameChange(val: string) {
    setName(val)
    setIsDirty(true)
  }

  function handleSeedFromBuiltin(presetId: string | null) {
    if (!presetId) return
    const preset = BUILTIN_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    if (
      isDirty &&
      rules.some(
        (r) =>
          r.filter.categories?.length || r.filter.generations?.length || r.filter.types?.length,
      )
    ) {
      if (!window.confirm(t('confirmReplaceRules'))) return
    }
    setRules(preset.rules.map((r) => ({ ...r })))
    setIsDirty(true)
  }

  function handleRuleChange(index: number, updated: PresetRule) {
    const next = [...rules]
    next[index] = updated
    setRules(next)
    setIsDirty(true)
  }

  function handleMoveUp(index: number) {
    if (index === 0) return
    const next = [...rules]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setRules(next)
    setIsDirty(true)
  }

  function handleMoveDown(index: number) {
    if (index === rules.length - 1) return
    const next = [...rules]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setRules(next)
    setIsDirty(true)
  }

  function handleDeleteRule(index: number) {
    setRules(rules.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  function handleAddRule() {
    setRules([...rules, makeEmptyRule()])
    setIsDirty(true)
  }

  function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) return

    const orderedRules = rules.map((r, i) => ({ ...r, order: i + 1 }))

    if (initialPreset?.id) {
      updatePreset(initialPreset.id, {
        name: trimmedName,
        names: { en: trimmedName, 'pt-BR': trimmedName },
        rules: orderedRules,
      })
    } else {
      createPreset({
        name: trimmedName,
        names: { en: trimmedName, 'pt-BR': trimmedName },
        description: '',
        descriptions: { en: '', 'pt-BR': '' },
        isBuiltIn: false,
        rules: orderedRules,
      })
    }
    onClose()
  }

  function handleCancel() {
    if (isDirty && !window.confirm(t('unsavedChangesDescription'))) return
    onClose()
  }

  const canSave = name.trim().length > 0
  const title = initialPreset?.id ? t('editPreset') : t('newPreset')

  const contentProps: PresetEditorContentProps = {
    t,
    name,
    rules,
    canSave,
    isEditMode: !!initialPreset?.id,
    onNameChange: handleNameChange,
    onSeedFromBuiltin: handleSeedFromBuiltin,
    onRuleChange: handleRuleChange,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onDeleteRule: handleDeleteRule,
    onAddRule: handleAddRule,
    onSave: handleSave,
    onCancel: handleCancel,
  }

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(isOpen) => { if (!isOpen) handleCancel() }}
      >
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[90dvh] flex-col gap-0 p-0"
        >
          <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <PresetEditorContent {...contentProps} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) handleCancel() }}
    >
      <DialogContent
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <PresetEditorContent {...contentProps} />
      </DialogContent>
    </Dialog>
  )
}
