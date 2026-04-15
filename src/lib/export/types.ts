import type { Box } from '@/types/box'
import type { SettingsState } from '@/types/settings'
import type { OrganizationPreset } from '@/types/preset'

export interface ExportEnvelope {
  version: number
  exportedAt: string
  app: 'poke-box-manager'
  data: {
    boxes: Box[]
    registered: string[]
    settings: Omit<SettingsState, 'pendingChanges'>
    presets: OrganizationPreset[]
  }
}
