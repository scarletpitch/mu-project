<template>
  <MobileAppShell>
    <div class="daily-reading">
      <NuxtLink to="/daily-tarot" class="daily-reading__back">กลับสู่หน้าหลัก</NuxtLink>

      <header class="daily-reading__header">
        <span class="mu-small-label">ไพ่วันนี้</span>
        <h1>{{ selectedCard?.name ?? 'ไม่พบไพ่ที่เลือก' }}</h1>
      </header>

      <section v-if="selectedCard" class="daily-reading__panel mu-panel">
        <img class="daily-reading__card" :src="selectedCard.image" :alt="selectedCard.name">
        <p>คำทำนายจะเพิ่มภายหลัง</p>

        <div v-if="fullReadingUnlocked" class="daily-reading__full">
          คำทำนายฉบับเต็มจะเพิ่มภายหลัง
        </div>

        <div v-else class="daily-reading__unlock">
          <MuButton :disabled="unlockPending" @click="unlockFullReading">
            {{ unlockPending ? 'กำลังปลดล็อก...' : 'ปลดล็อกคำทำนายเต็ม 1 เครดิต' }}
          </MuButton>
          <MuButton v-if="insufficientCredits" to="/topup" variant="ghost">เติมเครดิต</MuButton>
        </div>
      </section>

      <section v-else class="daily-reading__panel mu-panel">
        <p>กรุณากลับไปเลือกไพ่ก่อนดูคำทำนาย</p>
        <MuButton to="/daily-tarot">เลือกไพ่</MuButton>
      </section>

      <div class="mu-brand">MADAME MU</div>
    </div>
  </MobileAppShell>
</template>

<script setup lang="ts">
import { tarotDeck } from '~/data/tarotDeck'

useHead({ title: 'คำทำนายรายวัน | Madame Mu' })

interface SpendResponse {
  success: boolean
  newCreditBalance: number
  error?: 'INSUFFICIENT_CREDITS'
}

const route = useRoute()
const userId = 'local-user'
const unlockPending = ref(false)
const insufficientCredits = ref(false)
const fullReadingUnlocked = ref(false)

const selectedCard = computed(() => {
  const cardId = String(route.query.cardId ?? '')
  return tarotDeck.find((card) => card.id === cardId) ?? null
})

const referenceId = computed(() => String(route.query.sessionId ?? 'daily_tarot'))

async function unlockFullReading() {
  if (!selectedCard.value || fullReadingUnlocked.value) {
    return
  }

  unlockPending.value = true
  insufficientCredits.value = false

  try {
    const result = await $fetch<SpendResponse>('/api/credits/spend', {
      method: 'POST',
      body: {
        userId,
        featureKey: 'daily_tarot_full_reading',
        amount: 1,
        referenceId: referenceId.value
      }
    })

    fullReadingUnlocked.value = result.success
    insufficientCredits.value = result.error === 'INSUFFICIENT_CREDITS'
  } finally {
    unlockPending.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.daily-reading {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding-top: calc(env(safe-area-inset-top) + clamp(24px, 7svh, 54px));
  padding-bottom: calc(env(safe-area-inset-bottom) + 18px);
}

.daily-reading__header {
  text-align: center;
}

.daily-reading__back {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 18px);
  left: 18px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid $mu-line;
  border-radius: $radius-pill;
  padding: 8px 14px;
  color: $mu-cream;
  background: rgba(255, 255, 255, 0.08);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.daily-reading h1 {
  margin: 8px 0 0;
  font-size: clamp(24px, 6.6vw, 30px);
  font-weight: 850;
  line-height: 1.18;
}

.daily-reading__panel {
  width: 100%;
  padding: 18px 16px;
  text-align: center;
}

.daily-reading__card {
  width: min(62vw, 220px);
  aspect-ratio: 120 / 184;
  margin: 0 auto 16px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 18px 36px rgba(24, 8, 35, 0.28);
}

.daily-reading__panel p {
  margin: 0;
  color: $mu-muted;
  font-size: 14px;
  line-height: 1.55;
}

.daily-reading__unlock {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.daily-reading__full {
  margin-top: 16px;
  border-top: 1px solid $mu-line;
  padding-top: 14px;
  color: $mu-lavender-soft;
  font-size: 14px;
  line-height: 1.5;
}
</style>
