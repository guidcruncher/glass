<template>
  <label
    class="radio-item"
    :class="[
      `theme-${theme}`,
      {
        'is-checked': isChecked,
        'is-disabled': isDisabled,
      },
    ]"
  >
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
      class="radio-input"
    />

    <span class="control-box">
      <span class="control-inner"></span>
    </span>

    <span class="radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { inject, computed } from "vue";

// 1. Props
const props = defineProps({
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 2. Inject context from GlassRadioGroup
const group = inject("radioGroup");
if (!group) {
  console.error("GlassRadioItem must be used inside GlassRadioGroup.");
}

// 3. Computed Properties from injected context
const name = computed(() => group.name);
const theme = computed(() => group.theme.value);
const isDisabled = computed(() => props.disabled || group.groupDisabled.value);

// Check if the current item is selected
const isChecked = computed(() => group.selectedValue.value === props.value);

// 4. Handler
const handleChange = () => {
  if (!isDisabled.value) {
    group.updateValue(props.value);
  }
};
</script>

<style scoped>
/*
|--------------------------------------------------------------------------
| Base Styles & Hidden Input
|--------------------------------------------------------------------------
*/
.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  user-select: none;
  transition: all 0.3s ease;
  position: relative; /* Needed for Glassmorphism effects */
}

.radio-input {
  /* Hide the actual browser radio button */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-label {
  margin-left: 0.75rem;
  font-weight: 500;
  z-index: 2; /* Keep text above the glass background */
}

/*
|--------------------------------------------------------------------------
| Glassmorphism & Theme Styling (The core of the request)
|--------------------------------------------------------------------------
*/

/* --- THEME: DARK (Default) --- */
.theme-dark {
  color: white; /* Text color */
}

.theme-dark .control-box {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.08); /* Light fill */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.theme-dark.is-checked .control-box {
  background-color: rgba(144, 202, 249, 0.3); /* Checked accent */
}

/* --- THEME: LIGHT --- */
.theme-light {
  color: #333; /* Text color */
}

.theme-light .control-box {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5); /* Heavy light fill */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.theme-light.is-checked .control-box {
  background-color: rgba(0, 123, 255, 0.2); /* Checked accent */
}

/* --- COMMON GLASS STYLES (Applies to the whole item on hover/checked) --- */
.radio-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  /* 🛑 KEY GLASS MORPHISM PROPERTY */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1;
  transition: all 0.3s ease;
}

.radio-item:not(.is-disabled):hover::before {
  background-color: rgba(255, 255, 255, 0.1); /* Slight hover tint */
}

/*
|--------------------------------------------------------------------------
| Custom Radio Control (Circle/Dot)
|--------------------------------------------------------------------------
*/
.control-box {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 2; /* Keep control box above the glass background */
}

.control-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white; /* Default dot color */
  transition: transform 0.2s ease;
}

.theme-light .control-inner {
  background-color: #333; /* Light theme dot color */
}

/* Checked State Dot */
.is-checked .control-inner {
  transform: translate(-50%, -50%) scale(1);
}

/*
|--------------------------------------------------------------------------
| Disabled State Styling
|--------------------------------------------------------------------------
*/
.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* Disables all mouse interaction */
}

.is-disabled .control-box {
  border: 1px dashed rgba(150, 150, 150, 0.5) !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.is-disabled .control-inner {
  background-color: rgba(150, 150, 150, 0.5) !important;
}
</style>
