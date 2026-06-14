export type TarotArcana = 'major' | 'minor'
export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'

export interface TarotCardData {
  id: string
  name: string
  arcana: TarotArcana
  suit: TarotSuit
  image: string
  backImage: string
}

const backImage = '/images/madamemu-tarot-back.svg'
// const backImage = '/images/tarot-back.svg'
const cardImage = '/images/tarot-face-placeholder.svg'

const majorNames = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World'
]

const suits: Array<{ key: TarotSuit; label: string }> = [
  { key: 'wands', label: 'Wands' },
  { key: 'cups', label: 'Cups' },
  { key: 'swords', label: 'Swords' },
  { key: 'pentacles', label: 'Pentacles' }
]

const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']

export const tarotDeck: TarotCardData[] = [
  ...majorNames.map((name, index) => ({
    id: `major_${index}`,
    name,
    arcana: 'major' as const,
    suit: 'major' as const,
    image: cardImage,
    backImage
  })),
  ...suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${suit.key}_${rank.toLowerCase()}`,
      name: `${rank} of ${suit.label}`,
      arcana: 'minor' as const,
      suit: suit.key,
      image: cardImage,
      backImage
    }))
  )
]
