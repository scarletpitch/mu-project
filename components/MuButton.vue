<template>
  <NuxtLink v-if="to" :to="to" class="mu-button" :class="buttonClass">
    <slot />
  </NuxtLink>
  <button v-else class="mu-button" :class="buttonClass" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    variant?: 'primary' | 'ghost'
  }>(),
  {
    type: 'button',
    variant: 'primary'
  }
)

const buttonClass = computed(() => ({
  'mu-button--ghost': props.variant === 'ghost'
}))
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;
@use '~/assets/scss/abstracts/mixins' as *;

.mu-button {
  @include touch-target;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: $radius-pill;
  padding: 13px 18px;
  color: $mu-purple-ink;
  background: $mu-lavender-soft;
  box-shadow: 0 12px 24px rgba(32, 12, 45, 0.2);
  cursor: pointer;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  transition:
    transform 180ms ease,
    opacity 180ms ease,
    background 180ms ease;
}

.mu-button:active {
  transform: translateY(1px) scale(0.99);
}

.mu-button:disabled {
  cursor: not-allowed;
  opacity: 0.54;
  transform: none;
}

.mu-button--ghost {
  border: 1px solid $mu-line;
  color: $mu-cream;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: none;
}
</style>
