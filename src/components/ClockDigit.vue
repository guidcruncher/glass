<template>
  <svg
    :viewBox="viewBox"
    :style="{ width: size, height: size }"
    xmlns="http://www.w3.org/2000/svg"
    class="clock-digit-svg"
  >
    <g :fill="offColor">
      <polygon v-for="(points, name) in segmentPoints" :key="name" :points="points" />
    </g>

    <g :fill="onColor">
      <polygon v-for="name in activeSegments" :key="name" :points="segmentPoints[name]" />
    </g>
  </svg>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  digit: {
    type: [String, Number],
    required: true,
  },
  size: {
    type: String,
    default: '100px',
  },
})

// --- THEME AWARENESS FIX (Polling for reactivity to theme changes) ---
const isDarkRef = ref(document.documentElement.classList.contains('dark'))
let themeCheckerInterval = null

onMounted(() => {
  // Poll the DOM class list every 300ms to detect external theme changes
  themeCheckerInterval = setInterval(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark')
    if (isDarkRef.value !== isCurrentlyDark) {
      isDarkRef.value = isCurrentlyDark
    }
  }, 300)
})

onUnmounted(() => {
  clearInterval(themeCheckerInterval)
})

// Segment color for the dim/off state (Tailwind-like colors: gray-700 / gray-200)
const offColor = computed(() => (isDarkRef.value ? '#374151' : '#E5E7EB'))
// Segment color for the bright/on state (LCD Green style: lime-400 / emerald-600)
const onColor = computed(() => (isDarkRef.value ? '#34D399' : '#10B981'))

// --- SEGMENT MAP (Unchanged) ---
const segmentMap = {
  0: ['A', 'B', 'C', 'D', 'E', 'F'],
  1: ['B', 'C'],
  2: ['A', 'B', 'D', 'E', 'G'],
  3: ['A', 'B', 'C', 'D', 'G'],
  4: ['B', 'C', 'F', 'G'],
  5: ['A', 'C', 'D', 'F', 'G'],
  6: ['A', 'C', 'D', 'E', 'F', 'G'],
  7: ['A', 'B', 'C'],
  8: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  9: ['A', 'B', 'C', 'D', 'F', 'G'],
}

// --- SVG CONFIG (Unchanged) ---
const viewBox = '0 0 100 170'
const segmentPoints = {
  // A horizontal bar: [x1 y1, x2 y2, x3 y3, x4 y4]
  A: '10 5, 90 5, 85 10, 15 10',
  D: '10 165, 90 165, 85 160, 15 160',
  G: '10 85, 90 85, 85 90, 15 90',
  // B vertical bar (right top)
  B: '90 5, 95 10, 95 80, 90 85',
  // C vertical bar (right bottom)
  C: '90 85, 95 90, 95 160, 90 165',
  // E vertical bar (left bottom)
  E: '5 90, 10 85, 10 160, 5 165',
  // F vertical bar (left top)
  F: '5 10, 10 5, 10 80, 5 85',
}

// Computes the segments that should be lit up for the current digit
const activeSegments = computed(() => {
  const d = String(props.digit).trim()
  return segmentMap[d] || []
})
</script>

<style scoped>
.clock-digit-svg {
  display: block;
}
</style>
