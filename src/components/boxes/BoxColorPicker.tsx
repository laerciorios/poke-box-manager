'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Check, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BOX_LABEL_COLORS, BOX_LABEL_KEYS } from '@/lib/box-label-colors'
import { cn } from '@/lib/utils'

interface Props {
  current?: string
  onChange: (label: string | undefined) => void
}

export function BoxColorPicker({ current, onChange }: Props) {
  const t = useTranslations('Boxes')
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('boxColor')}
        title={t('boxColor')}
      >
        {current ? (
          <span
            aria-hidden
            className={cn('size-3.5 rounded-full inline-block', BOX_LABEL_COLORS[current])}
          />
        ) : (
          <Palette className="size-3.5" />
        )}
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-30 rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] p-2 flex gap-1.5"
        >
          <button
            type="button"
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
            className={cn(
              'size-6 rounded-full border border-dashed border-[var(--border-strong)] grid place-items-center text-[var(--muted-foreground)]',
              !current && 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--card)]',
            )}
            aria-label={t('noColor')}
            title={t('noColor')}
          >
            {!current && <Check className="size-3" strokeWidth={3} />}
          </button>
          {BOX_LABEL_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key)
                setOpen(false)
              }}
              aria-label={key}
              title={key}
              className={cn(
                'size-6 rounded-full grid place-items-center text-white',
                BOX_LABEL_COLORS[key],
                current === key && 'ring-2 ring-[var(--foreground)] ring-offset-1 ring-offset-[var(--card)]',
              )}
            >
              {current === key && <Check className="size-3" strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
