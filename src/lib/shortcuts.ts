export interface ShortcutEntry {
  /** Key label shown in the help overlay (e.g. "⌘K", "?") */
  keyLabel: string
  /** i18n key under the `ui` namespace */
  descriptionKey: string
}

export const SHORTCUT_REGISTRY: ShortcutEntry[] = [
  { keyLabel: '⌘K / /', descriptionKey: 'shortcuts.focusSearch' },
  { keyLabel: '↑ ↓ ← →', descriptionKey: 'shortcuts.navigateSlots' },
  { keyLabel: 'Enter', descriptionKey: 'shortcuts.toggleRegistration' },
  { keyLabel: 'Esc', descriptionKey: 'shortcuts.closePanel' },
  { keyLabel: '?', descriptionKey: 'shortcuts.showHelp' },
]
