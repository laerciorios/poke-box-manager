import { getTranslations } from 'next-intl/server'
import { VariationTogglesPanel } from '@/components/settings'

export default async function SettingsPage() {
  const t = await getTranslations('Settings')
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('variationsSection')}</h2>
          <p className="text-sm text-muted-foreground">{t('variationsSectionDescription')}</p>
        </div>
        <VariationTogglesPanel />
      </section>
    </div>
  )
}
