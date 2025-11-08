<template>
  <div :class="['circular-gauge', `gauge--${size}`]" :style="gaugeContainerStyle">
    <svg :viewBox="viewBox" class="gauge-svg">
      <circle :cx="center" :cy="center" :r="radius" class="gauge-track" />

      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="gauge-progress"
        :style="{
          strokeDasharray: dashArray,
          strokeLinecap: 'round',
        }"
      />

      <text
        :x="center"
        :y="center"
        class="gauge-value-text"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        {{ displayValue }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// --- PROPS & EMITS (v-model implementation) ---

const props = defineProps({
  /**
   * Two-way bound value (v-model). The current progress.
   */
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  /**
   * Maximum possible value for the gauge.
   */
  max: {
    type: [Number, String],
    default: 100,
  },
  /**
   * Component size control ('sm', 'md', 'lg', 'xl').
   */
  size: {
    type: String,
    validator: (val) => ['sm', 'md', 'lg', 'xl'].includes(val),
    default: 'md',
  },
})

const emit = defineEmits(['update:modelValue'])

// --- SVG GEOMETRY CALCULATIONS ---

const viewBoxSize = 100
const center = viewBoxSize / 2 // 50
const trackWidth = 8 // Stroke width for the gauge
const radius = center - trackWidth / 2 - 1 // Radius to fit cleanly inside viewBox
const circumference = 2 * Math.PI * radius

const viewBox = computed(() => `0 0 ${viewBoxSize} ${viewBoxSize}`)

const progressPercentage = computed(() => {
  const value = Number(props.modelValue)
  const max = Number(props.max)
  if (max === 0) return 0
  // Clamp value between 0 and 100%
  return Math.min(100, Math.max(0, (value / max) * 100))
})

/**
 * Calculates the 'stroke-dasharray' for the progress bar.
 */
const dashArray = computed(() => {
  const dashOffset = (progressPercentage.value / 100) * circumference
  return `${dashOffset} ${circumference}`
})

const displayValue = computed(() => {
  // Show rounded percentage
  return `${Math.round(progressPercentage.value)}%`
})

// --- SIZE STYLING ---

const gaugeContainerStyle = computed(() => {
  const sizes = {
    sm: '100px',
    md: '150px',
    lg: '200px',
    xl: '250px',
  }
  const dimension = sizes[props.size] || sizes.md
  return {
    width: dimension,
    height: dimension,
  }
})
</script>
