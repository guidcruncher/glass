<template>
  <div :class="['glass-panel', panelClass]">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "dark", // 'dark' or 'light'
    validator: (value) => ["dark", "light"].includes(value),
  },
});

// The class determines which set of CSS variables is used
const panelClass = computed(() => {
  return props.variant === "light" ? "light-panel" : "dark-panel";
});
</script>

<style scoped>
/* ===================================================================
   BASE PANEL STYLES (Applies to all variants)
   =================================================================== */
.glass-panel {
  border-radius: 1rem; /* rounded-2xl */
  padding: 1.5rem; /* p-6 */
  /* Replaces space-y-4 for slot content */
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Glassmorphism */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  /* Dynamic styles set by theme/variant */
  background-color: var(--panel-bg);
  border: 1px solid var(--panel-border);
  box-shadow: var(--panel-shadow);
  transition: all 0.3s ease;
}

/* ===================================================================
   VARIANT STYLES (CSS Variables for Theme Switching)
   =================================================================== */

/* --- Dark Panel (Default) --- */
.dark-panel {
  --panel-bg: rgba(30, 30, 30, 0.4);
  --panel-border: rgba(255, 255, 255, 0.15);
  --panel-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); /* shadow-2xl */
  color: white;
}

/* --- Light Panel --- */
.light-panel {
  --panel-bg: rgba(255, 255, 255, 0.65);
  --panel-border: rgba(255, 255, 255, 0.8);
  --panel-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
  color: #1f2937;
}
</style>
