<template>
  <div :class="['glass-slider-container', { 'dark-mode': isDark }]" :style="sliderStyle">
    <slot name="before"></slot>

    <input
      ref="inputRef"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
    />

    <slot name="after"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Binds the value of the slider. */
  modelValue: { type: [Number, String], default: 50 },
  /** Minimum value of the slider. */
  min: { type: [Number, String], default: 0 },
  /** Maximum value of the slider. */
  max: { type: [Number, String], default: 100 },
  /** Step interval. */
  step: { type: [Number, String], default: 1 },
  /** Disables the slider. */
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

/**
 * Handles input event and emits the new value, ensuring it is a number.
 * @param {Event} event
 */
const onInput = (event) => {
  emit('update:modelValue', parseFloat(event.target.value))
}

/**
 * Calculates the percentage of the track that should be "filled" (colored).
 * This value is used by the SCSS via a CSS variable.
 */
const fillPercentage = computed(() => {
  const minVal = parseFloat(props.min)
  const maxVal = parseFloat(props.max)
  const currentVal = parseFloat(props.modelValue)

  if (isNaN(currentVal) || isNaN(minVal) || isNaN(maxVal) || maxVal === minVal) {
    return 0
  }
  return Math.max(0, Math.min(100, ((currentVal - minVal) / (maxVal - minVal)) * 100))
})

/**
 * Creates the style object to inject the calculated fill percentage as a CSS variable.
 */
const sliderStyle = computed(() => ({
  '--slider-fill-percentage': `${fillPercentage.value}%`,
}))

// Placeholder for isDark, assuming it's managed externally (e.g., Vuex/Pinia store or global class check)
const isDark = computed(() => {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark-mode')
  }
  return false
})
</script>
