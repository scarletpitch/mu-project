<template>
  <MobileAppShell>
    <div class="history-page">
      <header>
        <h1 class="mu-title">ประวัติ</h1>
        <p class="mu-subtitle">รายการเติมเครดิตและการใช้งานล่าสุด</p>
      </header>

      <section class="history-page__list">
        <article v-for="item in historyData?.transactions ?? []" :key="item.id" class="history-card mu-panel">
          <div>
            <strong>{{ item.type === 'topup' ? 'เติมเครดิต' : 'ใช้เครดิต' }}</strong>
            <span>{{ item.source }}</span>
          </div>
          <div class="history-card__amount">
            <strong>{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</strong>
            <span>คงเหลือ {{ item.balanceAfter }}</span>
          </div>
        </article>

        <p v-if="!historyData?.transactions.length" class="history-page__empty">ยังไม่มีประวัติรายการ</p>
      </section>

      <NuxtLink class="history-page__back" to="/daily-tarot">กลับไปดูไพ่</NuxtLink>
      <div class="mu-brand">MADAME MU</div>
    </div>
  </MobileAppShell>
</template>

<script setup lang="ts">
useHead({ title: 'ประวัติ | Madame Mu' })

interface Transaction {
  id: string
  type: 'topup' | 'spend'
  amount: number
  balanceAfter: number
  source: string
}

const userId = 'local-user'
const { data: historyData } = await useFetch<{ transactions: Transaction[] }>('/api/credits/history', { query: { userId } })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.history-page {
  min-height: 100dvh;
  display: grid;
  align-content: start;
  gap: 16px;
  padding-top: calc(env(safe-area-inset-top) + 34px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 18px);
}

.history-page__list {
  display: grid;
  gap: 10px;
}

.history-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
}

.history-card strong,
.history-card span {
  display: block;
}

.history-card span,
.history-page__empty {
  margin: 4px 0 0;
  color: $mu-muted;
  font-size: 13px;
}

.history-card__amount {
  flex: 0 0 auto;
  text-align: right;
}

.history-page__empty {
  text-align: center;
}

.history-page__back {
  color: $mu-lavender-soft;
  font-size: 14px;
  text-align: center;
}

.mu-brand {
  margin-top: auto;
}
</style>
