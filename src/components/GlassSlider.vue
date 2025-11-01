<template>
  <div class="apple-slider-wrapper">
    <div class="slider-control slider-left-control">
      <slot name="left-control" />
    </div>

    <input
      type="range"
      :value="modelValue"
      :min="minVal"
      :max="maxVal"
      :step="step"
      @input="handleInput"
      :style="sliderTrackStyle"
    />

    <div class="slider-control slider-right-control">
      <slot name="right-control" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue: number | string
  min?: number | string
  max?: number | string
  step?: number | string
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  accentColor: '#007aff', // A common default blue
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const minVal = computed(() => Number(props.min))
const maxVal = computed(() => Number(props.max))
const value = computed(() => Number(props.modelValue))

const fillPercent = computed(() => {
  if (maxVal.value === minVal.value) return 0
  return ((value.value - minVal.value) / (maxVal.value - minVal.value)) * 100
})

const sliderTrackStyle = computed(() => ({
  '--filled-color': props.accentColor,
  '--accent-color': props.accentColor,
  // This CSS background gradient drives the colored track effect
  background: `linear-gradient(to right, ${props.accentColor} 0%, ${props.accentColor} ${fillPercent.value}%, var(--unfilled-color) ${fillPercent.value}%, var(--unfilled-color) 100%)`,
}))

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
