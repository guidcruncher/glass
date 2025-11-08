<template>
  <div class="glass-dropdown-color-picker" ref="dropdownRef">
    <div class="color-trigger" @click="togglePicker" :aria-expanded="isVisible">
      <div class="color-preview-swatch" :style="{ backgroundColor: modelValue }"></div>
      <span class="color-value-text">{{ modelValue }}</span>
      <svg
        class="dropdown-icon"
        :class="{ open: isVisible }"
        viewBox="0 0 24 24"
        width="18"
        height="18"
      >
        <path fill="currentColor" d="M7 10l5 5 5-5z" />
      </svg>
    </div>

    <Teleport to="body">
      <Transition name="fade-slide">
        <div v-if="isVisible" class="picker-dropdown-content" :style="pickerPositionStyle">
          <GlassColorPicker
            :modelValue="modelValue"
            @update:modelValue="handleColorUpdate($event)"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import GlassColorPicker from './GlassColorPicker.vue' // Adjust path as needed

// Define props to receive the v-model binding
const props = defineProps({
  modelValue: {
    type: String,
    default: '#ff0000',
  },
})

// Define emits to update the v-model binding
const emit = defineEmits(['update:modelValue'])

const isVisible = ref(false)
const dropdownRef = ref(null)
const pickerRect = ref({ bottom: 0, left: 0 })

const togglePicker = async () => {
  isVisible.value = !isVisible.value
  if (isVisible.value) {
    // Wait for the DOM to update, then calculate position
    await nextTick()
    updatePickerPosition()
  }
}

const updatePickerPosition = () => {
  if (dropdownRef.value) {
    const rect = dropdownRef.value.getBoundingClientRect()
    pickerRect.value = {
      bottom: rect.bottom,
      left: rect.left,
    }
  }
}

const pickerPositionStyle = computed(() => {
  return {
    top: `${pickerRect.value.bottom + 10}px`, // 10px below the trigger
    left: `${pickerRect.value.left}px`,
    position: 'absolute',
    zIndex: 9999,
  }
})

const handleColorUpdate = (newColor) => {
  emit('update:modelValue', newColor)
  // Optional: Close the picker after selecting a color (you might prefer to keep it open)
  // isVisible.value = false;
}

// --- Click Outside Handler ---
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    // We only close if the click is outside the trigger AND outside the picker content
    // Since the picker content is teleported, we need to check its presence in the DOM
    const pickerContent = document.querySelector('.picker-dropdown-content')

    if (pickerContent && !pickerContent.contains(event.target)) {
      isVisible.value = false
    }
  }
}

// Recalculate position on window resize/scroll to keep it aligned
const handleResizeOrScroll = () => {
  if (isVisible.value) {
    updatePickerPosition()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('resize', handleResizeOrScroll)
  window.addEventListener('scroll', handleResizeOrScroll, true) // true for capture phase (needed for scrolling elements inside the app)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', handleResizeOrScroll)
  window.removeEventListener('scroll', handleResizeOrScroll, true)
})
</script>

<style lang="scss" scoped>
@use 'sass:map';
@import '../scss/components/GlassColorPicker.scss'; // Reuse theme definitions and functions

.glass-dropdown-color-picker {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  user-select: none;
  // Ensure this container doesn't affect the teleported content
}

// --- Trigger Styling (Apple-like Button) ---
.color-trigger {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-width: 150px;

  // Use theme props for consistent look with the picker
  color: var(--ui-text-color, #{theme-prop(light, ui-text-color)});
  background-color: var(--bg-color, rgba(255, 255, 255, 0.2));
  border: 1px solid var(--ui-border-color, rgba(255, 255, 255, 0.4));

  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-color, rgba(255, 255, 255, 0.35));
  }
}

.color-preview-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-right: 10px;
}

.color-value-text {
  flex-grow: 1;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.dropdown-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
  &.open {
    transform: rotate(180deg);
  }
}

// --- Dropdown Content Styling ---
.picker-dropdown-content {
  // Positioning is handled via :style binding in the template now.
  // We keep this class here for the close-on-click logic and base styles.
}

// --- Transition Effects ---
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
