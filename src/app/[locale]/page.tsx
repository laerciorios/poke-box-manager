'use client'

import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { useHasData } from '@/hooks/useHasData'
import { LandingHero } from '@/components/home/LandingHero'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { CallToAction } from '@/components/home/CallToAction'
import { DashboardOverview } from '@/components/home/DashboardOverview'

export default function HomePage() {
  const hasData = useHasData()
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={hasData === null ? 'pending' : hasData ? 'dashboard' : 'landing'}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 1 } : { opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
      >
        {hasData === null ? (
          <div className="min-h-[60vh] grid place-items-center">
            <div className="size-2 rounded-full bg-[var(--muted-foreground)] animate-pulse" />
          </div>
        ) : hasData ? (
          <DashboardOverview />
        ) : (
          <>
            <LandingHero />
            <FeatureGrid />
            <HowItWorks />
            <CallToAction />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
