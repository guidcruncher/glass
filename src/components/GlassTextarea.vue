<template>
  <div class="input-container" :class="themeClass">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <textarea
      :id="id"
      type="text"
      class="glass-input"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :rows="rows"
      :cols="cols"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  /** Binds to the input's value (v-model) */
  modelValue: {
    type: String,
    default: "",
  },
  /** Optional label text displayed above the input */
  label: {
    type: String,
    default: "",
  },
  /** Placeholder text inside the input */
  placeholder: {
    type: String,
    default: "Enter text here...",
  },
  /** Unique ID for accessibility (linked to label) */
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`,
  },
  /** Disables the input field */
  disabled: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
  cols: {
    type: Number,
    default: 50,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// --- THEME AWARENESS (Polling for reactivity to external theme changes) ---
const isDarkRef = ref(document.documentElement.classList.contains("dark"));
let themeCheckerInterval = null;

onMounted(() => {
  // Poll the DOM class list every 300ms to detect external theme changes
  themeCheckerInterval = setInterval(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (isDarkRef.value !== isCurrentlyDark) {
      isDarkRef.value = isCurrentlyDark;
    }
  }, 300);
});

onUnmounted(() => {
  clearInterval(themeCheckerInterval);
});

const themeClass = computed(() =>
  isDarkRef.value ? "dark-mode" : "light-mode",
);

// --- EVENT HANDLER ---
const handleInput = (event) => {
  const value = event.target.value;
  emit("update:modelValue", value);
  // Optional: Emit change event on input blur or when value is final
  // emit('change', value);
};
</script>

<style scoped lang="scss">
// --- SCSS VARIABLES ---
$padding-y: 0.75rem;
$padding-x: 1rem;
$radius: 0.5rem;
$blur-level: 8px;

/* -------------------------------------------------------------------
   CSS Variable Definitions (Theme Switching)
   ------------------------------------------------------------------- */

// --- Default/Light Mode Variables ---
:root,
.light-mode {
  --text-color: #1f2937;
  --input-bg: rgba(255, 255, 255, 0.7);
  --input-border: rgba(0, 0, 0, 0.2);
  --input-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  --input-focus-border: #007aff;
  --input-focus-ring: rgba(0, 122, 255, 0.3);
  --placeholder-color: #6b7280;
  --disabled-bg: rgba(255, 255, 255, 0.4);
}

// --- Dark Mode Overrides ---
.dark-mode {
  --text-color: #f3f4f6;
  --input-bg: rgba(255, 255, 255, 0.1);
  --input-border: rgba(255, 255, 255, 0.2);
  --input-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  --input-focus-border: #4c8fff;
  --input-focus-ring: rgba(76, 143, 255, 0.5);
  --placeholder-color: #9ca3af;
  --disabled-bg: rgba(30, 30, 30, 0.5);
}

/* -------------------------------------------------------------------
   Component Styling
   ------------------------------------------------------------------- */

.input-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.9;
}

.glass-input {
  width: 100%;
  padding: $padding-y $padding-x;
  border-radius: $radius;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;

  /* Remove default browser styles */
  appearance: none;
  outline: none;

  /* --- Theme-Aware Glassmorphic Effect --- */
  background-color: var(--input-bg);
  color: var(--text-color);
  border: 1px solid var(--input-border);
  box-shadow: var(--input-shadow);
  backdrop-filter: blur($blur-level);
  -webkit-backdrop-filter: blur($blur-level);
}

/* --- State: Focus --- */
.glass-input:focus {
  background-color: var(--input-bg); /* Retain glass background */
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px var(--input-focus-ring); /* Accent focus ring */
}

/* --- State: Placeholder --- */
.glass-input::placeholder {
  color: var(--placeholder-color);
  opacity: 1;
}

/* --- State: Disabled --- */
.glass-input:disabled {
  background-color: var(--disabled-bg);
  cursor: not-allowed;
  opacity: 0.8;
}
</style>
