<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  }
)

defineSlots<{
  default?: () => any
}>()
</script>

<template>
  <div class="page-container" :class="{ 'page-container--compact': compact }">
    <div class="page-container__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  padding: 16px max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));

  &--compact {
    padding-top: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  &__inner {
    width: 100%;
    min-width: 0;
    max-width: 1200px;
    margin: 0 auto;
  }
}

@media (width <= 768px) {
  .page-container {
    padding: 12px max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom))
      max(12px, env(safe-area-inset-left));

    &--compact {
      padding-top: 10px;
      padding-bottom: max(10px, env(safe-area-inset-bottom));
    }
  }
}
</style>
