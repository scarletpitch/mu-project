<template>
  <section class="credit-balance mu-panel">
    <span class="mu-small-label">Credit Balance</span>
    <strong>{{ balance }}</strong>
    <p>เครดิตพร้อมใช้</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  balance: number
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.credit-balance {
  padding: 20px;
}

.credit-balance strong {
  display: block;
  margin-top: 8px;
  color: $mu-cream;
  font-size: 48px;
  line-height: 1;
}

.credit-balance p {
  margin: 8px 0 0;
  color: $mu-muted;
  font-size: 14px;
}
</style>
