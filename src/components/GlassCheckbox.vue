<template>
  <label
    :class="['apple-toggle-container', { disabled: disabled }]"
    :tabindex="disabled ? -1 : 0"
    @keydown.space.prevent="toggle"
  >
    <div class="toggle-slot before-slot">
      <slot name="before" />
    </div>

    <div
      :class="['apple-toggle-switch', { checked: isChecked, disabled: disabled }]"
      @click="toggle"
      :aria-checked="isChecked"
      role="switch"
      :aria-disabled="disabled"
    >
      <span class="toggle-thumb"></span>
    </div>

    <div class="toggle-slot after-slot">
      <slot name="after" />
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue'

// Define Props and Emits
const props = defineProps({
  /** Binds the switch state (v-model) */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /** Disables the control */
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// --- Composition API Logic ---

/**
 * Computed property to hold the current checked state from modelValue.
 */
const isChecked = computed(() => props.modelValue)

/**
 * Toggles the state and emits the new value, but only if not disabled.
 */
const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<style scoped>
/* --- 🎨 Theme Variables (Theme Awareness) --- */
:root {
  /* Light Theme Defaults (iOS/macOS Light) */
  --apple-toggle-bg-color-unchecked: #e9e9ea;
  --apple-toggle-border-color-unchecked: #d1d1d6;
  --apple-toggle-checked-color: #34c759; /* Apple Green */
  --apple-toggle-thumb-color: #ffffff; /* White */
  --apple-toggle-disabled-opacity: 0.5;
}

.dark {
  :root {
    /* Dark Theme Overrides (iOS/macOS Dark) */
    --apple-toggle-bg-color-unchecked: #3a3a3c;
    --apple-toggle-border-color-unchecked: #48484a;
    --apple-toggle-checked-color: #30d158; /* Slightly brighter green for dark mode */
  }
}

/* --- 🍏 Component Styling --- */

.apple-toggle-container {
  display: flex;
  align-items: center;
  gap: 12px; /* Space between slots and the control */
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  padding: 4px; /* For focus outline visibility */
  outline: none; /* Removed default focus outline */
  transition: opacity 0.2s ease;
}

.apple-toggle-container.disabled {
  opacity: var(--apple-toggle-disabled-opacity);
  cursor: not-allowed;
}

/* Custom Focus State (for keyboard accessibility) */
.apple-toggle-container:focus-visible:not(.disabled) {
  outline: 2px solid var(--apple-toggle-checked-color);
  outline-offset: 1px;
}

.toggle-slot {
  display: flex;
  align-items: center;
  /* Min-height matches switch height for vertical alignment */
  min-height: 30px;
}

.apple-toggle-switch {
  /* The track (background) */
  width: 51px; /* Standard iOS width */
  height: 31px; /* Standard iOS height */
  border-radius: 15.5px; /* Perfect oval shape */
  border: 1px solid var(--apple-toggle-border-color-unchecked);
  background-color: var(--apple-toggle-bg-color-unchecked);
  transition:
    background-color 0.3s,
    border-color 0.3s;
  flex-shrink: 0;
  position: relative;
}

.apple-toggle-switch.checked {
  background-color: var(--apple-toggle-checked-color);
  border-color: var(--apple-toggle-checked-color);
}

.toggle-thumb {
  /* The circular indicator */
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px; /* Standard iOS thumb size */
  height: 27px;
  background-color: var(--apple-toggle-thumb-color);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Subtle lift */
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.4, 1.2),
    box-shadow 0.3s;
}

/* Thumb position when checked */
.apple-toggle-switch.checked .toggle-thumb {
  transform: translateX(
    20px
  ); /* 51px width - 27px thumb - 2px padding on each side = 20px travel */
}

/* Disabled styling (thumb color slightly dimmed for contrast) */
.apple-toggle-switch.disabled .toggle-thumb {
  background-color: #f0f0f0;
}
</style>
