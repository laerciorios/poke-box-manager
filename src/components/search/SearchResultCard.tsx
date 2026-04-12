'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { TYPE_COLORS } from '@/lib/type-colors'
import type { SearchResult } from '@/lib/search/types'

interface SearchResultCardProps {
  result: SearchResult
  locale: string
  onClick: (result: SearchResult) => void
}

export function SearchResultCard({ result, locale, onClick }: SearchResultCardProps) {
  const t = useTranslations('Search')
  const [imgError, setImgError] = useState(false)

  const displayName = locale === 'pt-BR' ? result.namePtBr : result.nameEn

  const locationLabel = result.boxId
    ? t('inBox', { boxName: result.boxName ?? '' })
    : t('notInAnyBox')

  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
      onClick={() => onClick(result)}
    >
      {/* Sprite */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        {imgError ? (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
            <svg className="h-5 w-5 text-muted-foreground/40" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
              <circle cx="50" cy="38" r="20" />
              <ellipse cx="50" cy="78" rx="30" ry="18" />
            </svg>
          </div>
        ) : (
          <Image
            src={result.sprite}
            alt={displayName}
            width={40}
            height={40}
            className="object-contain"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">#{String(result.id).padStart(4, '0')}</span>
          <span className="truncate text-sm font-medium">{displayName}</span>
          {/* Registration pill */}
          <span
            className={cn(
              'ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              result.registered
                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {result.registered ? '✓' : '○'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Type badges */}
          {result.types.filter(Boolean).map((type) => (
            <span
              key={type}
              className="rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: TYPE_COLORS[type!] ?? '#888' }}
            >
              {type}
            </span>
          ))}
          {/* Box location */}
          <span className="ml-auto truncate text-[10px] text-muted-foreground">{locationLabel}</span>
        </div>
      </div>
    </button>
  )
}
