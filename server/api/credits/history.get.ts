import { listCreditTransactions } from '~/server/services/credits'
import { LOCAL_USER_ID } from '~/server/services/mockStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = typeof query.userId === 'string' ? query.userId : LOCAL_USER_ID

  return {
    transactions: listCreditTransactions(userId)
  }
})
