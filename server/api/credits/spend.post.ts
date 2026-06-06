import { spendCredits } from '~/server/services/credits'
import { LOCAL_USER_ID } from '~/server/services/mockStore'

interface SpendBody {
  userId?: string
  featureKey?: string
  amount?: number
  referenceId?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SpendBody>(event)
  const userId = body.userId ?? LOCAL_USER_ID

  if (!body.featureKey || !body.referenceId || typeof body.amount !== 'number' || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid spend request'
    })
  }

  return spendCredits(userId, body.amount, body.featureKey, body.referenceId)
})
