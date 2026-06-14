import { prisma } from '~/server/utils/prisma'
import type { ReadingOutline, ApprovedReference, AiPromptPayload } from './readingTypes'

export async function getApprovedReferenceReadings(
  currentOutline: ReadingOutline,
  limit = 3,
): Promise<ApprovedReference[]> {
  const sessions = await prisma.readingSession.findMany({
    where: {
      readingType: 'three_card',
      review: {
        isApproved: true,
        ratingOverall: { gte: 4 },
      },
      output: {
        OR: [
          { finalOutput: { not: null } },
          { aiOutput: { not: null } },
        ],
      },
    },
    include: {
      cards:  true,
      output: true,
      review: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // score within a bounded pool
  })

  const currentCardIds = currentOutline.positions.map((p) => p.cardId)
  const currentDominantSuit = currentOutline.patternInsights.dominantSuit
  const currentMajorCount = currentOutline.patternInsights.majorArcanaCount
  const currentKeywords = new Set(currentOutline.patternInsights.repeatedKeywords)

  const scored: ApprovedReference[] = sessions.map((session) => {
    let score = 0
    const matchReasons: string[] = []

    if (session.readingType === 'three_card') {
      score += 2
      matchReasons.push('readingType matches')
    }
    if (session.category === currentOutline.category) {
      score += 2
      matchReasons.push(`category matches (${session.category})`)
    }

    for (const card of session.cards) {
      const samePositionMatch = currentOutline.positions.find(
        (p) => p.cardId === card.cardId && p.positionIndex === card.positionIndex,
      )
      const differentPositionMatch = currentOutline.positions.find(
        (p) => p.cardId === card.cardId && p.positionIndex !== card.positionIndex,
      )
      if (samePositionMatch) {
        score += 5
        matchReasons.push(`${card.cardId} in same position (${card.positionKey})`)
      } else if (differentPositionMatch) {
        score += 3
        matchReasons.push(`${card.cardId} in different position`)
      }
    }

    // Structural similarity from stored outline snapshot
    const storedOutline = session.output?.structuredOutline as Record<string, unknown> | null
    if (storedOutline) {
      const storedDominant = (storedOutline.patternInsights as Record<string, unknown> | undefined)
        ?.dominantSuit as string | null | undefined
      const storedMajorCount = (storedOutline.patternInsights as Record<string, unknown> | undefined)
        ?.majorArcanaCount as number | undefined
      const storedRepeatedKeywords = (storedOutline.patternInsights as Record<string, unknown> | undefined)
        ?.repeatedKeywords as string[] | undefined

      if (storedDominant && storedDominant === currentDominantSuit) {
        score += 1
        matchReasons.push(`same dominant suit (${storedDominant})`)
      }
      if (typeof storedMajorCount === 'number' && storedMajorCount === currentMajorCount) {
        score += 1
        matchReasons.push(`same major arcana count (${storedMajorCount})`)
      }
      if (storedRepeatedKeywords) {
        const overlapping = storedRepeatedKeywords.filter((kw) => currentKeywords.has(kw))
        if (overlapping.length > 0) {
          score += 1
          matchReasons.push(`overlapping keywords: ${overlapping.join(', ')}`)
        }
      }
    }

    return {
      readingSessionId: session.id,
      category:         session.category,
      cards: session.cards.map((c) => ({
        positionIndex: c.positionIndex,
        positionKey:   c.positionKey,
        cardId:        c.cardId,
        cardNameEn:    (c.meaningSnapshot as Record<string, unknown>)?.cardNameEn as string ?? c.cardId,
      })),
      outlineSummary: {
        mainConclusionCard:
          session.cards.find((c) => c.positionKey === 'summary')?.cardId ?? '',
        situationCard:
          session.cards.find((c) => c.positionKey === 'situation_expander')?.cardId ?? '',
        querentCard:
          session.cards.find((c) => c.positionKey === 'querent_self')?.cardId ?? '',
        dominantSuit: currentDominantSuit,
        majorArcanaCount: currentMajorCount,
      },
      finalOutput: session.output?.finalOutput ?? null,
      aiOutput:    session.output?.aiOutput ?? null,
      ratings: {
        overall:    session.review?.ratingOverall ?? null,
        accuracy:   session.review?.ratingAccuracy ?? null,
        tone:       session.review?.ratingTone ?? null,
        usefulness: session.review?.ratingUsefulness ?? null,
      },
      matchScore:   score,
      matchReasons,
    }
  })

  return scored
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

export function buildAiPromptPayload(
  currentOutline: ReadingOutline,
  approvedReferences: ApprovedReference[],
): AiPromptPayload {
  return {
    systemInstruction: [
      'คุณคือ Madame Mu นักทายไพ่ทาโรต์ผู้เชี่ยวชาญ',
      'เขียนการอ่านไพ่ทาโรต์เป็นภาษาไทย โดยใช้ outline ปัจจุบันเป็นแหล่งข้อมูลหลัก',
      'ใช้ approved references เฉพาะเพื่อเป็นแนวทางด้านโทนเสียง โครงสร้าง และรูปแบบการให้เหตุผลเท่านั้น',
      'ห้ามคัดลอกข้อความจาก references',
      'ห้ามสร้างความหมายที่ไม่มีอยู่ใน outline ปัจจุบัน',
      'ไพ่ตำแหน่งที่ 3 (สรุป) คือคำตอบหลัก',
      'ไพ่ตำแหน่งที่ 2 ขยายความหรืออธิบายไพ่ตำแหน่งที่ 3',
      'ไพ่ตำแหน่งที่ 1 อธิบายพลังงานและสภาพภายในของผู้ถาม',
      'ห้ามใช้คำทำนายที่น่ากลัว ตัดสินชะตาชีวิต หรือทำนายแบบฟันธง',
      'เนื้อหาควรสนับสนุน สะท้อน และเป็นประโยชน์ต่อผู้ถาม',
    ].join('\n'),
    currentOutline,
    approvedReferences,
    outputSections: [
      'ภาพรวม',
      'ตัวตนเจ้าชะตา',
      'สถานการณ์/ตัวขยาย',
      'สรุปคำตอบ',
      'คำแนะนำ',
    ],
    guidelines: currentOutline.safetyGuidelines,
  }
}
