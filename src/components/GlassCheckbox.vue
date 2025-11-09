<template>
  <label :class="['glass-checkbox', `size-${size}`, { 'is-disabled': disabled }]" :style="cssVars">
    <input
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
	      class="visually-hidden"
    />
    <span class="box-container">
      <span :class="['glass-box', { 'is-checked': isChecked }]">
        <svg
          v-if="isChecked"
          class="checkmark"
          viewBox="0 0 24 24"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21.2 6.8l-1.4-1.4L9 16.2z" />
        </svg>
      </span>
    </span>
    <slot><span style="color: baseVars['--text-color']" >{{label}}</span></slot>
  </label>
</template>

<script setup>
import { computed } from 'vue'

// --- Theme Utility Functions (Simulated) ---
// Simplified local maps based on the provided global maps
const themeLightMap = {
  'ui-text-color': '#000000',
  'secondary-label': 'rgba(0, 0, 0, 0.55)',
  'ui-checkbox-checked-bg': '#6200ee',
  'ui-checkbox-checkmark-color': '#ffffff',
  'ui-border-color': 'rgba(255, 255, 255, 0.3)',
  'glass-overlay': 'rgba(255, 255, 255, 0.4)',
  'shadow-depth': '0 4px 12px rgba(0, 0, 0, 0.1)',
}

const themeDarkMap = {
  'ui-text-color': '#ffffff',
  'secondary-label': 'rgba(0, 0, 0, 0.55)',
  'ui-checkbox-checked-bg': '#6200ee',
  'ui-checkbox-checkmark-color': '#ffffff',
  'ui-border-color': 'rgba(255, 255, 255, 0.3)',
  'glass-overlay': 'rgba(255, 255, 255, 0.4)',
  'shadow-depth': '0 4px 12px rgba(0, 0, 0, 0.1)',
}

/** @param {string} theme @param {string} prop */
const themeProp = (theme, prop) => {
  if (theme === 'light') {
    return themeLightMap[prop] || 'initial'
  }
  if (theme === 'dark') {
    return themeDarkMap[prop] || 'initial'
  }
  return 'initial'
}

// --- Component Setup ---
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val),
  },
  label: {type: String, default:''},
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
const currentTheme = 'light'

const isChecked = computed(() => props.modelValue)

// --- CSS Variable Injection ---
// All theme properties are now passed as inline CSS variables to the root element.
const cssVars = computed(() => {
  const baseVars = {
    // Checkbox Colors
    '--checked-bg': themeProp(currentTheme, 'ui-checkbox-checked-bg'),
    '--checkmark-color': themeProp(currentTheme, 'ui-checkbox-checkmark-color'),
    // Glass Colors
    '--box-border-color': themeProp(currentTheme, 'ui-border-color'),
    '--box-glass-bg': themeProp(currentTheme, 'glass-overlay'),
    // Shadows and Text
    '--box-shadow': themeProp(currentTheme, 'shadow-depth'),
    '--text-color': themeProp(currentTheme, 'ui-text-color'),
    '--disabled-text-color': themeProp(currentTheme, 'secondary-label'),
    // Disabled/Unchecked Glass
    '--box-unchecked-bg': 'rgba(255, 255, 255, 0.15)', // Custom for unchecked glass look
  }

  // Dynamic state overrides are now handled via CSS classes, but we control the root text color here
  return {
    ...baseVars,
    color: props.disabled ? baseVars['--disabled-text-color'] : baseVars['--text-color'],
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  }
})

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
  }
}
</script>

<style lang="scss">
/* Utility to hide native checkbox but keep it accessible */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.glass-checkbox {
  // Uses injected CSS variables for styling
  display: inline-flex;
  align-items: center;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  gap: 8px;
  transition: opacity 0.2s;

  &.is-disabled {
    opacity: 0.7; // Global dim for disabled state
    cursor: not-allowed;
  }

  .box-container {
    display: inline-flex;
    position: relative;
    flex-shrink: 0;
  }

  .glass-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    // Default appearance (Unchecked Glassmorphism)
    background-color: var(--box-glass-bg);
    border: 1px solid var(--box-border-color);
    box-shadow: var(--box-shadow);

    // Apply the glass effect
    backdrop-filter: blur(8px) saturate(180%);
    -webkit-backdrop-filter: blur(8px) saturate(180%);

    .checkmark {
      width: 100%;
      height: 100%;
      // Use the injected color variable
      color: var(--checkmark-color);
      transform: scale(0); // Hidden by default
      transition: transform 0.2s ease-out;
    }

    // --- CHECKED STATE ---
    &.is-checked {
      // Override appearance when checked
      background-color: var(--checked-bg);
      border-color: var(--checked-bg); // Use solid color border
      box-shadow: var(--box-shadow);
      transform: scale(1.05);

      .checkmark {
        transform: scale(0.85); // Visible
      }
    }

    // --- DISABLED STATE STYLING (overrides unchecked/checked) ---
    .glass-checkbox.is-disabled & {
      // Subtle background override for disabled glass
      background-color: var(--box-unchecked-bg);
      border-color: var(--box-border-color);
    }
  }

  // --- Sizing ---
  &.size-small .glass-box {
    width: 16px;
    height: 16px;
  }
  &.size-medium .glass-box {
    width: 20px;
    height: 20px;
  }
  &.size-large .glass-box {
    width: 24px;
    height: 24px;
  }
}
</style>
