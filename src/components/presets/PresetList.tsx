'use client'

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
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{preset.name}</span>
            {isBuiltIn && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Built-in
              </Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {preset.description}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {preset.rules.length} rule{preset.rules.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {isBuiltIn ? (
          <>
            <Button size="sm" variant="outline" onClick={onCustomize}>
              Customize
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate}>
              Duplicate
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate}>
              Duplicate
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={onDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

export function PresetList({ onEdit, onNew }: PresetListProps) {
  const { presets, duplicatePreset, deletePreset, createPreset } = usePresetsStore()

  function handleDuplicateBuiltin(preset: OrganizationPreset) {
    createPreset({
      ...preset,
      name: `${preset.name} (Copy)`,
      isBuiltIn: false,
    })
  }

  function handleDelete(presetId: string) {
    if (window.confirm('Delete this preset? This cannot be undone.')) {
      deletePreset(presetId)
    }
  }

  function handleCustomize(preset: OrganizationPreset) {
    onEdit({
      ...preset,
      id: '',
      name: `${preset.name} (Custom)`,
      isBuiltIn: false,
    })
  }

  return (
    <div className="space-y-8">
      {/* Built-in presets */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Built-in Presets</h2>
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
        <h2 className="mb-4 text-lg font-semibold">My Presets</h2>
        {presets.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">You haven&apos;t created any custom presets yet.</p>
            <Button className="mt-4" onClick={onNew}>
              Create your first preset
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
