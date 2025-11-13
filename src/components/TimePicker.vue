<template>
  <section class="time-picker-section">
    <div class="time-input-group">
      <input
        type="number"
        min="0"
        max="23"
        v-model.number="hour"
        placeholder="14"
        class="time-input"
      />
      <span class="separator-text">:</span>
      <input
        type="number"
        min="0"
        max="59"
        v-model.number="minute"
        placeholder="30"
        class="time-input"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

const hour = ref(14);
const minute = ref(30);

// Basic input clamping (client-side validation)
watch(hour, (newVal) => {
  if (newVal > 23) hour.value = 0;
  if (newVal < 0) hour.value = 23;
});

watch(minute, (newVal) => {
  if (newVal > 59) minute.value = 0;
  if (newVal < 0) minute.value = 59;
});
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Dark Theme (Default) */
:root {
  --glass-bg: rgba(30, 30, 30, 0.4);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --text-color: white;

  --input-bg: rgba(255, 255, 255, 0.1); /* bg-white/10 */
  --input-border: rgba(255, 255, 255, 0.3); /* border-white/30 */
  --input-focus-bg: rgba(255, 255, 255, 0.2); /* focus:bg-white/20 */
  --input-focus-ring: rgba(255, 255, 255, 0.5); /* focus:ring-white/50 */
}
/* Light Theme (Override) */
.dark {
  --glass-bg: rgba(255, 255, 255, 0.65);
  --glass-border: rgba(0, 0, 0, 0.15);
  --glass-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --text-color: #1f2937;

  --input-bg: rgba(255, 255, 255, 0.8); /* light:bg-white/80 */
  --input-border: rgba(0, 0, 0, 0.2); /* light:border-black/20 */
  --input-focus-bg: rgba(255, 255, 255, 1); /* light:focus:bg-white/100 */
  --input-focus-ring: rgba(0, 0, 0, 0.5);
}

/* ===================================================================
   CONTAINER AND LAYOUT
   =================================================================== */
.time-picker-section {
  /* Glass Panel Styling */
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 1rem; /* rounded-2xl */
  padding: 2rem; /* p-8 */
  color: var(--text-color);

  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 */
}

.section-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
}

.time-input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem; /* space-x-3 */
}

.separator-text {
  font-size: 1.5rem; /* text-2xl */
}

/* ===================================================================
   INPUT STYLES
   =================================================================== */
.time-input {
  width: 4rem; /* w-16 */
  text-align: center;
  padding: 0.75rem; /* p-3 */
  border-radius: 0.75rem; /* rounded-xl */
  border-width: 1px;
  font-size: 1.5rem; /* text-2xl */
  font-family: monospace; /* font-mono */
  transition: all 0.2s ease;
  appearance: none; /* appearance-none */
  outline: none;

  /* Theme Application */
  background-color: var(--input-bg);
  border-color: var(--input-border);
  color: inherit;
}

.time-input:focus {
  background-color: var(--input-focus-bg);
  box-shadow: 0 0 0 2px var(--input-focus-ring); /* focus:ring-2 */
}
</style>
