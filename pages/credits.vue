<template>
  <MobileAppShell>
    <div class="account-page">
      <header>
        <h1 class="mu-title">เครดิตของคุณ</h1>
        <p class="mu-subtitle">ใช้เครดิตเพื่อปลดล็อกคำทำนายฉบับเต็ม</p>
      </header>

      <CreditBalance :balance="balanceData?.creditBalance ?? 0" />

      <MuButton to="/topup">เติมเครดิต</MuButton>

      <section class="history-preview">
        <div class="history-preview__head">
          <h2>รายการล่าสุด</h2>
          <NuxtLink to="/history">ทั้งหมด</NuxtLink>
        </div>
        <div v-if="historyData?.transactions.length" class="history-preview__list">
          <article v-for="item in historyData.transactions.slice(0, 4)" :key="item.id" class="history-row">
            <span>{{ item.source }}</span>
            <strong>{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</strong>
          </article>
        </div>
        <p v-else class="history-preview__empty">ยังไม่มีรายการเครดิต</p>
      </section>

      <NuxtLink class="account-page__back" to="/daily-tarot">กลับไปดูไพ่</NuxtLink>
      <div class="mu-brand">MADAME MU</div>
    </div>
  </MobileAppShell>
</template>

<script setup lang="ts">
useHead({ title: 'เครดิต | Madame Mu' })

interface BalanceResponse {
  userId: string
  creditBalance: number
}

interface Transaction {
  id: string
  amount: number
  source: string
}

const userId = 'local-user'
const { data: balanceData } = await useFetch<BalanceResponse>('/api/credits/balance', { query: { userId } })
const { data: historyData } = await useFetch<{ transactions: Transaction[] }>('/api/credits/history', { query: { userId } })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.account-page {
  min-height: 100dvh;
  display: grid;
  align-content: start;
  gap: 18px;
  padding-top: calc(env(safe-area-inset-top) + 34px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 18px);
}

.history-preview {
  display: grid;
  gap: 10px;
}

.history-preview__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-preview h2 {
  margin: 0;
  font-size: 18px;
}

.history-preview__head a,
.account-page__back {
  color: $mu-lavender-soft;
  font-size: 14px;
}

.history-preview__list {
  display: grid;
  gap: 8px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid $mu-line;
  padding: 12px 0;
  color: $mu-muted;
}

.history-row strong {
  color: $mu-cream;
}

.history-preview__empty {
  margin: 0;
  color: $mu-muted;
}

.mu-brand {
  align-self: end;
  margin-top: auto;
}
</style>
