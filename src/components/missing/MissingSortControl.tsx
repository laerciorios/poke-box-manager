'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { SortKey } from '@/lib/missing-pokemon'

const SORT_KEYS: SortKey[] = ['dex', 'name', 'type', 'generation']

export function MissingSortControl() {
  const t = useTranslations('Missing')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = (searchParams.get('sort') ?? 'dex') as SortKey

  function handleChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'dex') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const labelFor: Record<SortKey, string> = {
    dex: t('sortDex'),
    name: t('sortName'),
    type: t('sortType'),
    generation: t('sortGeneration'),
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{t('sortLabel')}:</span>
      <Select value={currentSort} onValueChange={handleChange}>
        <SelectTrigger size="sm" className="w-40">
          {labelFor[currentSort]}
        </SelectTrigger>
        <SelectContent>
          {SORT_KEYS.map((key) => (
            <SelectItem key={key} value={key}>
              {labelFor[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
