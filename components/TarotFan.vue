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

export type TarotAnimationState = 'idleFan' | 'gathering' | 'shuffling' | 'dealing' | 'readyToPick' | 'zooming' | 'revealed'

const props = defineProps<{
  cards: TarotCardData[]
  state: TarotAnimationState
  selectable: boolean
  selectedIndex: number | null
}>()

defineEmits<{
  select: [index: number]
}>()

const columns = 13

function slotStyle(index: number) {
  const row = Math.floor(index / columns)
  const column = index % columns

  return {
    '--slot-row': row + 1,
    '--slot-column': column + 1,
    '--slot-delay': `${index * 12}ms`,
    '--deck-z': index + 1
  }
}
</script>

<style lang="scss" scoped>
.tarot-fan {
  --card-w: 120%;
  --row-step: clamp(45px, 10.7vw, 55px);

  display: grid;
  grid-template-columns: repeat(13, minmax(0, 1fr));
  grid-template-rows: repeat(6, var(--row-step));
  justify-content: center;
  align-content: center;
  width: min(96%, 384px);
  min-height: calc((var(--row-step) * 5) + 78px);
  margin: clamp(-52px, -6svh, -24px) auto 0;
  overflow: visible;
}

.tarot-fan__slot {
  display: grid;
  justify-items: center;
  min-width: 0;
  grid-row: var(--slot-row);
  grid-column: var(--slot-column);
  z-index: var(--deck-z);
  transform: translateY(0) scale(1);
  transition:
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
  transition-delay: var(--slot-delay);
}

.tarot-fan--gathering .tarot-fan__slot,
.tarot-fan--shuffling .tarot-fan__slot {
  transform: translateY(0) scale(0.96);
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

.tarot-fan--zooming .tarot-fan__slot:not(.tarot-fan__slot--selected),
.tarot-fan--revealed .tarot-fan__slot:not(.tarot-fan__slot--selected) {
  opacity: 0;
  pointer-events: none;
}

.tarot-fan--zooming .tarot-fan__slot--selected,
.tarot-fan--revealed .tarot-fan__slot--selected {
  --card-w: min(74vw, 300px);

  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  width: var(--card-w);
  transform: translate(-50%, -50%) scale(1);
  transition-delay: 0ms;
}

.tarot-fan--zooming .tarot-fan__slot--selected {
  animation: card-zoom 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes card-zoom {
  0% {
    opacity: 0.72;
    transform: translate(-50%, -50%) scale(0.22);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes shuffle-left {
  0%,
  100% {
    transform: translateX(-2px) scale(0.96);
  }

  50% {
    transform: translateX(-6px) scale(0.96);
  }
}

@keyframes shuffle-right {
  0%,
  100% {
    transform: translateX(2px) scale(0.96);
  }

  50% {
    transform: translateX(6px) scale(0.96);
  }
}
</style>
