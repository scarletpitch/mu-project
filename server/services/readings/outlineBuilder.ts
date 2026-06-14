import type {
  ReadingCategory,
  CardWithMeaning,
  MeaningData,
  PositionKey,
  PositionOutline,
  ReadingOutline,
} from './readingTypes'
import {
  ALGORITHM_VERSION,
  SPREAD_POSITIONS,
  SAFETY_GUIDELINES,
} from './readingTypes'
import { analyzePatterns } from './patternAnalysis'

function getCategoryField(meaning: MeaningData, category: ReadingCategory): string | null {
  switch (category) {
    case 'love':        return meaning.loveAndRelationship
    case 'single_love': return meaning.singleLove
    case 'career':      return meaning.work
    case 'study':       return meaning.study
    case 'finance':     return meaning.finance
    case 'health':      return meaning.health
    default:            return meaning.generalSituation
  }
}

export function selectMeaningForCategory(
  meaning: MeaningData | null,
  category: ReadingCategory,
  positionKey: PositionKey,
): string | null {
  if (!meaning) return null

  // Position-adjusted primary emphasis
  let positionPrimary: string | null = null
  if (positionKey === 'querent_self') {
    // Emphasise inner state and self-awareness
    positionPrimary = meaning.personality
  } else if (positionKey === 'summary') {
    // Emphasise the core conclusion
    positionPrimary = meaning.coreMeaning
  }
  // situation_expander: let category drive the field, no extra override

  const categorySpecific = getCategoryField(meaning, category)

  return (
    positionPrimary ||
    categorySpecific ||
    meaning.generalSituation ||
    meaning.coreMeaning ||
    meaning.summary ||
    null
  )
}

function buildPositionOutline(
  card: CardWithMeaning,
  positionDef: (typeof SPREAD_POSITIONS)[number],
  category: ReadingCategory,
): PositionOutline {
  return {
    positionIndex: positionDef.positionIndex,
    positionKey:   positionDef.positionKey,
    positionLabel: positionDef.positionLabel,
    cardId:        card.id,
    cardNameEn:    card.nameEn,
    cardNameTh:    card.nameTh,
    arcana:        card.arcana,
    suit:          card.suit,
    selectedMeaning: selectMeaningForCategory(card.meaning, category, positionDef.positionKey),
    keywords:      card.meaning?.keywords ?? [],
    timingSpeed:   card.meaning?.timingSpeed ?? null,
    timingPeriod:  card.meaning?.timingPeriod ?? null,
    timingNote:    card.meaning?.timingNote ?? null,
  }
}

export function buildThreeCardOutline(input: {
  category: ReadingCategory
  questionText?: string
  cards: [CardWithMeaning, CardWithMeaning, CardWithMeaning]
}): ReadingOutline {
  const { category, questionText, cards } = input

  const positions = SPREAD_POSITIONS.map((def, i) =>
    buildPositionOutline(cards[i], def, category)
  ) as [PositionOutline, PositionOutline, PositionOutline]

  const patternInsights = analyzePatterns(cards)

  const [querentInsight, situationExpansion, mainConclusion] = positions

  return {
    readingType:      'three_card',
    category,
    questionText,
    algorithmVersion: ALGORITHM_VERSION,
    spreadDefinition: SPREAD_POSITIONS,
    positions,
    patternInsights,
    mainConclusion,
    situationExpansion,
    querentInsight,
    suggestedTone:    patternInsights.suggestedTone,
    safetyGuidelines: SAFETY_GUIDELINES,
  }
}
