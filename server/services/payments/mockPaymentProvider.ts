import type { PaymentProvider } from './types'

export const mockPaymentProvider: PaymentProvider = {
  async createPayment(input) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const qrPayload = `MOCK_PROMPTPAY|${input.orderId}|${input.amount}|${input.userId}`

    return {
      qrPayload,
      qrImageUrl: `https://placehold.co/240x240/eadffc/5b2e7a?text=Mock+QR`,
      expiresAt
    }
  },

  async verifyWebhook(input) {
    if (input.provider !== 'mock' || typeof input.payload !== 'object' || input.payload === null) {
      return { valid: false }
    }

    const payload = input.payload as { orderId?: string; status?: 'paid' | 'failed' | 'pending' }

    return {
      valid: Boolean(payload.orderId),
      orderId: payload.orderId,
      status: payload.status ?? 'pending'
    }
  }
}
