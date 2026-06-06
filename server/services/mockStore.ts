import { createId } from '~/utils/ids'

export const LOCAL_USER_ID = 'local-user'

export type CreditTransactionType = 'topup' | 'spend'
export type TopupOrderStatus = 'pending' | 'paid' | 'expired'

export interface CreditTransaction {
  id: string
  userId: string
  type: CreditTransactionType
  amount: number
  balanceAfter: number
  source: string
  referenceId: string
  createdAt: string
}

export interface TopupOrder {
  id: string
  userId: string
  packageId: string
  amount: number
  credits: number
  status: TopupOrderStatus
  qrPayload: string
  qrImageUrl: string
  expiresAt: string
  creditedTransactionId?: string
  createdAt: string
  paidAt?: string
}

export interface MockStore {
  balances: Map<string, number>
  transactions: CreditTransaction[]
  topupOrders: Map<string, TopupOrder>
}

const globalStore = globalThis as typeof globalThis & { __madameMuMockStore?: MockStore }

export const mockStore: MockStore =
  globalStore.__madameMuMockStore ??
  {
    balances: new Map([[LOCAL_USER_ID, 0]]),
    transactions: [],
    topupOrders: new Map()
  }

globalStore.__madameMuMockStore = mockStore

export function createTransaction(input: Omit<CreditTransaction, 'id' | 'createdAt'>): CreditTransaction {
  return {
    id: createId('credit_txn'),
    createdAt: new Date().toISOString(),
    ...input
  }
}
