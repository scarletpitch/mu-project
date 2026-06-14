import type { CardWithMeaning, PatternInsights } from './readingTypes'

export function analyzePatterns(cards: CardWithMeaning[]): PatternInsights {
  const majorArcanaCount = cards.filter((c) => c.arcana === 'major').length

  const suitCounts: Record<string, number> = {}
  for (const card of cards) {
    if (card.suit) {
      suitCounts[card.suit] = (suitCounts[card.suit] ?? 0) + 1
    }
  }

  const sortedSuits = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])
  const dominantSuit = sortedSuits[0]?.[0] ?? null
  const repeatedSuits = sortedSuits.filter(([, count]) => count >= 2).map(([suit]) => suit)

  const allKeywords = cards.flatMap((c) => c.meaning?.keywords ?? [])
  const keywordCounts: Record<string, number> = {}
  for (const kw of allKeywords) {
    if (kw) keywordCounts[kw] = (keywordCounts[kw] ?? 0) + 1
  }
  const repeatedKeywords = Object.entries(keywordCounts)
    .filter(([, count]) => count >= 2)
    .map(([kw]) => kw)

  const timingNotes = cards.flatMap((c) =>
    c.meaning?.timingNote ? [c.meaning.timingNote] : []
  )
  const timingSpeeds = cards.map((c) => c.meaning?.timingSpeed).filter(Boolean) as string[]
  const slowCount = timingSpeeds.filter((s) => s === 'slow').length
  const fastCount = timingSpeeds.filter((s) => s === 'fast').length
  let overallTimingSpeed: PatternInsights['overallTimingSpeed'] = 'unknown'
  if (timingSpeeds.length > 0) {
    if (slowCount >= 2) overallTimingSpeed = 'slow'
    else if (fastCount >= 2) overallTimingSpeed = 'fast'
    else if (slowCount > 0 && fastCount > 0) overallTimingSpeed = 'mixed'
  }

  const insights: string[] = []
  const suggestedTone: string[] = []

  if (majorArcanaCount >= 2) {
    insights.push(
      'การอ่านไพ่นี้มี Major Arcana หลายใบ บ่งบอกถึงช่วงเวลาสำคัญในชีวิตหรือบทเรียนชะตา'
    )
    suggestedTone.push('transition')
  }

  if (repeatedSuits.includes('cups')) {
    insights.push('ไพ่ Cups ปรากฏหลายครั้ง พลังงานด้านอารมณ์และความสัมพันธ์มีบทบาทสำคัญในช่วงนี้')
    suggestedTone.push('reflective')
  }
  if (repeatedSuits.includes('swords')) {
    insights.push(
      'ไพ่ Swords ปรากฏหลายครั้ง การตัดสินใจ ความคิด หรือการสื่อสารกำลังเป็นประเด็นสำคัญ'
    )
    suggestedTone.push('caution')
  }
  if (repeatedSuits.includes('pentacles')) {
    insights.push(
      'ไพ่ Pentacles ปรากฏหลายครั้ง พลังงานด้านความมั่นคง การงาน การเงิน หรือร่างกายมีนัยสำคัญ'
    )
    suggestedTone.push('action-oriented')
  }
  if (repeatedSuits.includes('wands')) {
    insights.push(
      'ไพ่ Wands ปรากฏหลายครั้ง พลังงานการกระทำ ความหลงใหล หรือการเริ่มต้นใหม่กำลังเคลื่อนตัว'
    )
    suggestedTone.push('hopeful')
  }

  if (repeatedKeywords.length > 0) {
    insights.push(
      `คีย์เวิร์ดที่ซ้ำกัน: ${repeatedKeywords.join(', ')} — นี่คือธีมหลักของการดูไพ่ครั้งนี้`
    )
  }

  if (overallTimingSpeed === 'slow') {
    insights.push(
      'พลังงานโดยรวมเคลื่อนตัวช้า สถานการณ์อาจค่อย ๆ คลี่คลาย ต้องการความอดทนและการรอคอย'
    )
    suggestedTone.push('reflective')
  } else if (overallTimingSpeed === 'fast') {
    insights.push(
      'พลังงานโดยรวมเคลื่อนตัวเร็ว สถานการณ์อาจเปลี่ยนแปลงหรือชัดเจนขึ้นในเร็ว ๆ นี้'
    )
    suggestedTone.push('action-oriented')
  }

  if (suggestedTone.length === 0) {
    suggestedTone.push('hopeful')
  }

  return {
    majorArcanaCount,
    suitCounts,
    dominantSuit,
    repeatedSuits,
    allKeywords,
    repeatedKeywords,
    timingNotes,
    overallTimingSpeed,
    suggestedTone: [...new Set(suggestedTone)],
    insights,
  }
}
