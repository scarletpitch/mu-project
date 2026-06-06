import { mockPaymentProvider } from '~/server/services/payments/mockPaymentProvider'

export default defineEventHandler(async (event) => {
  const payload = await readBody(event)
  const result = await mockPaymentProvider.verifyWebhook({
    provider: 'mock',
    payload,
    headers: getHeaders(event)
  })

  return {
    accepted: result.valid,
    message: 'Mock webhook placeholder only. Production payment webhooks must verify provider signatures before trusting payment status.',
    result
  }
})
