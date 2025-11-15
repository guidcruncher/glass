<template>
  <div :class="['apple-panel', themeClass]">
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// Computed property to dynamically apply the correct CSS class
const themeClass = computed(() => {
  return isDark.value ? 'theme-dark' : 'theme-light'
})
</script>

<style scoped>
/*
 * Styles for the Apple-style Panel 
 */

/* --- Panel Container --- */
.apple-panel {
  /* Basic Panel Structure */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 99vw; /* Example fixed width */
  min-height: 200px;
  backdrop-filter: blur(10px); /* Key Apple UI effect */
  overflow: hidden;
  transition: all 0.3s ease;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

/* --- Light Theme (Default) --- */
.apple-panel.theme-light {
  /* Background: A translucent light gray/white */
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #1c1c1e; /* Dark text */
}

/* --- Dark Theme --- */
.apple-panel.theme-dark {
  /* Background: A translucent dark gray/black */
  background-color: rgba(28, 28, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff; /* Light text */
}

/* --- Panel Content Slot --- */
.panel-content {
  padding: 20px;
}
</style>
