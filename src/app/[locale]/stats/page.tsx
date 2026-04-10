import { getTranslations } from 'next-intl/server'
import { StatsClientPage } from '@/components/stats/StatsClientPage'

export default async function StatsPage() {
  const t = await getTranslations('Stats')

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-1 text-muted-foreground">{t('pageSubtitle')}</p>
      </div>
      <StatsClientPage
        t={{
          overallSection: t('overallSection'),
          registeredLabel: t('registeredLabel'),
          totalLabel: t('totalLabel'),
          generationSection: t('generationSection'),
          typeSection: t('typeSection'),
          heatmapSection: t('heatmapSection'),
          boxSummarySection: t('boxSummarySection'),
          boxComplete: t('boxComplete'),
          boxPartial: t('boxPartial'),
          boxEmpty: t('boxEmpty'),
          emptyState: t('emptyState'),
        }}
      />
    </div>
  )
}
