'use client'

import { Edit2, Trash2, Copy, Play, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OrganizationPreset } from '@/types/preset'
import type { Locale } from '@/types/locale'

interface Props {
  preset: OrganizationPreset
  locale: Locale
  onApply: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function PresetCard({ preset, locale, onApply, onEdit, onDuplicate, onDelete }: Props) {
  const t = useTranslations('Presets.card')
  const tCommon = useTranslations('Common')

  const displayName = preset.names?.[locale] ?? preset.name
  const description = preset.descriptions?.[locale] ?? preset.description

  return (
    <article className="rounded-(--radius-lg) border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col gap-3 lift">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-tight truncate">
            {displayName}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-snug line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {preset.isBuiltIn && (
          <Badge variant="secondary" className="shrink-0">
            <Lock className="size-2.5" />
            {t('builtIn')}
          </Badge>
        )}
      </header>

      <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)] font-mono tabular-nums">
        <span>{t('ruleCount', { count: preset.rules.length })}</span>
      </div>

      <footer className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t border-[var(--border)]">
        <Button variant="accent" size="sm" onClick={onApply}>
          <Play className="size-3.5" />
          {tCommon('apply')}
        </Button>
        {!preset.isBuiltIn && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="size-3.5" />
            {tCommon('edit')}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onDuplicate}>
          <Copy className="size-3.5" />
          {t('duplicate')}
        </Button>
        <div className="flex-1" />
        {!preset.isBuiltIn && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={tCommon('delete')}
            className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </footer>
    </article>
  )
}
