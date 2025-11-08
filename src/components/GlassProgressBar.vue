<template>
  <div
    :class="['progress-bar-container']"
    :aria-valuenow="normalizedValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    role="progressbar"
  >
    <div class="progress-bar-glass">
      <div class="progress-bar-fill" :style="{ width: `${percentage}%` }"></div>
    </div>
    <span class="progress-text">{{ percentage.toFixed(0) }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Define Props
const props = defineProps({
  // The current value of the progress bar (supports v-model)
  modelValue: {
    type: Number,
    required: true,
    default: 0,
  },
  // Minimum possible value
  min: {
    type: Number,
    default: 0,
  },
  // Maximum possible value
  max: {
    type: Number,
    default: 100,
  },
})

// Define Emits for v-model support
const emit = defineEmits(['update:modelValue'])

/**
 * Ensures the modelValue is within the [min, max] range.
 */
const normalizedValue = computed({
  get: () => Math.max(props.min, Math.min(props.max, props.modelValue)),
  set: (newValue) => {
    // This setter is technically for v-model, though a progress bar is usually read-only
    emit('update:modelValue', Math.max(props.min, Math.min(props.max, newValue)))
  },
})

/**
 * Calculates the current progress as a percentage.
 */
const percentage = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((normalizedValue.value - props.min) / range) * 100
})
</script>
