<template>
  <label :class="['glass-checkbox-label', themeClass, { 'is-disabled': disabled }]">
    <input
      type="checkbox"
      class="hidden-input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />

    <div class="custom-checkbox">
      <!-- Checkmark SVG -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <!-- Slot for the label text -->
    <span class="label-text">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  /** Binds to the checkbox's checked state (v-model) */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /** Disables the checkbox */
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

// --- THEME AWARENESS (Polling for reactivity to external theme changes) ---
const isDarkRef = ref(document.documentElement.classList.contains('dark'))
let themeCheckerInterval = null

onMounted(() => {
  // Poll the DOM class list every 300ms to detect external theme changes
  themeCheckerInterval = setInterval(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark')
    if (isDarkRef.value !== isCurrentlyDark) {
      isDarkRef.value = isCurrentlyDark
    }
  }, 300)
})

onUnmounted(() => {
  clearInterval(themeCheckerInterval)
})

const themeClass = computed(() => (isDarkRef.value ? 'dark-mode' : 'light-mode'))

// --- EVENT HANDLER ---
const handleChange = (event) => {
  const isChecked = event.target.checked
  emit('update:modelValue', isChecked)
  emit('change', isChecked)
}
</script>

<style scoped lang="scss">
// --- SCSS VARIABLES ---
$size: 1.25rem; // Checkbox width and height
$border-radius: 0.375rem; // Rounded corners
$blur-level: 8px;

/* -------------------------------------------------------------------
   CSS Variable Definitions (Theme Switching)
   We define all dynamic colors using CSS variables
   ------------------------------------------------------------------- */

// --- Default/Light Mode Variables ---
:root,
.light-mode {
  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(0, 0, 0, 0.2);
  --glass-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  --checked-bg: #4c8fff; /* Standard blue check color */
  --checked-border: #4c8fff;
  --checkmark-color: white;
  --text-color: #1f2937;

  --hover-bg: rgba(255, 255, 255, 0.8);
  --disabled-opacity: 0.6;
}

// --- Dark Mode Overrides ---
.dark-mode {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

  --checked-bg: #5f9bff; /* Slightly lighter blue for dark BG */
  --checked-border: #5f9bff;
  --checkmark-color: #111; /* Dark checkmark for better contrast on glass */
  --text-color: #f3f4f6;

  --hover-bg: rgba(255, 255, 255, 0.1);
}

/* -------------------------------------------------------------------
   Component Styling
   ------------------------------------------------------------------- */

.glass-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  color: var(--text-color);
  transition: opacity 0.3s ease;
}

.label-text {
  font-size: 1rem;
}

.hidden-input {
  /* Hide the actual browser checkbox */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-checkbox {
  width: $size;
  height: $size;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;

  /* --- Glassmorphic Effect --- */
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));

  transition: all 0.2s ease-in-out;

  /* Checkmark styling (hidden by default) */
  svg {
    width: 70%;
    height: 70%;
    stroke: var(--checkmark-color);
    opacity: 0;
    transform: scale(0.6);
    transition: all 0.2s ease-in-out;
  }
}

/* --- State: Hover (when NOT disabled) --- */
.glass-checkbox-label:hover:not(.is-disabled) .custom-checkbox {
  background-color: var(--hover-bg);
}

/* --- State: Checked --- */
.hidden-input:checked + .custom-checkbox {
  background-color: var(--checked-bg);
  border-color: var(--checked-border);

  svg {
    opacity: 1;
    transform: scale(1);
  }
}

/* --- State: Disabled --- */
.glass-checkbox-label.is-disabled {
  cursor: not-allowed;
  opacity: var(--disabled-opacity);
}

.glass-checkbox-label.is-disabled .custom-checkbox {
  pointer-events: none;
  opacity: var(--disabled-opacity);
}
</style>
