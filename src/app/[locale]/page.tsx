'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStatsData } from '@/hooks/useStatsData'
import { CompletionRing } from '@/components/home/CompletionRing'
import { QuickStats } from '@/components/home/QuickStats'
import { NextUpStrip } from '@/components/home/NextUpStrip'
import { RecentStrip } from '@/components/home/RecentStrip'
import { QuickActions } from '@/components/home/QuickActions'
import { GenerationMilestones } from '@/components/home/GenerationMilestones'
import { PokemonCard } from '@/components/pokemon/PokemonCard'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </h2>
  )
}

export default function HomePage() {
  const t = useTranslations('Home')
  const stats = useStatsData()
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)

  return (
    <>
      <div className="space-y-8">
        {/* Overall Progress */}
        <section className="flex flex-col items-center gap-3">
          <SectionHeading>{t('overallProgress')}</SectionHeading>
          <CompletionRing
            registered={stats.overall.registered}
            total={stats.overall.total}
            percentage={stats.overall.percentage}
          />
        </section>

        {/* Quick Stats */}
        <section className="space-y-3">
          <SectionHeading>{t('quickStats')}</SectionHeading>
          <QuickStats stats={stats} />
        </section>

        {/* Quick Actions */}
        <section className="space-y-3">
          <SectionHeading>{t('quickActions')}</SectionHeading>
          <QuickActions />
        </section>

        {/* Next Up */}
        <section className="space-y-3">
          <SectionHeading>{t('nextUp')}</SectionHeading>
          <NextUpStrip onSelectPokemon={setSelectedPokemonId} />
        </section>

        {/* Recently Added */}
        <section className="space-y-3">
          <SectionHeading>{t('recentlyAdded')}</SectionHeading>
          <RecentStrip onSelectPokemon={setSelectedPokemonId} />
        </section>

        {/* Generation Progress */}
        <section className="space-y-3">
          <SectionHeading>{t('generationProgress')}</SectionHeading>
          <GenerationMilestones byGeneration={stats.byGeneration} />
        </section>
      </div>

      {/* PokemonCard detail sheet */}
      {selectedPokemonId !== null && (
        <PokemonCard
          pokemonId={selectedPokemonId}
          isOpen={true}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </>
  )
}
