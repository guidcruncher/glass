<template>
  <div v-if="isVisible" class="popup-backdrop" @click.self="closeOnOutsideClick && close()">
    <div class="popup-overlay"></div>

    <div
      :class="[
        'popup-container',
        {
          'scale-100 opacity-100': isVisible,
          'scale-95 opacity-0': !isVisible,
        },
      ]"
      role="dialog"
      aria-modal="true"
    >
      <slot></slot>

      <button @click="close" class="popup-close-button" aria-label="Close popup">
        <svg
          class="close-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const isVisible = ref(props.modelValue)

// Sync internal state with v-model (modelValue prop)
watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
  },
)

// Sync v-model back to parent
const close = () => {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
/* ===================================================================
   BASE STYLES (Light Glass Default)
   =================================================================== */

/* Theme Variables (Assuming Light Glass for Popup) */
:root {
  --popup-bg: rgba(255, 255, 255, 0.65); /* bg-white/65 */
  --popup-border: rgba(255, 255, 255, 0.8); /* border-white/80 */
  --popup-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
  --popup-text: #1f2937; /* text-gray-900 */
  --backdrop-color: rgba(0, 0, 0, 0.5); /* bg-black/50 */
}

.popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* p-4 */
}

.popup-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--backdrop-color);
}

.popup-container {
  position: relative;
  padding: 2rem; /* p-8 */
  border-radius: 1rem; /* rounded-2xl */
  max-width: 32rem; /* max-w-lg (512px) */
  width: 100%;
  color: var(--popup-text);

  /* Glassmorphism */
  background-color: var(--popup-bg);
  border: 1px solid var(--popup-border);
  box-shadow: var(--popup-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  /* Transition */
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
  transform-origin: center;
}

/* ===================================================================
   CLOSE BUTTON
   =================================================================== */
.popup-close-button {
  position: absolute;
  top: 0.75rem; /* top-3 */
  right: 0.75rem; /* right-3 */
  padding: 0.5rem; /* p-2 */
  border-radius: 50%; /* rounded-full */
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #4b5563; /* text-gray-700 */
}

.popup-close-button:hover {
  background-color: rgba(0, 0, 0, 0.1); /* hover:bg-black/10 */
}

.close-icon {
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
  display: block;
}
</style>
