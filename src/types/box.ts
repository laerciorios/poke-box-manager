export const BOX_COLUMNS = 6
export const BOX_ROWS = 5
export const BOX_SIZE = BOX_COLUMNS * BOX_ROWS // 30

export interface BoxSlot {
  pokemonId: number
  formId?: string
  registered: boolean
}

export interface Box {
  id: string
  name: string
  label?: string
  slots: (BoxSlot | null)[]
  wallpaper?: string
}
