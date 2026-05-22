'use client'

import { useTranslations } from 'next-intl'
import { Sparkles, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatsTab = 'overall' | 'shiny'

interface Props {
  value: StatsTab
  onChange: (tab: StatsTab) => void
}

export function ShinyTabToggle({ value, onChange }: Props) {
  const t = useTranslations('Stats')
  return (
    <div
      role="tablist"
      aria-label={t('tabs.label')}
      className="inline-flex items-center gap-1 rounded-(--radius-md) border border-[var(--border)] bg-[var(--surface)] p-1"
    >
      <TabButton
        active={value === 'overall'}
        onClick={() => onChange('overall')}
        label={t('tabs.overall')}
        icon={BarChart3}
      />
      <TabButton
        active={value === 'shiny'}
        onClick={() => onChange('shiny')}
        label={t('tabs.shiny')}
        icon={Sparkles}
        activeColor="var(--shiny)"
      />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
  icon: Icon,
  activeColor = 'var(--registered)',
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ComponentType<{ className?: string }>
  activeColor?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-(--radius-sm) text-xs font-medium transition-colors',
        active
          ? 'bg-[var(--surface-2)] text-[var(--foreground)] shadow-[var(--shadow-soft)]'
          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]/60',
      )}
      style={active ? { color: 'var(--foreground)' } : undefined}
    >
      <Icon
        className="size-3.5"
        aria-hidden
        {...(active ? { style: { color: activeColor } } : {})}
      />
      {label}
    </button>
  )
}
