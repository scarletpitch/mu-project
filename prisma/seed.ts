import { PrismaClient, Arcana, Suit } from '@prisma/client'
import { tarotMeanings } from '../data/tarotMeanings'

const prisma = new PrismaClient()

type CardSeed = {
  id: string
  nameEn: string
  arcana: Arcana
  suit?: Suit
  number?: number
  rank?: string
  imageUrl?: string
  backImageUrl?: string
}

const cardImageUrl = '/images/tarot-face-placeholder.svg'
const backImageUrl = '/images/madamemu-tarot-back.svg'

const majorArcana: CardSeed[] = [
  { id: 'the_fool',          nameEn: 'The Fool',          arcana: 'major', number: 0  },
  { id: 'the_magician',      nameEn: 'The Magician',      arcana: 'major', number: 1  },
  { id: 'the_high_priestess',nameEn: 'The High Priestess',arcana: 'major', number: 2  },
  { id: 'the_empress',       nameEn: 'The Empress',       arcana: 'major', number: 3  },
  { id: 'the_emperor',       nameEn: 'The Emperor',       arcana: 'major', number: 4  },
  { id: 'the_hierophant',    nameEn: 'The Hierophant',    arcana: 'major', number: 5  },
  { id: 'the_lovers',        nameEn: 'The Lovers',        arcana: 'major', number: 6  },
  { id: 'the_chariot',       nameEn: 'The Chariot',       arcana: 'major', number: 7  },
  { id: 'strength',          nameEn: 'Strength',          arcana: 'major', number: 8  },
  { id: 'the_hermit',        nameEn: 'The Hermit',        arcana: 'major', number: 9  },
  { id: 'wheel_of_fortune',  nameEn: 'Wheel of Fortune',  arcana: 'major', number: 10 },
  { id: 'justice',           nameEn: 'Justice',           arcana: 'major', number: 11 },
  { id: 'the_hanged_man',    nameEn: 'The Hanged Man',    arcana: 'major', number: 12 },
  { id: 'death',             nameEn: 'Death',             arcana: 'major', number: 13 },
  { id: 'temperance',        nameEn: 'Temperance',        arcana: 'major', number: 14 },
  { id: 'the_devil',         nameEn: 'The Devil',         arcana: 'major', number: 15 },
  { id: 'the_tower',         nameEn: 'The Tower',         arcana: 'major', number: 16 },
  { id: 'the_star',          nameEn: 'The Star',          arcana: 'major', number: 17 },
  { id: 'the_moon',          nameEn: 'The Moon',          arcana: 'major', number: 18 },
  { id: 'the_sun',           nameEn: 'The Sun',           arcana: 'major', number: 19 },
  { id: 'judgement',         nameEn: 'Judgement',         arcana: 'major', number: 20 },
  { id: 'the_world',         nameEn: 'The World',         arcana: 'major', number: 21 },
]

const rankNames: { rank: string; nameEn: string; number: number }[] = [
  { rank: 'ace',    nameEn: 'Ace',    number: 1  },
  { rank: 'two',    nameEn: 'Two',    number: 2  },
  { rank: 'three',  nameEn: 'Three',  number: 3  },
  { rank: 'four',   nameEn: 'Four',   number: 4  },
  { rank: 'five',   nameEn: 'Five',   number: 5  },
  { rank: 'six',    nameEn: 'Six',    number: 6  },
  { rank: 'seven',  nameEn: 'Seven',  number: 7  },
  { rank: 'eight',  nameEn: 'Eight',  number: 8  },
  { rank: 'nine',   nameEn: 'Nine',   number: 9  },
  { rank: 'ten',    nameEn: 'Ten',    number: 10 },
  { rank: 'page',   nameEn: 'Page',   number: 11 },
  { rank: 'knight', nameEn: 'Knight', number: 12 },
  { rank: 'queen',  nameEn: 'Queen',  number: 13 },
  { rank: 'king',   nameEn: 'King',   number: 14 },
]

const suits: { suit: Suit; nameEn: string }[] = [
  { suit: 'wands',     nameEn: 'Wands'     },
  { suit: 'cups',      nameEn: 'Cups'      },
  { suit: 'swords',    nameEn: 'Swords'    },
  { suit: 'pentacles', nameEn: 'Pentacles' },
]

const minorArcana: CardSeed[] = suits.flatMap(({ suit, nameEn: suitName }) =>
  rankNames.map(({ rank, nameEn: rankName, number }) => ({
    id: `${rank}_of_${suit}`,
    nameEn: `${rankName} of ${suitName}`,
    arcana: 'minor' as Arcana,
    suit,
    number,
    rank,
  }))
)

const allCards: CardSeed[] = [...majorArcana, ...minorArcana].map((card) => ({
  ...card,
  imageUrl: card.imageUrl ?? cardImageUrl,
  backImageUrl: card.backImageUrl ?? backImageUrl,
}))

async function main() {
  console.log(`Seeding ${allCards.length} tarot cards...`)

  for (const card of allCards) {
    await prisma.tarotCard.upsert({
      where: { id: card.id },
      update: {
        nameEn: card.nameEn,
        arcana: card.arcana,
        suit: card.suit ?? null,
        number: card.number ?? null,
        rank: card.rank ?? null,
        imageUrl: card.imageUrl ?? null,
        backImageUrl: card.backImageUrl ?? null,
      },
      create: {
        id: card.id,
        nameEn: card.nameEn,
        arcana: card.arcana,
        suit: card.suit ?? null,
        number: card.number ?? null,
        rank: card.rank ?? null,
        imageUrl: card.imageUrl ?? null,
        backImageUrl: card.backImageUrl ?? null,
      },
    })

    await prisma.tarotCardMeaning.upsert({
      where: { cardId: card.id },
      update: {},
      create: {
        cardId: card.id,
        keywords: [],
      },
    })
  }

  console.log(`Seeding ${tarotMeanings.length} tarot meaning records...`)

  for (const meaning of tarotMeanings) {
    const { cardId, ...meaningData } = meaning

    await prisma.tarotCardMeaning.upsert({
      where: { cardId },
      update: {
        ...meaningData,
        keywords: meaning.keywords ?? [],
      },
      create: {
        cardId,
        ...meaningData,
        keywords: meaning.keywords ?? [],
      },
    })
  }

  console.log(`Done. ${allCards.length} cards seeded. ${tarotMeanings.length} meanings updated.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
