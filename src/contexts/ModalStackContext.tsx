'use client'

import { createContext, useCallback, useContext, useRef } from 'react'

interface ModalEntry {
  id: string
  close: () => void
}

interface ModalStackContextValue {
  push: (id: string, close: () => void) => void
  pop: (id: string) => void
  closeTop: () => boolean
}

const ModalStackContext = createContext<ModalStackContextValue | null>(null)

export function ModalStackProvider({ children }: { children: React.ReactNode }) {
  const stackRef = useRef<ModalEntry[]>([])

  const push = useCallback((id: string, close: () => void) => {
    stackRef.current = stackRef.current.filter((e) => e.id !== id)
    stackRef.current.push({ id, close })
  }, [])

  const pop = useCallback((id: string) => {
    stackRef.current = stackRef.current.filter((e) => e.id !== id)
  }, [])

  const closeTop = useCallback((): boolean => {
    const top = stackRef.current[stackRef.current.length - 1]
    if (!top) return false
    top.close()
    return true
  }, [])

  return (
    <ModalStackContext.Provider value={{ push, pop, closeTop }}>
      {children}
    </ModalStackContext.Provider>
  )
}

export function useModalStack(): ModalStackContextValue {
  const ctx = useContext(ModalStackContext)
  if (!ctx) throw new Error('useModalStack must be used inside ModalStackProvider')
  return ctx
}
