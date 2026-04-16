import { getTranslations } from 'next-intl/server'
import { VariationTogglesPanel } from '@/components/settings'
import { BoxDisplayPanel } from '@/components/settings/BoxDisplayPanel'
import { ShinyTrackerPanel } from '@/components/settings/ShinyTrackerPanel'
import { DataBackupPanel } from '@/components/settings/DataBackupPanel'
import { BoxCalculatorCard } from '@/components/settings/BoxCalculatorCard'

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
          <h2 className="text-lg font-semibold">{t('boxDisplaySection')}</h2>
          <p className="text-sm text-muted-foreground">{t('boxDisplaySectionDescription')}</p>
        </div>
        <BoxDisplayPanel />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('shinyTrackerSection')}</h2>
          <p className="text-sm text-muted-foreground">{t('shinyTrackerSectionDescription')}</p>
        </div>
        <ShinyTrackerPanel />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('variationsSection')}</h2>
          <p className="text-sm text-muted-foreground">{t('variationsSectionDescription')}</p>
        </div>
        <VariationTogglesPanel />
        <BoxCalculatorCard />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('dataBackupSection')}</h2>
          <p className="text-sm text-muted-foreground">{t('dataBackupSectionDescription')}</p>
        </div>
        <DataBackupPanel />
      </section>
    </div>
  )
}
