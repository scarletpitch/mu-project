<template>
  <button
    class="tarot-card"
    :class="{ 'tarot-card--revealed': revealed, 'tarot-card--selectable': selectable }"
    type="button"
    :disabled="!selectable"
    :aria-label="revealed ? card.name : 'เลือกไพ่'"
    @click="$emit('select')"
  >
    <span class="tarot-card__inner">
      <span class="tarot-card__face tarot-card__face--back">
        <img :src="card.backImage" alt="" draggable="false">
      </span>
      <span class="tarot-card__face tarot-card__face--front">
        <img :src="card.image" alt="" draggable="false">
        <span class="tarot-card__name">{{ card.name }}</span>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { TarotCardData } from '~/data/tarotDeck'

defineProps<{
  card: TarotCardData
  revealed?: boolean
  selectable?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.tarot-card {
  width: var(--card-w);
  aspect-ratio: 120 / 184;
  padding: 0;
  border-radius: 9px;
  background: transparent;
  perspective: 700px;
  cursor: default;
}

.tarot-card__inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 9px;
  pointer-events: none;
  transform-style: preserve-3d;
  transition: transform 520ms ease;
}

.tarot-card--revealed .tarot-card__inner {
  transform: rotateY(180deg);
}

.tarot-card--selectable {
  cursor: pointer;
}

.tarot-card--selectable:active .tarot-card__inner {
  transform: translateY(-4px);
}

.tarot-card--selectable.tarot-card--revealed:active .tarot-card__inner {
  transform: rotateY(180deg);
}

.tarot-card__face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 9px;
  backface-visibility: hidden;
  box-shadow: 0 12px 24px rgba(24, 8, 35, 0.28);
}

.tarot-card__face--front {
  transform: rotateY(180deg);
}

.tarot-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.tarot-card__name {
  position: absolute;
  right: 8px;
  bottom: 9px;
  left: 8px;
  color: $mu-purple-ink;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
}
</style>
