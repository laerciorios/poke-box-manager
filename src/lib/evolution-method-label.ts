import type { EvolutionMethod } from '@/types/game'
import type { Locale } from '@/types/locale'

/** Converts a PokéAPI kebab-case name to Title Case. e.g. "water-stone" → "Water Stone" */
function toTitleCase(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const ITEM_NAMES_PT: Record<string, string> = {
  'fire-stone': 'Pedra Fogo',
  'water-stone': 'Pedra Água',
  'thunder-stone': 'Pedra Trovão',
  'leaf-stone': 'Pedra Folha',
  'moon-stone': 'Pedra Lunar',
  'sun-stone': 'Pedra Solar',
  'shiny-stone': 'Pedra Brilhante',
  'dusk-stone': 'Pedra Crepúsculo',
  'dawn-stone': 'Pedra Aurora',
  'ice-stone': 'Pedra Gelo',
  'oval-stone': 'Pedra Oval',
  'kings-rock': 'Rocha do Rei',
  'metal-coat': 'Metal Casaco',
  'dragon-scale': 'Escama de Dragão',
  'upgrade': 'Upgrade',
  'dubious-disc': 'Disco Dúbio',
  'protector': 'Protetor',
  'electirizer': 'Eletrizador',
  'magmarizer': 'Magmarizador',
  'razor-claw': 'Garra Navalha',
  'razor-fang': 'Presa Navalha',
  'reaper-cloth': 'Tecido Ceifador',
  'deep-sea-scale': 'Escama Mar Profundo',
  'deep-sea-tooth': 'Dente Mar Profundo',
  'prism-scale': 'Escama Prisma',
  'whipped-dream': 'Sonho Batido',
  'sachet': 'Sachê Perfumado',
  'strawberry-sweet': 'Morango Doce',
  'love-sweet': 'Coração Doce',
  'berry-sweet': 'Baga Doce',
  'clover-sweet': 'Trevo Doce',
  'flower-sweet': 'Flor Doce',
  'star-sweet': 'Estrela Doce',
  'ribbon-sweet': 'Fita Doce',
  'sweet-apple': 'Maçã Doce',
  'tart-apple': 'Maçã Azeda',
  'cracked-pot': 'Panela Rachada',
  'chipped-pot': 'Panela Lascada',
  'black-augurite': 'Augurita Negra',
  'peat-block': 'Bloco de Turfa',
  'auspicious-armor': 'Armadura Auspiciosa',
  'malicious-armor': 'Armadura Maliciosa',
  'syrupy-apple': 'Maçã Xaroposa',
  'unremarkable-teacup': 'Xícara Sem Graça',
  'masterpiece-teacup': 'Xícara Obra-Prima',
  'linking-cord': 'Cordão de Ligação',
  'galarica-cuff': 'Pulseira Galarica',
  'galarica-wreath': 'Grinalda Galarica',
  'leaders-crest': 'Crista do Líder',
  'scroll-of-darkness': 'Pergaminho das Trevas',
  'scroll-of-waters': 'Pergaminho das Águas',
  'ice-face': 'Rosto de Gelo',
  'rusted-sword': 'Espada Enferrujada',
  'rusted-shield': 'Escudo Enferrujado',
}

const LOCATION_NAMES_PT: Record<string, string> = {
  'mt-coronet': 'Monte Coronet',
  'eterna-forest': 'Floresta Eterna',
  'lake-of-rage': 'Lago da Raiva',
  'twist-mountain': 'Montanha Torcida',
  'special-magnetic-field': 'Campo Magnético',
  'mossy-rock': 'Pedra Musgosa',
  'icy-rock': 'Pedra Gelada',
  'pokemon-village': 'Vila Pokémon',
  'mount-lanakila': 'Monte Lanakila',
  'vast-poni-canyon': 'Cânion do Grande Poni',
  'from-item': 'Com Item',
  'giants-bed': 'Cama do Gigante',
  'three-point-pass': 'Passagem dos Três Pontos',
  'coronet-highlands': 'Planalto do Coronet',
  'alabaster-icelands': 'Terras Geladas Alabastro',
}

const MOVE_TYPE_NAMES_PT: Record<string, string> = {
  fairy: 'Fada',
  dragon: 'Dragão',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Planta',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Veneno',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dark: 'Sombrio',
  steel: 'Metálico',
  normal: 'Normal',
}

function getItemName(item: string, locale: Locale): string {
  if (locale === 'pt-BR') return ITEM_NAMES_PT[item] ?? toTitleCase(item)
  return toTitleCase(item)
}

function getLocationName(location: string, locale: Locale): string {
  if (locale === 'pt-BR') return LOCATION_NAMES_PT[location] ?? toTitleCase(location)
  return toTitleCase(location)
}

function getMoveTypeName(type: string, locale: Locale): string {
  if (locale === 'pt-BR') return MOVE_TYPE_NAMES_PT[type] ?? toTitleCase(type)
  return toTitleCase(type)
}

/**
 * Returns a human-readable label for an evolution method.
 * Examples:
 *   level-up + minLevel=16 → "Nível 16" / "Lv. 16"
 *   use-item + item=water-stone → "Pedra Água" / "Water Stone"
 *   trade + heldItem=metal-coat → "Troca c/ Metal Casaco" / "Trade w/ Metal Coat"
 *   level-up + happiness + timeOfDay=day → "Alta amizade (Dia)" / "High friendship (Day)"
 */
export function getEvolutionMethodLabel(method: EvolutionMethod, locale: Locale): string {
  const isPT = locale === 'pt-BR'
  const parts: string[] = []

  switch (method.trigger) {
    case 'level-up': {
      if (method.minLevel) {
        parts.push(isPT ? `Nível ${method.minLevel}` : `Lv. ${method.minLevel}`)
      } else if (method.happiness) {
        parts.push(isPT ? 'Alta amizade' : 'High friendship')
      } else if (method.affection) {
        parts.push(isPT ? 'Alta afeição' : 'High affection')
      } else if (method.beauty) {
        parts.push(isPT ? `Beleza ${method.beauty}+` : `Beauty ${method.beauty}+`)
      } else if (method.knownMoveType) {
        const typeName = getMoveTypeName(method.knownMoveType, locale)
        parts.push(isPT ? `Lv. up (move ${typeName})` : `Lv. up (${typeName} move)`)
      } else if (method.knownMove) {
        parts.push(isPT ? `Lv. up (${toTitleCase(method.knownMove)})` : `Lv. up (${toTitleCase(method.knownMove)})`)
      } else if (method.location) {
        parts.push(isPT ? `Lv. up em ${getLocationName(method.location, locale)}` : `Lv. up at ${getLocationName(method.location, locale)}`)
      } else if (method.needsRain) {
        parts.push(isPT ? 'Lv. up (chuva)' : 'Lv. up (rain)')
      } else if (method.turnUpsideDown) {
        parts.push(isPT ? 'Lv. up (de cabeça pra baixo)' : 'Lv. up (upside-down)')
      } else if (method.relativePhysicalStats === 1) {
        parts.push(isPT ? 'Lv. up (Atq > Def)' : 'Lv. up (Atk > Def)')
      } else if (method.relativePhysicalStats === -1) {
        parts.push(isPT ? 'Lv. up (Def > Atq)' : 'Lv. up (Def > Atk)')
      } else if (method.relativePhysicalStats === 0) {
        parts.push(isPT ? 'Lv. up (Atq = Def)' : 'Lv. up (Atk = Def)')
      } else {
        parts.push(isPT ? 'Nível' : 'Level up')
      }
      if (method.timeOfDay === 'day') parts.push(`(${isPT ? 'Dia' : 'Day'})`)
      if (method.timeOfDay === 'night') parts.push(`(${isPT ? 'Noite' : 'Night'})`)
      if (method.timeOfDay === 'dusk') parts.push(`(${isPT ? 'Crepúsculo' : 'Dusk'})`)
      break
    }

    case 'use-item': {
      if (method.item) {
        parts.push(getItemName(method.item, locale))
      } else {
        parts.push(isPT ? 'Item' : 'Item')
      }
      break
    }

    case 'trade': {
      parts.push(isPT ? 'Troca' : 'Trade')
      if (method.heldItem) {
        parts.push(isPT ? `c/ ${getItemName(method.heldItem, locale)}` : `w/ ${getItemName(method.heldItem, locale)}`)
      }
      if (method.tradeSpeciesId) {
        parts.push(isPT ? `com #${method.tradeSpeciesId}` : `with #${method.tradeSpeciesId}`)
      }
      break
    }

    case 'shed':
      parts.push(isPT ? 'Muda de pele (slot livre)' : 'Shed (empty slot)')
      break

    case 'spin':
      parts.push(isPT ? 'Girar com item' : 'Spin w/ item')
      break

    case 'tower-of-darkness':
      parts.push(isPT ? 'Torre das Trevas' : 'Tower of Darkness')
      break

    case 'tower-of-waters':
      parts.push(isPT ? 'Torre das Águas' : 'Tower of Waters')
      break

    case 'three-critical-hits':
      parts.push(isPT ? '3 acertos críticos' : '3 critical hits')
      break

    case 'take-damage':
      parts.push(isPT ? 'Receber dano' : 'Take damage')
      break

    default:
      parts.push(isPT ? 'Método especial' : 'Special method')
  }

  return parts.join(' ')
}
