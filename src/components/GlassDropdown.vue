<template>
  <div class="dropdown-wrapper" v-click-outside="closeDropdown">
    <button
      @click="openDropdown"
      ref="dropdownButton"
      class="dropdown-button"
      :class="{
        'dark-theme': isDark,
        'light-theme': !isDark,
        'focus-ring': isOpen,
      }"
    >
      <span>{{ selectedValue }}</span>
      <svg
        class="dropdown-icon"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <teleport to="body">
      <div
        v-show="isOpen"
        class="dropdown-list-teleported"
        :class="{ 'dark-theme': isDark, 'light-theme': !isDark }"
        :style="listPositionStyle"
      >
        <div
          v-for="option in options"
          :key="option"
          class="dropdown-list-item"
          @click="selectOption(option)"
          :class="{ 'dark-hover': isDark, 'light-hover': !isDark }"
        >
          {{ option }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// --- OPTIONS ---
const options = ['Meeting', 'Call', 'Task', 'Reminder', 'Birthday']
const selectedValue = ref('Select an option...')
const isOpen = ref(false)

// Ref for the button element to get its position
const dropdownButton = ref(null)
const listPositionStyle = ref({})

// --- THEME AWARENESS ---

onMounted(() => {
  // Add event listener to recalculate position on scroll/resize
  window.addEventListener('scroll', recalculatePosition)
  window.addEventListener('resize', recalculatePosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', recalculatePosition)
  window.removeEventListener('resize', recalculatePosition)
})

// --- POSITIONING LOGIC ---
const recalculatePosition = () => {
  if (!dropdownButton.value || !isOpen.value) return

  // Get the bounding box of the button relative to the viewport
  const { top, left, height, width } = dropdownButton.value.getBoundingClientRect()

  // Set the style for the teleported list
  listPositionStyle.value = {
    top: `${top + height + 8}px`, // 8px (0.5rem) margin-top
    left: `${left}px`,
    width: `${width}px`,
  }
}

// --- DROPDOWN LOGIC ---
const openDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Wait for the list element to be rendered in the body before calculating its position
    await nextTick()
    recalculatePosition()
  }
}

const selectOption = (value) => {
  selectedValue.value = value
  isOpen.value = false
}

const closeDropdown = () => {
  isOpen.value = false
}

// --- VUE DIRECTIVE (Must be globally registered in your application) ---
const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        // Only close if the target isn't the teleported list itself
        if (!event.target.closest('.dropdown-list-teleported')) {
          binding.value(event, el)
        }
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped lang="scss">
/* ===================================================================
   THEME VARIABLES
   =================================================================== */

/* Dark Mode Variables */
.dark-theme {
  --text-color: white;
  --dropdown-bg: rgba(30, 30, 30, 0.4);
  --dropdown-border: rgba(255, 255, 255, 0.2);
  --button-focus-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  --list-item-hover: rgba(255, 255, 255, 0.1);
}

/* Light Mode Variables */
.light-theme {
  --text-color: #1f2937; /* gray-900 */
  --dropdown-bg: rgba(255, 255, 255, 0.65);
  --dropdown-border: rgba(0, 0, 0, 0.2);
  --button-focus-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  --list-item-hover: rgba(0, 0, 0, 0.1);
}

.light-theme.dropdown-section {
  background-color: rgba(255, 255, 255, 0.65);
  border-color: rgba(0, 0, 0, 0.15);
  color: #1f2937;
}

.dropdown-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 1.5rem;
}

/* ===================================================================
   DROPDOWN WRAPPER
   =================================================================== */
.dropdown-wrapper {
  position: relative;
}

/* ===================================================================
   DROPDOWN BUTTON
   =================================================================== */
.dropdown-button {
  width: 100%;
  padding: 0.75rem; /* p-3 */
  border-radius: 0.75rem; /* rounded-xl */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem; /* text-base */
  transition: all 0.2s ease;
  cursor: pointer;

  /* Apply dynamic theme variables */
  background-color: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  color: var(--text-color);
}

/* Responsive Padding */
@media (min-width: 768px) {
  /* md:p-4 */
  .dropdown-button {
    padding: 1rem;
  }
}

/* Focus Ring */
.dropdown-button.focus-ring {
  outline: none;
  box-shadow: var(--button-focus-shadow);
}

/* Dropdown Icon */
.dropdown-icon {
  width: 1.25rem; /* w-5 h-5 */
  height: 1.25rem;
  margin-left: 0.5rem; /* ml-2 */
  transition: transform 0.3s ease;
}
.rotate-180 {
  transform: rotate(180deg);
}

/* ===================================================================
   DROPDOWN LIST (TELEPORTED)
   =================================================================== */
.dropdown-list-teleported {
  /* CRITICAL CHANGE: Fixed position relative to the viewport */
  position: fixed;
  /* top, left, and width are set dynamically by JS */

  margin-top: 0;
  border-radius: 0.75rem; /* rounded-xl */
  z-index: 9999; /* Higher z-index to appear above all elements */
  overflow: hidden;

  /* Apply dynamic theme variables */
  background-color: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-list-item {
  padding: 0.75rem; /* p-3 */
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text-color);
}

/* Responsive Padding */
@media (min-width: 768px) {
  /* md:p-4 */
  .dropdown-list-item {
    padding: 1rem;
  }
}

/* Hover States (Using specific class bindings for theme switching) */
.dropdown-list-item.dark-hover:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-list-item.light-hover:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
