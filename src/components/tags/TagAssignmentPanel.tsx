'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tag as TagIcon } from 'lucide-react'

import { useTagsStore } from '@/stores/useTagsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { Button } from '@/components/ui/button'
import { TagDot } from './TagDot'
import { TagManagerModal } from './TagManagerModal'

interface TagAssignmentPanelProps {
  boxId: string
  slotIndex: number
}

export function TagAssignmentPanel({ boxId, slotIndex }: TagAssignmentPanelProps) {
  const tTags = useTranslations('Tags')

  const tags = useTagsStore((s) => s.tags)
  const slotTagIds = useBoxStore((s) => {
    const box = s.boxes.find((b) => b.id === boxId)
    return box?.slots[slotIndex]?.tagIds
  }) ?? []
  const addTagToSlot = useBoxStore((s) => s.addTagToSlot)
  const removeTagFromSlot = useBoxStore((s) => s.removeTagFromSlot)

  const [managerOpen, setManagerOpen] = useState(false)

  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <p className="text-sm text-muted-foreground">{tTags('noTagsYet')}</p>
        <Button variant="outline" size="sm" onClick={() => setManagerOpen(true)}>
          {tTags('createTagsFirst')}
        </Button>
        <TagManagerModal isOpen={managerOpen} onClose={() => setManagerOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {tags.map((tag) => {
        const checked = slotTagIds.includes(tag.id)
        return (
          <label
            key={tag.id}
            className="flex items-center gap-3 rounded-md px-2 py-1.5 cursor-pointer hover:bg-muted transition-colors"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                if (e.target.checked) {
                  addTagToSlot(boxId, slotIndex, tag.id)
                } else {
                  removeTagFromSlot(boxId, slotIndex, tag.id)
                }
              }}
              className="sr-only"
            />
            <div
              className="flex h-4 w-4 items-center justify-center rounded border border-border transition-colors shrink-0"
              style={checked ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
              aria-hidden="true"
            >
              {checked && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <TagDot tag={tag} size={10} />
            <span className="text-sm flex-1">{tag.name}</span>
          </label>
        )
      })}
    </div>
  )
}
