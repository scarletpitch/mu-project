import { prisma } from '~/server/utils/prisma'
import type { ReadingOutline } from './readingTypes'

export async function storeReadingSession(
  outline: ReadingOutline,
  algorithmText: string,
) {
  const session = await prisma.readingSession.create({
    data: {
      readingType:      outline.readingType,
      category:         outline.category,
      questionText:     outline.questionText,
      mode:             'test',
      algorithmVersion: outline.algorithmVersion,
      status:           'outlined',
      cards: {
        create: outline.positions.map((pos) => ({
          cardId:                pos.cardId,
          positionIndex:         pos.positionIndex,
          positionKey:           pos.positionKey,
          positionLabel:         pos.positionLabel,
          meaningSnapshot:       pos as object,
          keywordsSnapshot:      pos.keywords,
          interpretationSnapshot: pos.selectedMeaning,
        })),
      },
      output: {
        create: {
          structuredOutline: outline as object,
          algorithmText,
        },
      },
      review: {
        create: {
          reviewStatus: 'pending',
          isApproved:   false,
        },
      },
    },
    include: {
      cards:  true,
      output: true,
      review: true,
    },
  })

  return session
}
