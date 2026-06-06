import { createTransaction, mockStore } from './mockStore'

export interface SpendCreditsResult {
  success: boolean
  newCreditBalance: number
  transactionId?: string
  error?: 'INSUFFICIENT_CREDITS'
}

export function getCreditBalance(userId: string): number {
  return mockStore.balances.get(userId) ?? 0
}

export function addCredits(userId: string, amount: number, source: string, referenceId: string) {
  const existing = mockStore.transactions.find((item) => item.type === 'topup' && item.referenceId === referenceId)

  if (existing) {
    return {
      success: true,
      newCreditBalance: getCreditBalance(userId),
      transactionId: existing.id,
      duplicate: true
    }
  }

  const newCreditBalance = getCreditBalance(userId) + amount
  mockStore.balances.set(userId, newCreditBalance)

  const transaction = createTransaction({
    userId,
    type: 'topup',
    amount,
    balanceAfter: newCreditBalance,
    source,
    referenceId
  })

  mockStore.transactions.unshift(transaction)

  return {
    success: true,
    newCreditBalance,
    transactionId: transaction.id,
    duplicate: false
  }
}

export function spendCredits(userId: string, amount: number, featureKey: string, referenceId: string): SpendCreditsResult {
  const existing = mockStore.transactions.find((item) => item.type === 'spend' && item.referenceId === referenceId)

  if (existing) {
    return {
      success: true,
      newCreditBalance: getCreditBalance(userId),
      transactionId: existing.id
    }
  }

  const currentBalance = getCreditBalance(userId)

  if (currentBalance < amount) {
    return {
      success: false,
      newCreditBalance: currentBalance,
      error: 'INSUFFICIENT_CREDITS'
    }
  }

  const newCreditBalance = currentBalance - amount
  mockStore.balances.set(userId, newCreditBalance)

  const transaction = createTransaction({
    userId,
    type: 'spend',
    amount: -Math.abs(amount),
    balanceAfter: newCreditBalance,
    source: featureKey,
    referenceId
  })

  mockStore.transactions.unshift(transaction)

  return {
    success: true,
    newCreditBalance,
    transactionId: transaction.id
  }
}

export function listCreditTransactions(userId: string) {
  return mockStore.transactions.filter((item) => item.userId === userId)
}
