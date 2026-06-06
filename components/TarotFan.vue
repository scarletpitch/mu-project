<template>
  <div class="tarot-fan" :class="`tarot-fan--${state}`">
    <div
      v-for="(card, index) in cards"
      :key="`${card.id}-${index}`"
      class="tarot-fan__slot"
      :class="{ 'tarot-fan__slot--selected': selectedIndex === index }"
      :style="slotStyle(index)"
    >
      <TarotCard
        :card="card"
        :revealed="selectedIndex === index && state === 'revealed'"
        :selectable="selectable && selectedIndex === null"
        @select="$emit('select', index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TarotCardData } from '~/data/tarotDeck'

export type TarotAnimationState = 'idleFan' | 'gathering' | 'shuffling' | 'dealing' | 'readyToPick' | 'revealed'

const props = defineProps<{
  cards: TarotCardData[]
  state: TarotAnimationState
  selectable: boolean
  selectedIndex: number | null
}>()

defineEmits<{
  select: [index: number]
}>()

const fanPositions = computed(() => {
  const total = props.cards.length
  const center = (total - 1) / 2
  const spread = 18

  return props.cards.map((_, index) => {
    const offset = index - center
    const normalized = center === 0 ? 0 : offset / center

    return {
      x: normalized * 124,
      y: Math.abs(normalized) * 38 - 8,
      rotate: normalized * spread,
      delay: index * 42
    }
  })
})

function slotStyle(index: number) {
  const item = fanPositions.value[index]
  const center = (props.cards.length - 1) / 2

  return {
    '--fan-x': `${item.x}%`,
    '--fan-y': `${item.y}%`,
    '--fan-r': `${item.rotate}deg`,
    '--slot-delay': `${item.delay}ms`,
    '--deck-z': `${100 - Math.abs(index - center)}`
  }
}
</script>

<style lang="scss" scoped>
.tarot-fan {
  --card-w: clamp(48px, 15.2vw, 66px);

  position: relative;
  width: min(100%, 390px);
  height: clamp(210px, 57svh, 318px);
  margin: 0 auto;
}

.tarot-fan__slot {
  position: absolute;
  top: 47%;
  left: 50%;
  z-index: var(--deck-z);
  transform:
    translate(-50%, -50%)
    translate(var(--fan-x), var(--fan-y))
    rotate(var(--fan-r));
  transform-origin: 50% 86%;
  transition:
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
  transition-delay: var(--slot-delay);
}

.tarot-fan--gathering .tarot-fan__slot,
.tarot-fan--shuffling .tarot-fan__slot {
  transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);
  transition-delay: 0ms;
}

.tarot-fan--shuffling .tarot-fan__slot:nth-child(odd) {
  animation: shuffle-left 720ms ease-in-out infinite;
}

.tarot-fan--shuffling .tarot-fan__slot:nth-child(even) {
  animation: shuffle-right 720ms ease-in-out infinite;
}

.tarot-fan--dealing .tarot-fan__slot {
  transition-duration: 760ms;
  transition-delay: var(--slot-delay);
}

.tarot-fan--revealed .tarot-fan__slot:not(.tarot-fan__slot--selected) {
  opacity: 0.38;
}

.tarot-fan--revealed .tarot-fan__slot--selected {
  z-index: 50;
  transform: translate(-50%, -50%) translate(0, -8%) rotate(0deg) scale(1.18);
}

@keyframes shuffle-left {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(-3px, 0) rotate(-1deg);
  }

  50% {
    transform: translate(-50%, -50%) translate(-22px, -2px) rotate(-6deg);
  }
}

@keyframes shuffle-right {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(3px, 0) rotate(1deg);
  }

  50% {
    transform: translate(-50%, -50%) translate(22px, 2px) rotate(6deg);
  }
}
</style>
