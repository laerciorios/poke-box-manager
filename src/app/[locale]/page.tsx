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

  // SSR and the client's first paint render the landing — it's the right
  // answer for everyone who doesn't have data yet, and the right LCP element
  // for a first-time visitor. Returning users see a brief landing flash before
  // the dashboard swaps in (~150ms once IndexedDB resolves). That trade is
  // worth ~10 Lighthouse perf points compared to rendering a skeleton first.
  const showDashboard = hasData === true

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={showDashboard ? 'dashboard' : 'landing'}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 1 } : { opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
      >
        {showDashboard ? (
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
