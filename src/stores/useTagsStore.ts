import { createPersistedStore } from '@/lib/store'
import type { Tag } from '@/types/tags'
import { TAG_COLOR_PALETTE } from '@/lib/tag-colors'

interface TagsState {
  tags: Tag[]
  createTag: (name: string, color?: string) => void
  updateTag: (id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>) => void
  deleteTag: (id: string) => void
}

export const useTagsStore = createPersistedStore<TagsState>(
  'tags',
  (set, get) => ({
    tags: [],

    createTag: (name, color) => {
      const tag: Tag = {
        id: crypto.randomUUID(),
        name: name.trim().slice(0, 32),
        color: color ?? TAG_COLOR_PALETTE[get().tags.length % TAG_COLOR_PALETTE.length],
        createdAt: Date.now(),
      }
      set({ tags: [...get().tags, tag] })
    },

    updateTag: (id, updates) => {
      set({
        tags: get().tags.map((t) =>
          t.id === id
            ? {
                ...t,
                ...(updates.name !== undefined ? { name: updates.name.trim().slice(0, 32) } : {}),
                ...(updates.color !== undefined ? { color: updates.color } : {}),
              }
            : t,
        ),
      })
    },

    deleteTag: (id) => {
      set({ tags: get().tags.filter((t) => t.id !== id) })
      // Lazily import to avoid circular dependency
      import('@/stores/useBoxStore').then(({ useBoxStore }) => {
        useBoxStore.getState().purgeTagId(id)
      })
    },
  }),
  { version: 1 },
)
