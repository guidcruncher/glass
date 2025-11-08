<template>
  <Transition name="fade">
    <div v-if="props.modelValue" class="glass-window__backdrop" @click="closeWindow">
      <div class="glass-window" :style="windowStyle" @click.stop>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

// Define the component props with default values and types
const props = defineProps({
  width: {
    type: [String, Number],
    default: '400px',
    validator: (val) =>
      typeof val === 'number' ||
      (typeof val === 'string' && val.match(/^((\d*\.?\d+)(px|%|vw|vh|rem|em))$/)),
  },
  modelValue: {
    type: Boolean,
    // FIX: Corrected typo from 'dfault' to 'default'
    default: false,
  },
  height: {
    type: [String, Number],
    default: '300px',
    validator: (val) =>
      typeof val === 'number' ||
      (typeof val === 'string' && val.match(/^((\d*\.?\d+)(px|%|vw|vh|rem|em))$/)),
  },
  transparency: {
    type: Number,
    default: 0.1, // Default transparency (0.0 to 1.0)
    validator: (val) => val >= 0 && val <= 1,
  },
  x: {
    type: Number,
    default: null,
  },
  y: {
    type: Number,
    default: null,
  },
})

// Define emits
const emit = defineEmits(['update:modelValue'])

// Computed style object for dynamic dimensions, transparency, and positioning
const windowStyle = computed(() => {
  const windowWidth = typeof props.width === 'number' ? `${props.width}px` : props.width
  const windowHeight = typeof props.height === 'number' ? `${props.height}px` : props.height

  const styles = {
    '--window-width': windowWidth,
    '--window-height': windowHeight,
    '--bg-opacity': props.transparency,
    position: 'fixed',
    'z-index': 1000,
  }

  // Check if custom coordinates are provided
  if (props.x !== null && props.y !== null) {
    styles.left = `${props.x}px`
    styles.top = `${props.y}px`
    styles.transform = 'none'
  } else {
    // Default: Center the window in the viewport
    styles.left = '50%'
    styles.top = '50%'
    styles.transform = 'translate(-50%, -50%)'
  }

  return styles
})

// Function to close the window by emitting the v-model update
const closeWindow = () => {
  emit('update:modelValue', false)
}
</script>
