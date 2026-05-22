'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Tags as TagsIcon, X, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useTagsStore } from '@/stores/useTagsStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { tagForeground } from '@/lib/tag-colors'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  x: number
  y: number
  boxId: string
  slotIndex: number
  onClose: () => void
}

/**
 * Floating popover that appears anchored to a slot context-menu click.
 * Shows all user-defined tags as toggleable checkboxes for that slot.
 */
export function TagSlotPicker({ open, x, y, boxId, slotIndex, onClose }: Props) {
  const t = useTranslations('Tags')
  const reduce = useReducedMotion()
  const tags = useTagsStore((s) => s.tags)
  const boxes = useBoxStore((s) => s.boxes)
  const addTagToSlot = useBoxStore((s) => s.addTagToSlot)
  const removeTagFromSlot = useBoxStore((s) => s.removeTagFromSlot)
  const ref = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState({ x, y })

  const slot = boxes.find((b) => b.id === boxId)?.slots[slotIndex] ?? null
  const appliedIds = React.useMemo(() => new Set(slot?.tagIds ?? []), [slot])

  React.useEffect(() => {
    if (!open) return
    const onFrame = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pad = 8
      let nx = x
      let ny = y
      if (nx + rect.width > window.innerWidth - pad) nx = window.innerWidth - rect.width - pad
      if (ny + rect.height > window.innerHeight - pad) ny = window.innerHeight - rect.height - pad
      setPos({ x: Math.max(pad, nx), y: Math.max(pad, ny) })
    }
    onFrame()
    const raf = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(raf)
  }, [open, x, y])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onClose, true)
    window.addEventListener('resize', onClose)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onClose, true)
      window.removeEventListener('resize', onClose)
    }
  }, [open, onClose])

  const toggle = (tagId: string) => {
    if (appliedIds.has(tagId)) {
      removeTagFromSlot(boxId, slotIndex, tagId)
    } else {
      addTagToSlot(boxId, slotIndex, tagId)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="menu"
          aria-label={t('slotPickerLabel')}
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', top: pos.y, left: pos.x, zIndex: 70, minWidth: 220 }}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] py-1.5"
        >
          <div className="flex items-center gap-2 px-3 pb-1.5 border-b border-[var(--border)] mb-1">
            <TagsIcon className="size-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
              {t('slotPickerTitle')}
            </span>
            <span className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] -mr-1"
              aria-label={t('close')}
            >
              <X className="size-3.5" />
            </button>
          </div>

          {tags.length === 0 ? (
            <div className="px-3 py-3 max-w-xs">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">{t('noTags')}</p>
              <Link
                href="/settings"
                onClick={onClose}
                className="text-xs text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {t('manageInSettings')}
              </Link>
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {tags.map((tag) => {
                const applied = appliedIds.has(tag.id)
                return (
                  <li key={tag.id}>
                    <button
                      type="button"
                      role="menuitemcheckbox"
                      aria-checked={applied}
                      onClick={() => toggle(tag.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                        'hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] focus:outline-none',
                      )}
                    >
                      <span
                        className="size-3.5 rounded grid place-items-center shrink-0"
                        style={{
                          backgroundColor: applied ? tag.color : 'transparent',
                          border: `1.5px solid ${tag.color}`,
                        }}
                      >
                        {applied && (
                          <Check
                            className="size-2.5"
                            strokeWidth={4}
                            style={{ color: tagForeground(tag.color) }}
                          />
                        )}
                      </span>
                      <span className="flex-1 truncate">{tag.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
