<template>
  <div class="glass-footer">
    <p class="text-sm opacity-70">
      <slot> &copy; 2025 Glass UI Demo. All rights reserved. </slot>
    </p>
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped lang="scss">
// Assumes global theme variables are set on :root or .dark/.light classes
@mixin glass-footer(
  $bg: var(--glass-bg-base, rgba(30, 30, 30, 0.4)),
  $border: var(--glass-border-color, rgba(255, 255, 255, 0.15))
) {
  background-color: $bg;
  border-top: 1px solid $border;
  backdrop-filter: blur(var(--glass-blur, 14px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 14px));
}

.glass-footer {
  @include glass-footer;
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}
</style>
