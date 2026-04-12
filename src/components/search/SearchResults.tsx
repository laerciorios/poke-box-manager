'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useBoxStore } from '@/stores/useBoxStore'
import { useSearch } from '@/contexts/SearchContext'
import { SEARCH_INDEX, search } from '@/lib/search/engine'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SearchFilterChips } from './SearchFilterChips'
import { SearchResultCard } from './SearchResultCard'
import type { SearchResult } from '@/lib/search/types'

export function SearchResults() {
  const t = useTranslations('Search')
  const locale = useLocale()
  const router = useRouter()
  const { query, filters, isOpen, close } = useSearch()
  const registered = usePokedexStore((s) => s.registered)
  const boxes = useBoxStore((s) => s.boxes)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const registeredSet = useMemo(() => new Set(registered), [registered])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return search(query, SEARCH_INDEX, filters, boxes, registeredSet)
  }, [query, filters, boxes, registeredSet])

  // Close on outside click (desktop dropdown only)
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, close])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  function handleResultClick(result: SearchResult) {
    if (result.boxId !== null) {
      router.push(`/boxes?box=${result.boxId}&slot=${result.slotIndex}`)
    }
    close()
  }

  const isEmpty = query.trim() && results.length === 0
  const showPanel = isOpen && !!query.trim()

  const panelContent = (
    <div className="flex flex-col">
      <div className="px-3 pt-3 pb-2">
        <SearchFilterChips />
      </div>
      {isEmpty ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          {t('emptyState', { query })}
        </p>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto px-1 py-1">
          <p className="px-3 pb-1 text-xs text-muted-foreground">
            {results.length === 1 ? t('resultCount', { count: 1 }) : t('resultCountPlural', { count: results.length })}
          </p>
          {results.map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
              locale={locale}
              onClick={handleResultClick}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop: absolute-positioned dropdown below SearchBar */}
      {showPanel && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-1 hidden w-[420px] rounded-xl border bg-popover shadow-lg md:block"
        >
          {panelContent}
        </div>
      )}

      {/* Mobile: bottom Sheet — only open when actually on a mobile viewport */}
      <Sheet open={showPanel && isMobile} onOpenChange={(open) => { if (!open) close() }}>
        <SheetContent side="bottom" className="md:hidden max-h-[85vh] p-0 rounded-t-xl">
          {panelContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
