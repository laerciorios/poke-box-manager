'use client'

import * as React from 'react'

interface SwContextValue {
  /** True when a new service worker is installed and waiting to take control. */
  updateAvailable: boolean
  /** Tell the waiting SW to skipWaiting + reload the page. */
  applyUpdate: () => void
}

const SwContext = React.createContext<SwContextValue>({
  updateAvailable: false,
  applyUpdate: () => {},
})

export function useServiceWorker(): SwContextValue {
  return React.useContext(SwContext)
}

/**
 * Registers /sw.js in production builds, tracks the lifecycle of an updated
 * worker, and exposes a quiet way for the Header to surface "reload to update".
 *
 * Why opt-in to production only: in `next dev`, hot-module replacement
 * conflicts with cached responses and produces broken pages.
 */
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = React.useState(false)
  const waitingRef = React.useRef<ServiceWorker | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    let registration: ServiceWorkerRegistration | null = null

    function trackWaiting(reg: ServiceWorkerRegistration) {
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingRef.current = reg.waiting
        setUpdateAvailable(true)
      }
    }

    function trackInstalling(installing: ServiceWorker) {
      installing.addEventListener('statechange', () => {
        if (
          installing.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          waitingRef.current = installing
          setUpdateAvailable(true)
        }
      })
    }

    function doRegister() {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          registration = reg
          trackWaiting(reg)
          if (reg.installing) trackInstalling(reg.installing)
          reg.addEventListener('updatefound', () => {
            if (reg.installing) trackInstalling(reg.installing)
          })
        })
        .catch(() => {
          // Best-effort: a registration failure shouldn't break the app.
        })
    }

    // Wait until the page is idle (post-LCP) before touching the SW. Avoids
    // contention with the critical render path on first paint.
    const idleHandle = (
      window as Window &
        typeof globalThis & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }
    ).requestIdleCallback
      ? (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          doRegister,
          { timeout: 2000 },
        )
      : window.setTimeout(doRegister, 1200)

    // When the controller actually changes (i.e. the waiting SW took over),
    // reload so the new assets are reflected.
    let reloading = false
    const onControllerChange = () => {
      if (reloading) return
      reloading = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
      const cancelIdle = (
        window as Window &
          typeof globalThis & { cancelIdleCallback?: (handle: number) => void }
      ).cancelIdleCallback
      if (cancelIdle) cancelIdle(idleHandle as number)
      else window.clearTimeout(idleHandle as number)
      registration = null
    }
  }, [])

  const applyUpdate = React.useCallback(() => {
    const waiting = waitingRef.current
    if (!waiting) {
      window.location.reload()
      return
    }
    waiting.postMessage({ type: 'SKIP_WAITING' })
  }, [])

  return (
    <SwContext.Provider value={{ updateAvailable, applyUpdate }}>
      {children}
    </SwContext.Provider>
  )
}
