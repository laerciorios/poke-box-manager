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
import { Target } from 'lucide-react'

const NEXT_UP_OPTIONS = [5, 10, 20, 50]

interface NextUpBannerProps {
  count: number
}

export function NextUpBanner({ count }: NextUpBannerProps) {
  const t = useTranslations('Missing')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleCountChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) return
    params.set('nextup', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-accent/10 px-4 py-2.5 text-sm">
      <Target className="h-4 w-4 shrink-0 text-accent-foreground" />
      <span className="flex-1 text-accent-foreground">
        {t('nextUpBanner', { count })}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{t('nextUpCountLabel')}:</span>
        <Select value={String(count)} onValueChange={handleCountChange}>
          <SelectTrigger size="sm" className="w-16">
            {count}
          </SelectTrigger>
          <SelectContent>
            {NEXT_UP_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
