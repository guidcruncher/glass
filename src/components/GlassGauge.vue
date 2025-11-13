<template>
  <section class="gauge-section">
    <div class="gauge-wrapper">
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#34C759" />
            <stop offset="100%" stop-color="#007AFF" />
          </linearGradient>
        </defs>
        <circle class="gauge-bg" cx="100" cy="100" r="80"></circle>
        <circle
          class="gauge-fill"
          cx="100"
          cy="100"
          r="80"
          :stroke-dasharray="strokeDasharray"
        ></circle>
        <text x="100" y="100" class="gauge-text">{{ percent }}%</text>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const percent = ref(45); // Initial value from the original script
const circumference = 2 * Math.PI * 80;

// Calculates the stroke dash offset for the SVG circle to represent the percentage
const strokeDasharray = computed(() => {
  const offset = circumference - (percent.value / 100) * circumference;
  return `${circumference - offset}, ${circumference}`;
});

const setGauge = (p) => {
  percent.value = p;
};

onMounted(() => {
  setGauge(percent.value);
});
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Dark Theme (Default) */
:root {
  --gauge-text-color: white;
  --gauge-bg-glass: rgba(30, 30, 30, 0.4);
  --gauge-border: rgba(255, 255, 255, 0.15);
  --gauge-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --gauge-off-stroke: rgba(255, 255, 255, 0.15);
}
/* Light Theme (Override) */
.dark {
  --gauge-text-color: #1f2937; /* gray-800 */
  --gauge-bg-glass: rgba(255, 255, 255, 0.65);
  --gauge-border: rgba(0, 0, 0, 0.15);
  --gauge-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --gauge-off-stroke: rgba(0, 0, 0, 0.15);
}

/* ===================================================================
   CONTAINER AND LAYOUT
   =================================================================== */
.gauge-section {
  /* Glass Panel Styling */
  background-color: var(--gauge-bg-glass);
  border: 1px solid var(--gauge-border);
  box-shadow: var(--gauge-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 1rem; /* rounded-2xl */
  padding: 2rem; /* p-8 */

  /* Layout: space-y-6 */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--gauge-text-color);
}

.gauge-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  text-align: center;
}

.gauge-wrapper,
.gauge-controls {
  display: flex;
  justify-content: center; /* flex justify-center */
}

.gauge-controls {
  gap: 0.75rem; /* space-x-3 */
}

/* ===================================================================
   BUTTONS
   =================================================================== */
.control-button {
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 0.875rem; /* text-sm */
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  /* Dark Mode Default */
  background-color: rgba(255, 255, 255, 0.1); /* bg-white/10 */
  color: inherit;
}
.control-button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* hover:bg-opacity-20 */
}

/* ===================================================================
   SVG GAUGE STYLES
   =================================================================== */
.gauge-svg {
  width: 180px;
  height: 180px;
}
.gauge-bg {
  fill: none;
  stroke: var(--gauge-off-stroke);
  stroke-width: 14;
}

.gauge-fill {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 14;
  /* Rotate the circle to start at 12 o'clock */
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 0.6s ease;
  box-shadow: 0 0 10px rgba(0, 122, 255, 0.5); /* subtle glow */
}

.gauge-text {
  font-size: 3rem; /* text-5xl */
  font-weight: 700; /* font-bold */
  text-anchor: middle;
  dominant-baseline: middle;
  fill: currentColor; /* Inherits text color from container */
}
</style>
