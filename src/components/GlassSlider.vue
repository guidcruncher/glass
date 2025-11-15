<template>
  <section class="slider-section-container">
    <div class="slider-wrapper">
      <div class="slider-text-info">
        <span><slot name="befere">Prompt</slot></span>
        <span
          ><slot name="after">{{ modelValue }}</slot></span
        >
      </div>
      <input
        type="range"
        min="0"
        max="100"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="custom-slider"
        :style="{ '--progress': modelValue + '%' }"
      />
    </div>
  </section>
</template>

<script setup>
// Added CSS variable to assist with thumb styling below
defineProps({
  modelValue: {
    type: [Number, String],
    default: 50,
  },
})
defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Dark Theme (Default) */
:root {
  --glass-bg: rgba(30, 30, 30, 0.4);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --track-bg-empty: rgba(255, 255, 255, 0.2); /* bg-white/20 */
  --text-color: white;
}
/* Light Theme (Override) */
.dark {
  --track-bg-empty: rgba(0, 0, 0, 0.2); /* light:bg-black/20 */
  --text-color: #1f2937;
}

/* ===================================================================
   CONTAINER AND LAYOUT
   =================================================================== */
.slider-section-container {
  padding: 2rem; /* p-8 */
  color: var(--text-color);
}

.section-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 1.5rem;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

/* ===================================================================
   TEXT INFO
   =================================================================== */
.slider-text-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem; /* text-sm */
  opacity: 0.8;
}

/* ===================================================================
   SLIDER (INPUT[TYPE=RANGE]) STYLING
   =================================================================== */
.custom-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.5rem; /* h-2 */
  border-radius: 9999px; /* rounded-full */
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Custom filled track look for WebKit (Chrome, Safari) */
.custom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  /* Use a gradient to simulate a filled track up to the thumb's position */
  background: linear-gradient(
    to right,
    #007aff,
    #007aff var(--progress, 50%),
    var(--track-bg-empty) var(--progress, 50%),
    var(--track-bg-empty) 100%
  );
}

/* Custom thumb look for WebKit */
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
  margin-top: -8px;
  border-radius: 50%;
  background: white;
  border: 4px solid #007aff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

/* Custom filled track look for Firefox */
.custom-slider::-moz-range-track {
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--track-bg-empty);
}

.custom-slider::-moz-range-progress {
  background: #007aff;
  height: 0.5rem;
  border-radius: 9999px;
}

.custom-slider::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: white;
  border: 4px solid #007aff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
