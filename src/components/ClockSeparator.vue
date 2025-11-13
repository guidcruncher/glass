<template>
  <svg
    :viewBox="viewBox"
    :style="{ height: size }"
    xmlns="http://www.w3.org/2000/svg"
    class="clock-separator-svg"
  >
    <circle cx="10" cy="65" r="4" :fill="dotColor" />
    <circle cx="10" cy="95" r="4" :fill="dotColor" />
  </svg>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // Controls the height of the separator (e.g., '12rem')
  size: {
    type: String,
    default: "12rem",
  },
});

// --- THEME AWARENESS (Polling for reactivity to theme changes) ---
const isDarkRef = ref(document.documentElement.classList.contains("dark"));
let themeCheckerInterval = null;

onMounted(() => {
  // Poll the DOM class list every 300ms to detect external theme changes
  themeCheckerInterval = setInterval(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (isDarkRef.value !== isCurrentlyDark) {
      isDarkRef.value = isCurrentlyDark;
    }
  }, 300);
});

onUnmounted(() => {
  clearInterval(themeCheckerInterval);
});

// Dot color uses the bright LCD color (lime-400 / emerald-600)
const dotColor = computed(() => (isDarkRef.value ? "#34D399" : "#10B981"));

// --- SVG CONFIG ---\n
// Viewbox set for a tall, narrow space
const viewBox = "0 0 20 170";
</script>

<style scoped>
.clock-separator-svg {
  flex-shrink: 0; /* flex-shrink-0 */
  display: block;
}
</style>
