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

const cardsPerRow = 13
const totalCards = computed(() => props.cards.length)

function slotStyle(index: number) {
  const row = Math.floor(index / cardsPerRow)
  const column = index % cardsPerRow
  const centerColumn = (cardsPerRow - 1) / 2
  const centerRow = Math.max((Math.ceil(totalCards.value / cardsPerRow) - 1) / 2, 0)
  const dealDelay = index * 42
  const deckOffset = (index % 5) - 2

  return {
    '--slot-row': row + 1,
    '--slot-column': column + 1,
    '--gather-x': `${(centerColumn - column) * 100}%`,
    '--gather-y': `calc(${centerRow - row} * var(--row-step))`,
    '--deck-offset-x': `${deckOffset * 0.55}px`,
    '--deck-offset-y': `${((index % 7) - 3) * 0.32}px`,
    '--deck-r': `${deckOffset * 0.45}deg`,
    '--deal-r': `${((column % 3) - 1) * 0.6}deg`,
    '--slot-delay': `${dealDelay}ms`,
    '--deck-z': totalCards.value - index
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
  margin: clamp(-76px, -8svh, -40px) auto 0;
  overflow: visible;
}

.tarot-fan__slot {
  display: grid;
  justify-items: center;
  min-width: 0;
  grid-row: var(--slot-row);
  grid-column: var(--slot-column);
  z-index: var(--deck-z);
  opacity: 1;
  transform: translateY(0) rotate(0deg) scale(1);
  transition:
    transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
  transition-delay: var(--slot-delay);
}

.tarot-fan--gathering .tarot-fan__slot,
.tarot-fan--shuffling .tarot-fan__slot {
  transform:
    translate(
      calc(var(--gather-x) + var(--deck-offset-x)),
      calc(var(--gather-y) + var(--deck-offset-y))
    )
    rotate(var(--deck-r))
    scale(0.96);
  transition-delay: 0ms;
}

.tarot-fan--gathering .tarot-fan__slot :deep(.tarot-card__face),
.tarot-fan--shuffling .tarot-fan__slot :deep(.tarot-card__face) {
  box-shadow: none;
}

.tarot-fan--shuffling .tarot-fan__slot:nth-child(odd) {
  animation: shuffle-left 720ms ease-in-out infinite;
}

.tarot-fan--shuffling .tarot-fan__slot:nth-child(even) {
  animation: shuffle-right 720ms ease-in-out infinite;
}

.tarot-fan--dealing .tarot-fan__slot {
  animation: deal-settle 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--slot-delay);
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

@keyframes deal-settle {
  0% {
    opacity: 0.92;
    transform:
      translate(
        calc(var(--gather-x) + var(--deck-offset-x)),
        calc(var(--gather-y) + var(--deck-offset-y))
      )
      rotate(var(--deck-r))
      scale(0.96);
  }

  72% {
    transform: translateY(-2px) rotate(var(--deal-r)) scale(1.015);
  }

  100% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@keyframes shuffle-left {
  0%,
  100% {
    transform: translate(calc(var(--gather-x) + var(--deck-offset-x) - 2px), calc(var(--gather-y) + var(--deck-offset-y))) rotate(calc(var(--deck-r) - 0.6deg)) scale(0.96);
  }

  50% {
    transform: translate(calc(var(--gather-x) + var(--deck-offset-x) - 10px), calc(var(--gather-y) + var(--deck-offset-y) - 1px)) rotate(calc(var(--deck-r) - 1.8deg)) scale(0.96);
  }
}

@keyframes shuffle-right {
  0%,
  100% {
    transform: translate(calc(var(--gather-x) + var(--deck-offset-x) + 2px), calc(var(--gather-y) + var(--deck-offset-y))) rotate(calc(var(--deck-r) + 0.6deg)) scale(0.96);
  }

  50% {
    transform: translate(calc(var(--gather-x) + var(--deck-offset-x) + 10px), calc(var(--gather-y) + var(--deck-offset-y) + 1px)) rotate(calc(var(--deck-r) + 1.8deg)) scale(0.96);
  }
}
</style>
