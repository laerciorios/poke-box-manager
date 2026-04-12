'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { DEFAULT_FILTERS, type SearchFilters } from '@/lib/search/types'

interface SearchState {
  query: string
  filters: SearchFilters
  isOpen: boolean
  setQuery: (q: string) => void
  setFilter: <K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) => void
  open: () => void
  close: () => void
}

const SearchContext = createContext<SearchState | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQueryRaw] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [isOpen, setIsOpen] = useState(false)
  const initialized = useRef(false)

  // Read ?search= URL param on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const params = new URLSearchParams(window.location.search)
    const q = params.get('search')
    if (q) {
      setQueryRaw(q)
      setIsOpen(true)
    }
  }, [])

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q)
    if (q) setIsOpen(true)
  }, [])

  const setFilter = useCallback(<K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [k]: v }))
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQueryRaw('')
    setFilters(DEFAULT_FILTERS)
  }, [])

  return (
    <SearchContext.Provider value={{ query, filters, isOpen, setQuery, setFilter, open, close }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchState {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}
