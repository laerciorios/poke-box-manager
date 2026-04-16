import type { ActionType, UndoPayload } from '@/types/history'
import type { Locale } from '@/types/locale'

export function buildDescription(
  actionType: ActionType,
  payload: UndoPayload,
  locale: Locale,
): string {
  const isPtBr = locale === 'pt-BR'

  switch (payload.type) {
    case 'register':
      return isPtBr
        ? `Registrado: ${payload.key}`
        : `Registered: ${payload.key}`

    case 'unregister':
      return isPtBr
        ? `Removido: ${payload.key}`
        : `Unregistered: ${payload.key}`

    case 'bulk-register': {
      const count = payload.keys.length
      return isPtBr
        ? `${count} Pokémon registrados`
        : `${count} Pokémon registered`
    }

    case 'bulk-unregister': {
      const count = payload.keys.length
      return isPtBr
        ? `${count} Pokémon removidos`
        : `${count} Pokémon unregistered`
    }

    case 'move-slot':
      return isPtBr ? 'Pokémon movido' : 'Pokémon moved'

    case 'reorder-box':
      return isPtBr ? 'Box reordenada' : 'Box reordered'

    case 'preset-apply':
      return isPtBr ? 'Preset aplicado' : 'Preset applied'
  }
}
