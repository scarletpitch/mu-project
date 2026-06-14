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

      <div v-if="selectedCard" class="daily-tarot__reading-cta">
        <MuButton @click="goToReading">ดูคำทำนาย</MuButton>
      </div>

      <div v-if="!selectedCard" class="daily-tarot__action">
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

const visibleCount = 78
const animationState = ref<TarotAnimationState>('idleFan')
const visibleCards = ref<TarotCardData[]>(tarotDeck.slice(0, visibleCount))
const selectedIndex = ref<number | null>(null)
const sessionId = ref(createId('daily_tarot'))
const timers: number[] = []

const isAnimating = computed(() => ['gathering', 'shuffling', 'dealing', 'zooming'].includes(animationState.value))
const canPick = computed(() => animationState.value === 'readyToPick' && !isAnimating.value)
const selectedCard = computed(() => (
  selectedIndex.value === null || animationState.value !== 'revealed' ? null : visibleCards.value[selectedIndex.value]
))

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
  animationState.value = 'zooming'
  setStateAfter('revealed', 720)
}

function goToReading() {
  if (!selectedCard.value) {
    return
  }

  navigateTo({
    path: '/daily-tarot-reading',
    query: {
      cardId: selectedCard.value.id,
      sessionId: sessionId.value
    }
  })
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

.daily-tarot__reading-cta {
  position: fixed;
  top: min(calc(50dvh + 300px), calc(100dvh - 108px));
  left: 50%;
  z-index: 1001;
  width: min(calc(100vw - 48px), 320px);
  transform: translateX(-50%);
}

.daily-tarot__action {
  justify-self: center;
  width: 40%;
  margin-top: clamp(-150px, -18svh, -80px);
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
