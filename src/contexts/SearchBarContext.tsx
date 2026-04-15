'use client'

import { createContext, useContext, useRef } from 'react'

interface SearchBarContextValue {
  inputRef: React.RefObject<HTMLInputElement | null>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

export function SearchBarProvider({ children }: { children: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <SearchBarContext.Provider value={{ inputRef }}>
      {children}
    </SearchBarContext.Provider>
  )
}

export function useSearchBar(): SearchBarContextValue {
  const ctx = useContext(SearchBarContext)
  if (!ctx) throw new Error('useSearchBar must be used inside SearchBarProvider')
  return ctx
}
