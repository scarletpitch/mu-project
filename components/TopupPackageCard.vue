<template>
  <button class="package-card mu-panel" type="button" :class="{ 'package-card--active': active }" @click="$emit('select')">
    <span>
      <span class="package-card__label">{{ item.label }}</span>
      <strong>{{ item.credits }} เครดิต</strong>
    </span>
    <span class="package-card__price">{{ item.priceThb }} THB</span>
  </button>
</template>

<script setup lang="ts">
import type { CreditPackage } from '~/data/creditPackages'

defineProps<{
  item: CreditPackage
  active: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;
@use '~/assets/scss/abstracts/mixins' as *;

.package-card {
  @include touch-target;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 16px;
  color: $mu-cream;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.package-card--active {
  border-color: rgba(234, 223, 252, 0.72);
  background: rgba(255, 255, 255, 0.14);
}

.package-card:active {
  transform: scale(0.99);
}

.package-card__label,
.package-card__price {
  display: block;
  color: $mu-muted;
  font-size: 13px;
}

.package-card strong {
  display: block;
  margin-top: 4px;
  font-size: 18px;
}
</style>
