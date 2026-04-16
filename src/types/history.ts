import type { Box, BoxSlot } from './box'

export type ActionType =
  | 'register'
  | 'unregister'
  | 'bulk-register'
  | 'bulk-unregister'
  | 'move-slot'
  | 'reorder-box'
  | 'preset-apply'

export type UndoPayload =
  | { type: 'register'; key: string }
  | { type: 'unregister'; key: string }
  | { type: 'bulk-register'; keys: string[] }
  | { type: 'bulk-unregister'; keys: string[] }
  | { type: 'move-slot'; fromBoxId: string; fromIndex: number; toBoxId: string; toIndex: number; fromSlot: BoxSlot | null; toSlot: BoxSlot | null }
  | { type: 'reorder-box'; boxId: string; previousIndex: number }
  | { type: 'preset-apply'; previousBoxes: Box[] }

export interface ActivityEntry {
  id: string
  timestamp: number
  actionType: ActionType
  description: string
  undoPayload: UndoPayload
}
