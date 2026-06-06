import { findCreditPackage } from '~/data/creditPackages'
import { createId } from '~/utils/ids'
import { mockPaymentProvider } from '~/server/services/payments/mockPaymentProvider'
import { LOCAL_USER_ID, mockStore, type TopupOrder } from '~/server/services/mockStore'

interface CreateTopupBody {
  userId?: string
  packageId?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTopupBody>(event)
  const userId = body.userId ?? LOCAL_USER_ID
  const selectedPackage = body.packageId ? findCreditPackage(body.packageId) : undefined

  if (!selectedPackage) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid packageId'
    })
  }

  const orderId = createId('topup')
  const payment = await mockPaymentProvider.createPayment({
    orderId,
    userId,
    amount: selectedPackage.priceThb
  })

  const order: TopupOrder = {
    id: orderId,
    userId,
    packageId: selectedPackage.id,
    amount: selectedPackage.priceThb,
    credits: selectedPackage.credits,
    status: 'pending',
    qrPayload: payment.qrPayload,
    qrImageUrl: payment.qrImageUrl,
    expiresAt: payment.expiresAt,
    createdAt: new Date().toISOString()
  }

  mockStore.topupOrders.set(order.id, order)

  return {
    orderId: order.id,
    amount: order.amount,
    credits: order.credits,
    status: order.status,
    qrImageUrl: order.qrImageUrl,
    qrPayload: order.qrPayload,
    expiresAt: order.expiresAt
  }
})
