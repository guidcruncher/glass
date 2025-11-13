<template>
  <GlassDropdownContainer class="glass-color-picker">
    <template #selected>
      <div class="selected-color-display">
        <span
          v-if="selectedColor"
          class="color-preview"
          :style="{ backgroundColor: selectedColor }"
          aria-label="Selected color preview"
          :title="selectedColor"
        ></span>
        <span v-else class="placeholder-text"> Select a color... </span>
      </div>
    </template>

    <template #dropdown="{ close: closeDropdown }">
      <div class="color-palette-wrapper">
        <GlassColorPalette
          :modelValue="colorValue"
          @update:modelValue="handleColorSelect($event, closeDropdown)"
          @color-selected="handleColorSelect($event, closeDropdown)"
        />
      </div>
    </template>
  </GlassDropdownContainer>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";
// Assuming GlassDropdownContainer is imported from its file path
import GlassDropdownContainer from "./GlassDropdownContainer.vue";
import GlassColorPalette from "./GlassColorPalette.vue";

// --- PROPS and EMITS (v-model for selected color) ---
const props = defineProps({
  // modelValue can be a hex string, rgba string, or null
  modelValue: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Use the computed property for V-model
const colorValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// --- DISPLAY LOGIC ---

const selectedColor = computed(() => {
  // Basic validation for common color string formats
  if (
    colorValue.value &&
    (colorValue.value.startsWith("#") || colorValue.value.startsWith("rgb"))
  ) {
    return colorValue.value;
  }
  return null;
});

/**
 * Handles the selection of a color from the palette.
 * @param {string} color - The newly selected color string (e.g., '#RRGGBB').
 * @param {Function} closeDropdown - Function provided by GlassDropdownContainer slot.
 */
const handleColorSelect = (color, closeDropdown) => {
  // Update the modelValue to reflect the new selection
  colorValue.value = color;

  // Close the dropdown immediately after selection
  closeDropdown();
};
</script>

<style scoped>
/* Scoped styles specific to the Color Picker */

.selected-color-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-preview {
  display: inline-block;
  width: 1.5rem; /* Size of the color swatch */
  height: 1.5rem;
  border-radius: 0.375rem; /* rounded-md */
  border: 1px solid rgba(0, 0, 0, 0.2); /* Slight border for visibility */
  flex-shrink: 0; /* Prevent it from shrinking */
}

.placeholder-text {
  opacity: 0.7;
  font-style: italic;
  white-space: nowrap; /* Keep placeholder on one line */
}

/* Wrapper for the color palette to apply any necessary spacing/sizing */
.color-palette-wrapper {
  width: 100%;
  padding: 0.5rem; /* Add padding inside the dropdown panel */
  min-width: 150px; /* Ensure enough space for the palette */
}

/* Optional: Placeholder styling for the color palette if needed */
.glass-color-palette-placeholder {
  background-color: rgba(255, 255, 255, 0.9);
  color: #111827;
  border-radius: 0.5rem;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
html.dark .glass-color-palette-placeholder {
  background-color: rgba(30, 30, 30, 0.8);
  color: white;
}
</style>
