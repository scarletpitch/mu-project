import { addCredits, getCreditBalance } from '~/server/services/credits'
import { mockStore } from '~/server/services/mockStore'

interface MockPaidBody {
  orderId?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MockPaidBody>(event)

  if (!body.orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing orderId'
    })
  }

  const order = mockStore.topupOrders.get(body.orderId)

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Top-up order not found'
    })
  }

  if (order.status === 'paid') {
    return {
      success: true,
      duplicate: true,
      newCreditBalance: getCreditBalance(order.userId)
    }
  }

  const creditResult = addCredits(order.userId, order.credits, 'mock_promptpay_topup', order.id)
  order.status = 'paid'
  order.paidAt = new Date().toISOString()
  order.creditedTransactionId = creditResult.transactionId
  mockStore.topupOrders.set(order.id, order)

  return {
    success: true,
    duplicate: creditResult.duplicate,
    newCreditBalance: creditResult.newCreditBalance
  }
})
