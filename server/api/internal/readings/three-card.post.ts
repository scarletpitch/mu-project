import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { SUPPORTED_CATEGORIES } from '~/server/services/readings/readingTypes'
import { buildThreeCardOutline } from '~/server/services/readings/outlineBuilder'
import { createAlgorithmText } from '~/server/services/readings/threeCardSpread'
import { storeReadingSession } from '~/server/services/readings/readingRepository'
import { getApprovedReferenceReadings, buildAiPromptPayload } from '~/server/services/readings/referenceRetrieval'
import type { ReadingCategory, CardWithMeaning } from '~/server/services/readings/readingTypes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { category, questionText, cardIds } = body ?? {}

  if (!Array.isArray(cardIds) || cardIds.length !== 3) {
    throw createError({
      statusCode: 400,
      message: 'cardIds must be an array of exactly 3 card ids',
    })
  }

  if (!category || !SUPPORTED_CATEGORIES.includes(category as ReadingCategory)) {
    throw createError({
      statusCode: 400,
      message: `category must be one of: ${SUPPORTED_CATEGORIES.join(', ')}`,
    })
  }

  const cardRecords = await prisma.tarotCard.findMany({
    where: { id: { in: cardIds as string[] } },
    include: { meaning: true },
  })

  const missingIds = (cardIds as string[]).filter((id) => !cardRecords.find((c) => c.id === id))
  if (missingIds.length > 0) {
    throw createError({
      statusCode: 400,
      message: `Unknown card ids: ${missingIds.join(', ')}`,
    })
  }

  // Preserve caller-specified order
  const orderedCards = (cardIds as string[]).map(
    (id) => cardRecords.find((c) => c.id === id)!,
  ) as unknown as [CardWithMeaning, CardWithMeaning, CardWithMeaning]

  const outline = buildThreeCardOutline({
    category: category as ReadingCategory,
    questionText: questionText ?? undefined,
    cards: orderedCards,
  })

  const algorithmText = createAlgorithmText(outline)

  const session = await storeReadingSession(outline, algorithmText)

  const approvedReferences = await getApprovedReferenceReadings(outline)

  const aiPromptPayload = buildAiPromptPayload(outline, approvedReferences)

  return {
    readingSessionId: session.id,
    outline,
    algorithmText,
    approvedReferences,
    aiPromptPayload,
  }
})
