<script setup>
import { computed } from 'vue'

// Define the component properties
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true, // Visible by default
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

// Calculate size based on the 'size' prop to adjust the CSS variables
const indicatorSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        '--indicator-size': '18px', // SVG size
        '--bar-length': '5px',
        '--bar-width': '1.5px',
      }
    case 'lg':
      return {
        '--indicator-size': '36px',
        '--bar-length': '12px',
        '--bar-width': '2.5px',
      }
    case 'md':
    default:
      return {
        '--indicator-size': '24px',
        '--bar-length': '8px',
        '--bar-width': '2px',
      }
  }
})

// An array of 12 elements to generate the 12 bars of the indicator
const bars = Array.from({ length: 12 }, (_, i) => i + 1)
</script>

<template>
  <div v-if="modelValue" class="activity-indicator-container" :style="indicatorSize">
    <svg class="activity-indicator-svg" viewBox="0 0 24 24">
      <rect
        v-for="i in bars"
        :key="i"
        class="activity-bar"
        :x="12 - parseFloat(indicatorSize['--bar-width']) / 2"
        :y="0"
        :width="indicatorSize['--bar-width']"
        :height="indicatorSize['--bar-length']"
        rx="1"
        :style="{
          '--bar-index': i,
          '--bar-delay': `${i * 0.083 - 1.2}s` /* Staggered delay, offset for smooth start */,
          transform: `rotateZ(calc(var(--bar-index) * 30deg)) translate(0, 12px)`,
          'transform-origin': '12px 12px',
        }"
      />
    </svg>
  </div>
</template>

<style scoped>
/*
  Theme color is automatically inherited from the parent container via CSS variable.
*/
.activity-indicator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* Control size using CSS variables defined in indicatorSize computed property */
  width: var(--indicator-size);
  height: var(--indicator-size);
  margin: 10px;
}

.activity-indicator-svg {
  width: 100%;
  height: 100%;
  animation: svg-spin 1.2s linear infinite; /* Optional subtle overall spin */
}

.activity-bar {
  /* Use theme text color for the indicator color */
  fill: var(--ui-text-color, #000);

  /* Initial rotation is handled inline via transform style */

  /* Animation to fade opacity */
  animation: bar-fade 1.2s infinite ease-in-out;
  animation-delay: var(--bar-delay);

  /*
    Set the initial opacity based on the index to create the 'at rest' look
    when the animation begins. This mimics the standard Apple indicator.
    We rely on the animation to handle the full cycle.
  */
}

/* Set initial opacities for the 12 bars */
.activity-bar:nth-child(1) {
  opacity: 1;
}
.activity-bar:nth-child(2) {
  opacity: 0.916;
}
.activity-bar:nth-child(3) {
  opacity: 0.833;
}
.activity-bar:nth-child(4) {
  opacity: 0.75;
}
.activity-bar:nth-child(5) {
  opacity: 0.666;
}
.activity-bar:nth-child(6) {
  opacity: 0.583;
}
.activity-bar:nth-child(7) {
  opacity: 0.5;
}
.activity-bar:nth-child(8) {
  opacity: 0.416;
}
.activity-bar:nth-child(9) {
  opacity: 0.333;
}
.activity-bar:nth-child(10) {
  opacity: 0.25;
}
.activity-bar:nth-child(11) {
  opacity: 0.166;
}
.activity-bar:nth-child(12) {
  opacity: 0.083;
}

/* The animation just fades the bar opacity from 0.083 (near invisible) to 1.0 */
@keyframes bar-fade {
  0%,
  39%,
  100% {
    opacity: 0.083;
  }
  40% {
    opacity: 1;
  }
}

/* Subtle overall spin animation */
@keyframes svg-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
