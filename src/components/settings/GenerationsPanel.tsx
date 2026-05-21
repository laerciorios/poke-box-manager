'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function GenerationsPanel() {
  const t = useTranslations('Settings.generations')
  const active = useSettingsStore((s) => s.activeGenerations)
  const setActive = useSettingsStore((s) => s.setActiveGenerations)

  const toggle = (gen: number) => {
    if (active.includes(gen)) {
      setActive(active.filter((g) => g !== gen))
    } else {
      setActive([...active, gen].sort((a, b) => a - b))
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {GENERATIONS.map((g) => {
        const isActive = active.includes(g)
        return (
          <Button
            key={g}
            size="sm"
            variant={isActive ? 'accent' : 'outline'}
            onClick={() => toggle(g)}
            aria-pressed={isActive}
            aria-label={t('select', { n: g })}
          >
            {isActive && <Check className="size-3" strokeWidth={3} />}
            Gen {g}
          </Button>
        )
      })}
    </div>
  )
}
