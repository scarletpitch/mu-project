export interface CreatePaymentInput {
  orderId: string
  amount: number
  userId: string
}

export interface CreatePaymentResult {
  qrPayload: string
  qrImageUrl: string
  expiresAt: string
}

export interface VerifyWebhookInput {
  provider: string
  payload: unknown
  headers: Record<string, string | string[] | undefined>
}

export interface VerifyWebhookResult {
  valid: boolean
  orderId?: string
  status?: 'paid' | 'failed' | 'pending'
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult>
}
