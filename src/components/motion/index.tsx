'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import * as React from 'react'

const ease = [0.22, 1, 0.36, 1] as const

/** Fade-in + small upward slide. */
export function FadeIn({
  children,
  delay = 0,
  className,
  as = 'div',
  y = 12,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'span' | 'li'
  y?: number
}) {
  const reduce = useReducedMotion()
  const Component = motion[as] as typeof motion.div
  return (
    <Component
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease }}
    >
      {children}
    </Component>
  )
}

/** On-scroll reveal — triggers once when in viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

const staggerParent: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  )
}

/** Count-up animation for numeric stats. */
export function CountUp({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const reduce = useReducedMotion()
  const [value, setValue] = React.useState(reduce ? to : 0)

  React.useEffect(() => {
    if (reduce) {
      setValue(to)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const elapsed = (t - start) / 1000
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration, reduce])

  return <>{value.toLocaleString()}</>
}
