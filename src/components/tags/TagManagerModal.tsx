'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useTagsStore } from '@/stores/useTagsStore'
import { TAG_COLOR_PALETTE } from '@/lib/tag-colors'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TagColorSwatch } from './TagColorSwatch'
import { TagDot } from './TagDot'
import type { Tag } from '@/types/tags'

interface TagManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TagRowProps {
  tag: Tag
  onEdit: (tag: Tag) => void
  onDelete: (id: string) => void
  tTags: ReturnType<typeof useTranslations>
}

function TagRow({ tag, onEdit, onDelete, tTags }: TagRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <TagDot tag={tag} size={12} />
      <span className="flex-1 text-sm truncate">{tag.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={() => onEdit(tag)}
        aria-label={tTags('editTag', { name: tag.name })}
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
        onClick={() => onDelete(tag.id)}
        aria-label={tTags('deleteTag', { name: tag.name })}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

interface TagFormProps {
  initialName?: string
  initialColor?: string
  onSave: (name: string, color: string) => void
  onCancel: () => void
  tTags: ReturnType<typeof useTranslations>
  tCommon: ReturnType<typeof useTranslations>
}

function TagForm({ initialName = '', initialColor, onSave, onCancel, tTags, tCommon }: TagFormProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor ?? TAG_COLOR_PALETTE[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed, color)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 32))}
        placeholder={tTags('namePlaceholder')}
        maxLength={32}
        autoFocus
        className="h-8 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {TAG_COLOR_PALETTE.map((c) => (
          <TagColorSwatch
            key={c}
            color={c}
            selected={color === c}
            onClick={setColor}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" size="sm" disabled={!name.trim()}>
          {tCommon('save')}
        </Button>
      </div>
    </form>
  )
}

export function TagManagerModal({ isOpen, onClose }: TagManagerModalProps) {
  const tTags = useTranslations('Tags')
  const tCommon = useTranslations('Common')

  const tags = useTagsStore((s) => s.tags)
  const createTag = useTagsStore((s) => s.createTag)
  const updateTag = useTagsStore((s) => s.updateTag)
  const deleteTag = useTagsStore((s) => s.deleteTag)

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = (name: string, color: string) => {
    createTag(name, color)
    setIsCreating(false)
  }

  const handleUpdate = (name: string, color: string) => {
    if (!editingId) return
    updateTag(editingId, { name, color })
    setEditingId(null)
  }

  const editingTag = editingId ? tags.find((t) => t.id === editingId) : undefined

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{tTags('manageTitle')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {tags.length === 0 && !isCreating && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {tTags('emptyState')}
            </p>
          )}

          {tags.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {tags.map((tag) =>
                editingId === tag.id && editingTag ? (
                  <div key={tag.id} className="py-2 border-b border-border last:border-0">
                    <TagForm
                      initialName={editingTag.name}
                      initialColor={editingTag.color}
                      onSave={handleUpdate}
                      onCancel={() => setEditingId(null)}
                      tTags={tTags}
                      tCommon={tCommon}
                    />
                  </div>
                ) : (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    onEdit={(t) => { setIsCreating(false); setEditingId(t.id) }}
                    onDelete={deleteTag}
                    tTags={tTags}
                  />
                ),
              )}
            </div>
          )}

          {isCreating ? (
            <TagForm
              onSave={handleCreate}
              onCancel={() => setIsCreating(false)}
              tTags={tTags}
              tCommon={tCommon}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 self-start"
              onClick={() => { setEditingId(null); setIsCreating(true) }}
            >
              <Plus className="size-3.5" />
              {tTags('newTag')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
