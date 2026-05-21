'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import {
  MoreHorizontal,
  Eraser,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'

interface Props {
  boxName: string
  canMoveUp: boolean
  canMoveDown: boolean
  onClearAll: () => void
  onMarkAllRegistered: () => void
  onUnmarkAllRegistered: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function BoxActionsMenu({
  boxName,
  canMoveUp,
  canMoveDown,
  onClearAll,
  onMarkAllRegistered,
  onUnmarkAllRegistered,
  onMoveUp,
  onMoveDown,
}: Props) {
  const t = useTranslations('Boxes')
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [menu, setMenu] = React.useState<{ x: number; y: number } | null>(null)

  const open = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMenu({ x: rect.right - 200, y: rect.bottom + 4 })
  }

  const items: ContextMenuItem[] = [
    {
      label: t('markAllRegistered'),
      icon: <CheckCircle2 />,
      onSelect: onMarkAllRegistered,
    },
    {
      label: t('unmarkAllRegistered'),
      icon: <Circle />,
      onSelect: onUnmarkAllRegistered,
    },
    {
      label: t('moveBoxUp'),
      icon: <ArrowUp />,
      disabled: !canMoveUp,
      onSelect: onMoveUp,
    },
    {
      label: t('moveBoxDown'),
      icon: <ArrowDown />,
      disabled: !canMoveDown,
      onSelect: onMoveDown,
    },
    {
      label: t('clearAll'),
      icon: <Eraser />,
      destructive: true,
      onSelect: () => {
        if (window.confirm(t('clearAllConfirm', { name: boxName }))) onClearAll()
      },
    },
  ]

  return (
    <>
      <Button
        ref={triggerRef}
        size="icon"
        variant="ghost"
        onClick={open}
        aria-label={t('boxActions')}
        title={t('boxActions')}
      >
        <MoreHorizontal className="size-4" />
      </Button>
      <ContextMenu
        open={menu !== null}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={items}
        onClose={() => setMenu(null)}
      />
    </>
  )
}
