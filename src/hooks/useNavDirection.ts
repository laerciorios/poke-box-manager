'use client'

import * as React from 'react'
import { usePathname } from '@/i18n/navigation'

export type NavDirection = 'forward' | 'back' | 'none'

/**
 * Reports whether the user navigated forward (link click, router.push) or
 * back (browser back button, history.go(-1)) at the current pathname change.
 *
 * Strategy: hook into `popstate` (fired only on back/forward) to flip a flag,
 * then read+reset that flag on pathname change. If we see a pathname change
 * without a recent popstate, it must have been a forward push.
 *
 * On the initial mount we return 'none' so the first render doesn't animate.
 */
export function useNavDirection(): NavDirection {
  const pathname = usePathname()
  const lastPath = React.useRef<string>(pathname)
  const poppedRef = React.useRef<boolean>(false)
  const [direction, setDirection] = React.useState<NavDirection>('none')

  React.useEffect(() => {
    const onPop = () => {
      poppedRef.current = true
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  React.useEffect(() => {
    if (pathname === lastPath.current) return
    const wasBack = poppedRef.current
    poppedRef.current = false
    lastPath.current = pathname
    setDirection(wasBack ? 'back' : 'forward')
  }, [pathname])

  return direction
}
