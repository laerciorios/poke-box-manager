'use client'

import * as React from 'react'
import { Plus, Trash2, Check, X, Edit2, Tags as TagsIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTagsStore } from '@/stores/useTagsStore'
import { TAG_COLOR_PALETTE, tagForeground } from '@/lib/tag-colors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tags'

export function TagsPanel() {
  const t = useTranslations('Tags')
  const tCommon = useTranslations('Common')
  const tags = useTagsStore((s) => s.tags)
  const createTag = useTagsStore((s) => s.createTag)
  const deleteTag = useTagsStore((s) => s.deleteTag)

  const [newName, setNewName] = React.useState('')
  const [newColor, setNewColor] = React.useState<string>(TAG_COLOR_PALETTE[0])
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null)

  const sorted = React.useMemo(
    () => [...tags].sort((a, b) => a.createdAt - b.createdAt),
    [tags],
  )

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    createTag(name, newColor)
    setNewName('')
    // Auto-rotate to the next palette color so consecutive tags feel distinct.
    const idx = TAG_COLOR_PALETTE.indexOf(newColor as (typeof TAG_COLOR_PALETTE)[number])
    setNewColor(TAG_COLOR_PALETTE[(idx + 1) % TAG_COLOR_PALETTE.length])
  }

  return (
    <div className="space-y-5">
      <div className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <div>
          <label htmlFor="new-tag-name" className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] block mb-1.5">
            {t('newName')}
          </label>
          <div className="flex gap-2">
            <Input
              id="new-tag-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCreate()
                }
              }}
              maxLength={32}
              placeholder={t('newPlaceholder')}
              className="flex-1"
            />
            <Button
              variant="accent"
              size="md"
              onClick={handleCreate}
              disabled={!newName.trim()}
            >
              <Plus className="size-4" />
              {tCommon('save')}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)] mb-1.5">
            {t('newColor')}
          </p>
          <ColorPaletteRow value={newColor} onChange={setNewColor} />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-(--radius-md) border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <div className="mx-auto size-9 rounded-md bg-[var(--surface-2)] grid place-items-center text-[var(--muted-foreground)] mb-2">
            <TagsIcon className="size-4" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">{t('empty')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)]">
          {sorted.map((tag) => (
            <TagRow
              key={tag.id}
              tag={tag}
              confirmDelete={confirmDelete === tag.id}
              onAskDelete={() => setConfirmDelete(tag.id)}
              onCancelDelete={() => setConfirmDelete(null)}
              onConfirmDelete={() => {
                deleteTag(tag.id)
                setConfirmDelete(null)
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function TagRow({
  tag,
  confirmDelete,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  tag: Tag
  confirmDelete: boolean
  onAskDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}) {
  const t = useTranslations('Tags')
  const tCommon = useTranslations('Common')
  const updateTag = useTagsStore((s) => s.updateTag)
  const [editing, setEditing] = React.useState(false)
  const [draftName, setDraftName] = React.useState(tag.name)
  const [draftColor, setDraftColor] = React.useState(tag.color)

  React.useEffect(() => {
    if (!editing) {
      setDraftName(tag.name)
      setDraftColor(tag.color)
    }
  }, [editing, tag.name, tag.color])

  function save() {
    const name = draftName.trim()
    if (!name) return
    updateTag(tag.id, { name, color: draftColor })
    setEditing(false)
  }

  return (
    <li className="px-4 py-3 flex flex-col gap-2">
      {editing ? (
        <div className="space-y-2.5">
          <div className="flex gap-2 items-center">
            <span
              className="size-6 rounded-full border border-[var(--border)]"
              style={{ backgroundColor: draftColor }}
              aria-hidden
            />
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={32}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  save()
                } else if (e.key === 'Escape') {
                  setEditing(false)
                }
              }}
              className="flex-1"
            />
            <Button size="icon" variant="ghost" onClick={save} aria-label={tCommon('save')}>
              <Check className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditing(false)}
              aria-label={tCommon('cancel')}
            >
              <X className="size-4" />
            </Button>
          </div>
          <ColorPaletteRow value={draftColor} onChange={setDraftColor} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span
            className="px-2 h-6 inline-flex items-center rounded-(--radius-pill) text-[11px] font-semibold"
            style={{
              backgroundColor: tag.color,
              color: tagForeground(tag.color),
            }}
          >
            {tag.name}
          </span>
          <div className="flex-1" />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditing(true)}
            aria-label={tCommon('edit')}
          >
            <Edit2 className="size-3.5" />
          </Button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[var(--muted-foreground)] mr-1">
                {t('confirmDelete')}
              </span>
              <Button size="sm" variant="ghost" onClick={onCancelDelete}>
                {tCommon('cancel')}
              </Button>
              <Button size="sm" variant="destructive" onClick={onConfirmDelete}>
                {tCommon('delete')}
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={onAskDelete}
              aria-label={tCommon('delete')}
              className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </li>
  )
}

function ColorPaletteRow({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TAG_COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'size-6 rounded-full border transition-transform',
            value === color
              ? 'border-[var(--foreground)] scale-110'
              : 'border-[var(--border)] hover:scale-110',
          )}
          style={{ backgroundColor: color }}
          aria-label={`Color ${color}`}
          aria-pressed={value === color}
        />
      ))}
    </div>
  )
}
