import { VariationTogglesPanel } from '@/components/settings'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Configure your preferences.</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Variations</h2>
          <p className="text-sm text-muted-foreground">
            Choose which Pokémon variation types to include in your tracking.
          </p>
        </div>
        <VariationTogglesPanel />
      </section>
    </div>
  )
}
