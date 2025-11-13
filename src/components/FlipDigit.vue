<template>
  <div class="flip-digit-container">
    <div class="digit-card top-half" :data-digit="currentDigit">
      {{ currentDigit }}
    </div>
    <div class="digit-card bottom-half" :data-digit="currentDigit">
      {{ currentDigit }}
    </div>

    <div class="flipper" :class="{ 'is-flipping': isFlipping }" @transitionend="onFlipEnd">
      <div class="front-top" :data-digit="nextDigit"></div>

      <div class="back-bottom" :data-digit="nextDigit"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // The digit to display (0-9)
  value: {
    type: [String, Number],
    required: true,
  },
})

const currentDigit = ref(props.value)
const nextDigit = ref(props.value)
const isFlipping = ref(false)

// Watch for changes to the parent-provided 'value'
watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      nextDigit.value = newValue
      isFlipping.value = true
    }
  },
)

// Reset the state and update the static digit after the flip transition finishes
const onFlipEnd = (event) => {
  // Only proceed if the transition is for the main 'transform' property
  if (event.propertyName !== 'transform') return

  currentDigit.value = nextDigit.value
  isFlipping.value = false
}
</script>

<style scoped>
/* Core component structure and 3D setup */
.flip-digit-container {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 80px;
  font-size: 3rem;
  font-family: monospace;
  perspective: 100px; /* Key for 3D depth effect */
}

.digit-card,
.flipper > div {
  position: absolute;
  width: 100%;
  height: 50%;
  text-align: center;
  line-height: 80px; /* Center the digit vertically (height of container) */
  overflow: hidden;
  color: #fff;
  background-color: #2c3e50;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

/* Static top and bottom halves */
.top-half {
  top: 0;
}
.bottom-half {
  bottom: 0;
}

/* In the bottom half, we shift the content up to only show the lower portion of the digit */
.bottom-half {
  line-height: 0; /* Override to control position with transform */
}
.bottom-half::after {
  content: attr(data-digit);
  display: block;
  line-height: 80px;
  transform: translateY(-50%);
}

/* FLIPPER SETUP */
.flipper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: rotateX(0deg); /* Initial state */
}

.flipper.is-flipping {
  transform: rotateX(-180deg); /* Final flip state */
}

/* The card that flips down */
.front-top {
  top: 0;
  z-index: 2;
  transform-origin: bottom;
  background-color: #34495e;
  backface-visibility: hidden;
}
.front-top::before {
  content: attr(data-digit);
  display: block;
  line-height: 80px; /* Center top half */
}

/* The card that flips up (hidden initially by being rotated 180deg) */
.back-bottom {
  bottom: 0;
  z-index: 2;
  transform-origin: top;
  transform: rotateX(180deg);
  background-color: #34495e;
  backface-visibility: hidden;
}
.back-bottom::after {
  content: attr(data-digit);
  display: block;
  line-height: 80px;
  transform: translateY(-50%); /* Shift content up to align with bottom half */
}
</style>

*** The video below provides a visual tutorial for creating the flip clock animation effect, which
is the mechanism behind a `FlipDigit` component. [Flip Clock Animation Part 2 -
YouTube](https://www.youtube.com/watch?v=iebOE7EYW1Q) http://googleusercontent.com/youtube_content/0
*YouTube video views will be stored in your YouTube History, and your data will be stored and used
by YouTube according to its [Terms of Service](https://www.youtube.com/static?template=terms)*
