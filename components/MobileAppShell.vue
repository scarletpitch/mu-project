<template>
  <main class="mobile-shell">
    <section class="mobile-shell__frame">
      <slot />
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;
@use '~/assets/scss/abstracts/mixins' as *;

.mobile-shell {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  background: #21102f;
}

.mobile-shell__frame {
  @include app-padding;

  position: relative;
  width: 100%;
  min-height: 100dvh;
  max-width: $shell-max-width;
  overflow: hidden;
  background: $mu-purple;
}

@media (min-width: 600px) {
  .mobile-shell {
    padding: 24px 0;
  }

  .mobile-shell__frame {
    min-height: min(860px, calc(100dvh - 48px));
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(13, 4, 21, 0.45);
  }
}
</style>
