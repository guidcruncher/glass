<template>
  <div
    class="glass-container"
    :class="{ 'glass-container--dark': theme === 'dark' }"
    :style="containerStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Defines the color theme. 'auto' relies on the parent's .dark-mode class.
   * 'light' or 'dark' forces the theme for this container.
   */
  theme: {
    type: String,
    default: 'auto',
    validator: (value) => ['light', 'dark', 'auto'].includes(value),
  },
  /**
   * Sets the border radius, supporting any valid CSS value (e.g., '12px', '50%', '0.5rem').
   */
  borderRadius: {
    type: String,
    default: '12px', // Default border radius for the glass theme
  },
  /**
   * Optional padding for the slotted content.
   */
  padding: {
    type: String,
    default: '1.5rem',
  },
})

const containerStyle = computed(() => ({
  '--container-border-radius': props.borderRadius,
  padding: props.padding,
}))
</script>
