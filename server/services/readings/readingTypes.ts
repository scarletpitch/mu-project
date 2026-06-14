export const ALGORITHM_VERSION = '1.0.0'

export type ReadingCategory =
  | 'general'
  | 'love'
  | 'single_love'
  | 'career'
  | 'study'
  | 'finance'
  | 'health'

export const SUPPORTED_CATEGORIES: ReadingCategory[] = [
  'general',
  'love',
  'single_love',
  'career',
  'study',
  'finance',
  'health',
]

export type PositionKey = 'querent_self' | 'situation_expander' | 'summary'

export const SPREAD_POSITIONS = [
  {
    positionIndex: 1,
    positionKey: 'querent_self' as PositionKey,
    positionLabel: 'ตัวตนเจ้าชะตา',
    description:
      'พลังงานและสภาพภายในของผู้ถาม รวมถึงวิธีที่พวกเขาเข้าสู่หรือรับมือกับสถานการณ์นี้',
  },
  {
    positionIndex: 2,
    positionKey: 'situation_expander' as PositionKey,
    positionLabel: 'สถานการณ์ที่จะเกิดขึ้น / ตัวขยาย',
    description:
      'บริบทโดยรอบ สิ่งที่อาจส่งผลต่อหรือขยายความคำตอบหลัก',
  },
  {
    positionIndex: 3,
    positionKey: 'summary' as PositionKey,
    positionLabel: 'สรุป',
    description: 'คำตอบหลัก บทสรุป หรือสารสำคัญของการดูไพ่ครั้งนี้',
  },
] as const

export const SAFETY_GUIDELINES = [
  'การดูไพ่ไม่ได้ตัดสินชะตาชีวิต แต่เป็นเครื่องมือสำหรับการไตร่ตรองและรับรู้ตนเอง',
  'ผลการดูไพ่ไม่ใช่คำทำนายที่แน่นอน โปรดใช้วิจารณญาณของตนเองประกอบด้วย',
  'หากมีความกังวลเรื่องสุขภาพกาย/ใจ ควรปรึกษาผู้เชี่ยวชาญโดยตรง',
]

export type MeaningData = {
  id: string
  cardId: string
  coreMeaning: string | null
  symbols: string | null
  keywords: string[]
  generalSituation: string | null
  personality: string | null
  work: string | null
  study: string | null
  finance: string | null
  loveAndRelationship: string | null
  singleLove: string | null
  health: string | null
  timingSpeed: string | null
  timingPeriod: string | null
  timingNote: string | null
  summary: string | null
}

export type CardWithMeaning = {
  id: string
  nameEn: string
  nameTh: string | null
  arcana: string
  suit: string | null
  number: number | null
  rank: string | null
  meaning: MeaningData | null
}

export type PositionOutline = {
  positionIndex: number
  positionKey: PositionKey
  positionLabel: string
  cardId: string
  cardNameEn: string
  cardNameTh: string | null
  arcana: string
  suit: string | null
  selectedMeaning: string | null
  keywords: string[]
  timingSpeed: string | null
  timingPeriod: string | null
  timingNote: string | null
}

export type PatternInsights = {
  majorArcanaCount: number
  suitCounts: Record<string, number>
  dominantSuit: string | null
  repeatedSuits: string[]
  allKeywords: string[]
  repeatedKeywords: string[]
  timingNotes: string[]
  overallTimingSpeed: 'fast' | 'slow' | 'mixed' | 'unknown'
  suggestedTone: string[]
  insights: string[]
}

export type ReadingOutline = {
  readingType: 'three_card'
  category: ReadingCategory
  questionText: string | undefined
  algorithmVersion: string
  spreadDefinition: typeof SPREAD_POSITIONS
  positions: PositionOutline[]
  patternInsights: PatternInsights
  mainConclusion: PositionOutline
  situationExpansion: PositionOutline
  querentInsight: PositionOutline
  suggestedTone: string[]
  safetyGuidelines: string[]
}

export type ApprovedReference = {
  readingSessionId: string
  category: string | null
  cards: Array<{ positionIndex: number; positionKey: string; cardId: string; cardNameEn: string }>
  outlineSummary: {
    mainConclusionCard: string
    situationCard: string
    querentCard: string
    dominantSuit: string | null
    majorArcanaCount: number
  }
  finalOutput: string | null
  aiOutput: string | null
  ratings: {
    overall: number | null
    accuracy: number | null
    tone: number | null
    usefulness: number | null
  }
  matchScore: number
  matchReasons: string[]
}

export type AiPromptPayload = {
  systemInstruction: string
  currentOutline: ReadingOutline
  approvedReferences: ApprovedReference[]
  outputSections: string[]
  guidelines: string[]
}
