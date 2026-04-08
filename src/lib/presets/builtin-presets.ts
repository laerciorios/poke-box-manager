import type { OrganizationPreset } from '@/types/preset'

export const BUILTIN_PRESETS: OrganizationPreset[] = [
  // 1. National Dex Order
  {
    id: 'national-dex-order',
    name: 'National Dex Order',
    names: {
      en: 'National Dex Order',
      'pt-BR': 'Ordem da Dex Nacional',
    },
    description: 'All Pokémon organized sequentially from #001 to #1025, 30 per box.',
    descriptions: {
      en: 'All Pokémon organized sequentially from #001 to #1025, 30 per box.',
      'pt-BR': 'Todos os Pokémon organizados sequencialmente do #001 ao #1025, 30 por box.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: {},
        sort: 'dex-number',
        boxNameTemplate: '{start}–{end}',
      },
    ],
  },

  // 2. Legends First
  {
    id: 'legends-first',
    name: 'Legends First',
    names: {
      en: 'Legends First',
      'pt-BR': 'Lendários Primeiro',
    },
    description: 'Legendaries → Mythicals → remaining Pokémon, each in dex order.',
    descriptions: {
      en: 'Legendaries → Mythicals → remaining Pokémon, each in dex order.',
      'pt-BR': 'Lendários → Míticos → Pokémon restantes, cada grupo em ordem da dex.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: { categories: ['legendary'] },
        sort: 'dex-number',
        boxNameTemplate: 'Legendaries {n}',
      },
      {
        order: 2,
        filter: { categories: ['mythical'] },
        sort: 'dex-number',
        boxNameTemplate: 'Mythicals {n}',
      },
      {
        order: 3,
        filter: {},
        sort: 'dex-number',
        boxNameTemplate: '{start}–{end} (no legends)',
      },
    ],
  },

  // 3. Gen by Gen
  {
    id: 'gen-by-gen',
    name: 'Gen by Gen',
    names: {
      en: 'Gen by Gen',
      'pt-BR': 'Geração por Geração',
    },
    description: 'Each generation fills its own set of boxes, in dex order within each generation.',
    descriptions: {
      en: 'Each generation fills its own set of boxes, in dex order within each generation.',
      'pt-BR': 'Cada geração ocupa seu próprio conjunto de boxes, em ordem da dex dentro de cada geração.',
    },
    isBuiltIn: true,
    rules: [
      { order: 1, filter: { generations: [1] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 2, filter: { generations: [2] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 3, filter: { generations: [3] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 4, filter: { generations: [4] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 5, filter: { generations: [5] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 6, filter: { generations: [6] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 7, filter: { generations: [7] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 8, filter: { generations: [8] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
      { order: 9, filter: { generations: [9] }, sort: 'dex-number', boxNameTemplate: 'Gen {gen} ({n}/{total})' },
    ],
  },

  // 4. Type Sorted
  {
    id: 'type-sorted',
    name: 'Type Sorted',
    names: {
      en: 'Type Sorted',
      'pt-BR': 'Por Tipo',
    },
    description: 'Pokémon grouped by primary type in canonical order, sorted by dex number within each type.',
    descriptions: {
      en: 'Pokémon grouped by primary type in canonical order, sorted by dex number within each type.',
      'pt-BR': 'Pokémon agrupados por tipo primário na ordem canônica, ordenados por número da dex dentro de cada tipo.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: {},
        sort: 'type-primary',
        boxNameTemplate: '{type} {n}',
      },
    ],
  },

  // 5. Evolution Chain
  {
    id: 'evolution-chain',
    name: 'Evolution Chain',
    names: {
      en: 'Evolution Chain',
      'pt-BR': 'Cadeia Evolutiva',
    },
    description: 'Pokémon grouped by evolution family, keeping each chain together.',
    descriptions: {
      en: 'Pokémon grouped by evolution family, keeping each chain together.',
      'pt-BR': 'Pokémon agrupados por família evolutiva, mantendo cada cadeia unida.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: {},
        sort: 'evolution-chain',
        boxNameTemplate: 'Families {n}',
      },
    ],
  },

  // 6. Competitive Living Dex
  {
    id: 'competitive-living-dex',
    name: 'Competitive Living Dex',
    names: {
      en: 'Competitive Living Dex',
      'pt-BR': 'Living Dex Competitivo',
    },
    description: 'Normal-category Pokémon first (competitive pool), then restricted legendaries/mythicals, then others.',
    descriptions: {
      en: 'Normal-category Pokémon first (competitive pool), then restricted legendaries/mythicals, then others.',
      'pt-BR': 'Pokémon da categoria normal primeiro (pool competitivo), depois lendários/míticos restritos, depois os demais.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: { categories: ['normal'] },
        sort: 'dex-number',
        boxNameTemplate: 'Comp. {n}',
      },
      {
        order: 2,
        filter: { categories: ['legendary', 'mythical'] },
        sort: 'dex-number',
        boxNameTemplate: 'Restricted {n}',
      },
      {
        order: 3,
        filter: {},
        sort: 'dex-number',
        boxNameTemplate: 'Others {n}',
      },
    ],
  },

  // 7. Regional Dex
  {
    id: 'regional-dex',
    name: 'Regional Dex',
    names: {
      en: 'Regional Dex',
      'pt-BR': 'Dex Regional',
    },
    description: 'Pokémon grouped by their debut region (Kanto → Paldea), in dex order within each region.',
    descriptions: {
      en: 'Pokémon grouped by their debut region (Kanto → Paldea), in dex order within each region.',
      'pt-BR': 'Pokémon agrupados pela sua região de estreia (Kanto → Paldea), em ordem da dex dentro de cada região.',
    },
    isBuiltIn: true,
    rules: [
      { order: 1, filter: { generations: [1] }, sort: 'dex-number', boxNameTemplate: 'Kanto {n}' },
      { order: 2, filter: { generations: [2] }, sort: 'dex-number', boxNameTemplate: 'Johto {n}' },
      { order: 3, filter: { generations: [3] }, sort: 'dex-number', boxNameTemplate: 'Hoenn {n}' },
      { order: 4, filter: { generations: [4] }, sort: 'dex-number', boxNameTemplate: 'Sinnoh {n}' },
      { order: 5, filter: { generations: [5] }, sort: 'dex-number', boxNameTemplate: 'Unova {n}' },
      { order: 6, filter: { generations: [6] }, sort: 'dex-number', boxNameTemplate: 'Kalos {n}' },
      { order: 7, filter: { generations: [7] }, sort: 'dex-number', boxNameTemplate: 'Alola {n}' },
      { order: 8, filter: { generations: [8] }, sort: 'dex-number', boxNameTemplate: 'Galar {n}' },
      { order: 9, filter: { generations: [9] }, sort: 'dex-number', boxNameTemplate: 'Paldea {n}' },
    ],
  },

  // 8. Regional Forms Together
  {
    id: 'regional-forms-together',
    name: 'Regional Forms Together',
    names: {
      en: 'Regional Forms Together',
      'pt-BR': 'Formas Regionais Juntas',
    },
    description: 'Base forms and all their regional variants placed together, in dex order.',
    descriptions: {
      en: 'Base forms and all their regional variants placed together, in dex order.',
      'pt-BR': 'Formas base e todas as suas variantes regionais colocadas juntas, em ordem da dex.',
    },
    isBuiltIn: true,
    rules: [
      {
        order: 1,
        filter: {},
        sort: 'dex-number',
        boxNameTemplate: 'Forms {n}',
      },
    ],
  },
]

export function getBuiltinPreset(id: string): OrganizationPreset | undefined {
  return BUILTIN_PRESETS.find((p) => p.id === id)
}
