<template>
  <MobileAppShell>
    <div class="daily-tarot">
      <header class="daily-tarot__header">
        <h1>ดูไพ่ยิปซีแบบรายวัน</h1>
      </header>

      <TarotFan
        :cards="visibleCards"
        :state="animationState"
        :selectable="canPick"
        :selected-index="selectedIndex"
        @select="selectCard"
      />

      <section v-if="selectedCard" class="daily-tarot__result mu-panel">
        <span class="mu-small-label">ไพ่วันนี้</span>
        <h2>{{ selectedCard.name }}</h2>
        <p>คำทำนายจะเพิ่มภายหลัง</p>

        <div v-if="fullReadingUnlocked" class="daily-tarot__full">
          คำทำนายฉบับเต็มจะเพิ่มภายหลัง
        </div>

        <div v-else class="daily-tarot__unlock">
          <MuButton :disabled="unlockPending" @click="unlockFullReading">
            {{ unlockPending ? 'กำลังปลดล็อก...' : 'ปลดล็อกคำทำนายเต็ม 1 เครดิต' }}
          </MuButton>
          <MuButton v-if="insufficientCredits" to="/topup" variant="ghost">เติมเครดิต</MuButton>
        </div>
      </section>

      <div class="daily-tarot__action">
        <MuButton :disabled="isAnimating" @click="shuffleCards">
          {{ isAnimating ? 'กำลังสับไพ่...' : 'สับไพ่' }}
        </MuButton>
      </div>

      <nav class="daily-tarot__links" aria-label="Madame Mu menu">
        <NuxtLink to="/credits">เครดิต</NuxtLink>
        <NuxtLink to="/history">ประวัติ</NuxtLink>
      </nav>

      <div class="mu-brand">MADAME MU</div>
    </div>
  </MobileAppShell>
</template>

<script setup lang="ts">
import { tarotDeck, type TarotCardData } from '~/data/tarotDeck'
import { shuffleArray } from '~/utils/shuffle'
import { createId } from '~/utils/ids'
import type { TarotAnimationState } from '~/components/TarotFan.vue'

useHead({ title: 'ดูไพ่ยิปซีแบบรายวัน | Madame Mu' })

interface SpendResponse {
  success: boolean
  newCreditBalance: number
  error?: 'INSUFFICIENT_CREDITS'
}

const visibleCount = 9
const userId = 'local-user'
const animationState = ref<TarotAnimationState>('idleFan')
const visibleCards = ref<TarotCardData[]>(tarotDeck.slice(0, visibleCount))
const selectedIndex = ref<number | null>(null)
const sessionId = ref(createId('daily_tarot'))
const unlockPending = ref(false)
const insufficientCredits = ref(false)
const fullReadingUnlocked = ref(false)
const timers: number[] = []

const isAnimating = computed(() => ['gathering', 'shuffling', 'dealing'].includes(animationState.value))
const canPick = computed(() => animationState.value === 'readyToPick' && !isAnimating.value)
const selectedCard = computed(() => (selectedIndex.value === null ? null : visibleCards.value[selectedIndex.value]))

function setStateAfter(state: TarotAnimationState, delay: number) {
  timers.push(window.setTimeout(() => {
    animationState.value = state
  }, delay))
}

function shuffleCards() {
  timers.forEach((timer) => window.clearTimeout(timer))
  timers.length = 0

  sessionId.value = createId('daily_tarot')
  selectedIndex.value = null
  insufficientCredits.value = false
  fullReadingUnlocked.value = false
  visibleCards.value = shuffleArray(tarotDeck).slice(0, visibleCount)

  animationState.value = 'gathering'
  setStateAfter('shuffling', 650)
  setStateAfter('dealing', 1800)
  setStateAfter('readyToPick', 2850)
}

function selectCard(index: number) {
  if (!canPick.value || selectedIndex.value !== null) {
    return
  }

  selectedIndex.value = index
  animationState.value = 'revealed'
}

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
        referenceId: sessionId.value
      }
    })

    fullReadingUnlocked.value = result.success
    insufficientCredits.value = result.error === 'INSUFFICIENT_CREDITS'
  } finally {
    unlockPending.value = false
  }
}

onBeforeUnmount(() => {
  timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.daily-tarot {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(230px, 1fr) auto auto auto auto;
  align-items: center;
  padding-top: calc(env(safe-area-inset-top) + clamp(24px, 7svh, 54px));
  padding-bottom: calc(env(safe-area-inset-bottom) + 18px);
}

.daily-tarot__header {
  text-align: center;
}

.daily-tarot h1 {
  margin: 0;
  font-size: clamp(25px, 7vw, 31px);
  font-weight: 850;
  line-height: 1.18;
}

.daily-tarot__result {
  width: 100%;
  margin: -18px auto 16px;
  padding: 14px 16px;
  text-align: center;
}

.daily-tarot__result h2 {
  margin: 6px 0 0;
  font-size: 20px;
}

.daily-tarot__result p {
  margin: 6px 0 0;
  color: $mu-muted;
  font-size: 14px;
}

.daily-tarot__unlock {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.daily-tarot__full {
  margin-top: 12px;
  border-top: 1px solid $mu-line;
  padding-top: 12px;
  color: $mu-lavender-soft;
  font-size: 14px;
  line-height: 1.5;
}

.daily-tarot__action {
  width: 100%;
}

.daily-tarot__links {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 14px;
  color: $mu-muted;
  font-size: 13px;
}

.mu-brand {
  margin-top: 18px;
}
</style>
