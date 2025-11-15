<template>
  <div class="p-4 md:p-6 space-y-6 w-full">
    <slot></slot>
  </div>
</template>

<script setup>
// The script is intentionally left empty to ensure the component is a generic
// and reusable container without complex internal state or logic.
</script>

<style scoped lang="scss">
/* No scoped styles are necessary as the core glassmorphism and layout rules 
   (like backdrop-blur, background-color, border, and width transitions) 
   are handled by the parent GlassAppView.vue component.
*/
</style>
