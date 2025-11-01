<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// --- Types and Props Definition ---

type ClockSize = 'sm' | 'md' | 'lg' | string

interface Props {
  size?: ClockSize
  timezone?: string
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  timezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  isDark: false,
})

// --- Constants for 7-Segment Display Logic ---

// Geometry for one digit (viewBox 0 0 100 180)
const segmentGeometries = [
  // A: Top (H)
  { index: 0, x: 10, y: 0, w: 80, h: 10 },
  // B: Top Right (V)
  { index: 1, x: 80, y: 10, w: 10, h: 75 },
  // C: Bottom Right (V)
  { index: 2, x: 80, y: 95, w: 10, h: 75 },
  // D: Bottom (H)
  { index: 3, x: 10, y: 170, w: 80, h: 10 },
  // E: Bottom Left (V)
  { index: 4, x: 0, y: 95, w: 10, h: 75 },
  // F: Top Left (V)
  { index: 5, x: 0, y: 10, w: 10, h: 75 },
  // G: Middle (H)
  { index: 6, x: 10, y: 85, w: 80, h: 10 },
]

// 7-Segment Digit Map: [A, B, C, D, E, F, G] (true means segment is lit)
const SEGMENT_MAP: Record<number, boolean[]> = {
  0: [true, true, true, true, true, true, false],
  1: [false, true, true, false, false, false, false],
  2: [true, true, false, true, true, false, true],
  3: [true, true, true, true, false, false, true],
  4: [false, true, true, false, false, true, true],
  5: [true, false, true, true, false, true, true],
  6: [true, false, true, true, true, true, true],
  7: [true, true, true, false, false, false, false],
  8: [true, true, true, true, true, true, true],
  9: [true, true, true, true, false, true, true],
}

const DIGIT_COUNT = 4
const DIGIT_SPACING = 100 // Digit width (90) + spacing (10)

// --- Reactive State and Lifecycle ---

const time = ref(new Date())
let intervalId: number | null = null

const updateTime = () => {
  time.value = new Date()
}

onMounted(() => {
  updateTime() // Initial draw
  intervalId = window.setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

// --- Computed Styles and Classes ---

const containerClass = computed(() => ({
  'dark-mode': props.isDark,
}))

const containerStyles = computed(() => {
  let width = '440px'
  let height = '200px'

  if (props.size === 'sm') {
    width = '280px'
  } else if (props.size === 'md') {
    width = '360px'
  } else if (typeof props.size === 'string' && props.size !== 'lg') {
    width = props.size
  }

  return {
    width: width,
    // Height is proportional to the viewBox (440x180 base)
    height: 'auto',
  }
})

// --- Computed Clock Logic ---

/**
 * Calculates the current time digits (HHMM) based on the timezone prop.
 * Returns an array of 4 numbers.
 */
const timeDigits = computed<number[]>(() => {
  try {
    const hours = time.value
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: false, // Force 24hr format for digit splitting
        timeZone: props.timezone,
      })
      .padStart(2, '0')

    const minutes = time.value
      .toLocaleTimeString('en-US', {
        minute: '2-digit',
        timeZone: props.timezone,
      })
      .padStart(2, '0')

    const timeString = `${hours}${minutes}`
    return Array.from(timeString).map(Number)
  } catch (e) {
    // Fallback to 00:00 if timezone is invalid
    console.error('Invalid timezone:', props.timezone)
    return [0, 0, 0, 0]
  }
})

/**
 * Returns the 7-segment lit/unlit pattern for all four digits.
 * Result: Array of 4 (Digits) -> Array of 7 (Segments) -> Boolean (Lit/Unlit)
 */
const digitSegmentStates = computed<boolean[][]>(() => {
  return timeDigits.value.map((digit) => SEGMENT_MAP[digit] || SEGMENT_MAP[0])
})

/**
 * Determines if the separator dots should be lit (blinking colon effect).
 */
const isSeparatorLit = computed<boolean>(() => {
  const seconds = time.value.toLocaleTimeString('en-US', {
    second: 'numeric',
    timeZone: props.timezone,
  })
  // Blink every second
  return parseInt(seconds) % 2 === 0
})
</script>

<template>
  <div :class="['flip-clock-wrapper', containerClass]" :style="containerStyles">
    <svg class="flip-clock-svg" viewBox="0 0 440 180" xmlns="http://www.w3.org/2000/svg">
      <!-- 
            The viewBox is 440x180:
            (Digit 1: 100) + (Digit 2: 100) + (Separator: 40) + (Digit 3: 100) + (Digit 4: 100) = 440
        -->

      <!-- 1. Render all 4 Digits -->
      <g
        v-for="digitIndex in DIGIT_COUNT"
        :key="digitIndex"
        :transform="`translate(${10 + (digitIndex - 1) * DIGIT_SPACING + (digitIndex > 2 ? 40 : 0)}, 0)`"
      >
        <!-- Render 7 Segments per Digit -->
        <rect
          v-for="segment in segmentGeometries"
          :key="segment.index"
          :x="segment.x"
          :y="segment.y"
          :width="segment.w"
          :height="segment.h"
          rx="5"
          ry="5"
          :class="['segment', { lit: digitSegmentStates[digitIndex - 1][segment.index] }]"
        />
      </g>

      <!-- 2. Separator (Colon) -->
      <g transform="translate(210, 0)">
        <!-- Dot 1 -->
        <circle cx="10" cy="50" r="10" :class="['separator-dot', { lit: isSeparatorLit }]" />
        <!-- Dot 2 -->
        <circle cx="10" cy="130" r="10" :class="['separator-dot', { lit: isSeparatorLit }]" />
      </g>
    </svg>

    <div class="timezone-display">Timezone: {{ timezone }}</div>
  </div>
</template>

<style scoped>
/* --- 1. Global CSS Variables for Theming --- */
:root {
  /* Light Mode (Default) */
  --clock-face-bg: rgba(255, 255, 255, 0.2);
  --clock-border: rgba(255, 255, 255, 0.4);
  --text-color: #333;
  --segment-off: #444; /* Dark gray for unlit segment */
  --segment-on: #ff6600; /* Amber/Orange for lit segment */
  --segment-glow: rgba(255, 102, 0, 0.6);
}

.dark-mode {
  /* Dark Mode Overrides */
  --clock-face-bg: rgba(0, 0, 0, 0.2);
  --clock-border: rgba(255, 255, 255, 0.1);
  --text-color: #eee;
  --segment-off: #181818; /* Nearly black */
  --segment-on: #00ffc0; /* Teal/Aqua for lit segment */
  --segment-glow: rgba(0, 255, 192, 0.6);
}

/* --- 2. Glassmorphic Wrapper --- */
.flip-clock-wrapper {
  /* Glassmorphism Effect */
  background: var(--clock-face-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--clock-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.timezone-display {
  color: var(--text-color);
  margin-top: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: color 0.3s;
}

/* --- 3. SVG and Segment Styling --- */

.flip-clock-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Base style for all segments */
.segment {
  fill: var(--segment-off);
  stroke: var(--segment-off);
  stroke-width: 1.5;
  transition:
    fill 0.05s ease-in-out,
    filter 0.3s ease; /* Fast flip for fill, slower for glow */
}

/* Style for lit segments */
.segment.lit {
  fill: var(--segment-on);
  stroke: var(--segment-on);
  filter: drop-shadow(0 0 10px var(--segment-glow));
}

/* Separator Dots */
.separator-dot {
  fill: var(--segment-off);
  transition:
    fill 0.05s ease-in-out,
    filter 0.3s ease;
}

.separator-dot.lit {
  fill: var(--segment-on);
  filter: drop-shadow(0 0 8px var(--segment-glow));
}
</style>
