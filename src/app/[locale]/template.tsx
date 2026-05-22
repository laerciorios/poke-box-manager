'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useNavDirection } from '@/hooks/useNavDirection'

/**
 * Page transition wrapper.
 *
 * Why a template (not <AnimatePresence mode="wait">):
 * Next App Router swaps the `children` prop of the layout in place when the
 * route changes. With `AnimatePresence mode="wait"` + `key={pathname}` on a
 * motion wrapper, the exit animation fires against children that have
 * already been replaced by the new route's content. After the second
 * navigation the enter step can be skipped entirely, leaving the page
 * blank (only the chrome stays visible).
 *
 * Next's `template.tsx` is purpose-built for per-page transitions: it
 * re-mounts on every navigation, so a simple `initial → animate` is enough.
 * No exit animation, no race against the router. The active route ends up
 * with an entrance animation that respects the user's nav direction.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const direction = useNavDirection()

  const enterY = reduce ? 0 : direction === 'back' ? -8 : direction === 'forward' ? 8 : 0

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: enterY }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  )
}
