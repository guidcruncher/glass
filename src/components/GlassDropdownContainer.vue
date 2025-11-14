<template>
  <div
    class="dropdown-wrapper"
    v-click-outside="closeDropdown"
    :style="{ maxWidth: maxButtonWidth }"
  >
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
      <!-- Slot for the selected value display -->
      <slot name="selected">
        <span>{{ modelValue }}</span>
      </slot>

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
        <!-- Slot for dropdown content, defaulting to iterating through options -->
        <slot name="dropdown" :close="closeDropdown">
          <div
            v-for="option in options"
            :key="option"
            class="dropdown-list-item"
            @click="selectOption(option)"
            :class="{ 'dark-hover': isDark, 'light-hover': !isDark }"
          >
            {{ option }}
          </div>
        </slot>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// Define Props
const props = defineProps<{
  options: string[] // List of available options
  modelValue: string // Current selected value (v-model)
  // Props for list size control
  maxListWidth?: string // Maximum width of the dropdown list (e.g., '100vw')
  maxListHeight?: string // Maximum height of the dropdown list (e.g., '100vh')
  listWidth?: string // Optional fixed width for the list (e.g., '500px')
  // NEW PROP: Max width for the button/container itself
  maxButtonWidth?: string // Maximum width of the button component (e.g., '300px')
}>()

// Default values for list props
const defaultMaxListWidth = '100vw'
const defaultMaxListHeight = '100vh'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', value: string): void
}>()

// --- STATE ---
const isOpen = ref(false)

// Refs for positioning
const dropdownButton = ref<HTMLElement | null>(null)
const listPositionStyle = ref<Record<string, string>>({}) // Use Record for dynamic styles

// --- THEME AWARENESS ---
const isDark = ref(true)
const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

// --- LIFECYCLE ---
let themeCheckerInterval: number | undefined = undefined

onMounted(() => {
  checkTheme()
  themeCheckerInterval = setInterval(checkTheme, 300) as unknown as number
  window.addEventListener('scroll', recalculatePosition)
  window.addEventListener('resize', recalculatePosition)
})

onUnmounted(() => {
  if (themeCheckerInterval) clearInterval(themeCheckerInterval)
  window.removeEventListener('scroll', recalculatePosition)
  window.removeEventListener('resize', recalculatePosition)
})

// --- POSITIONING LOGIC ---
const recalculatePosition = () => {
  if (!dropdownButton.value || !isOpen.value) return

  const { top, left, height, width } = dropdownButton.value.getBoundingClientRect()

  // Determine the width of the dropdown list: uses listWidth, then button width
  const finalWidth = props.listWidth || `${width}px`

  listPositionStyle.value = {
    top: `${top + height + 8}px`,
    left: `${left}px`,
    width: finalWidth, // Apply the determined width
    // Apply max width and height from props, falling back to defaults
    maxWidth: props.maxListWidth || defaultMaxListWidth,
    maxHeight: props.maxListHeight || defaultMaxListHeight,
    // Apply blur to dropdown list when theme is dark
    backdropFilter: isDark.value ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: isDark.value ? 'blur(14px)' : 'none',
  }
}

// Recalculate position if the theme changes or dropdown opens
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    recalculatePosition()
  }
})

// --- DROPDOWN LOGIC ---
const openDropdown = async () => {
  isOpen.value = !isOpen.value
}

const selectOption = (value: string) => {
  isOpen.value = false
  emit('select', value)
  emit('update:modelValue', value)
}

const closeDropdown = () => {
  isOpen.value = false
}

// --- VUE DIRECTIVE (Local implementation) ---
const vClickOutside = {
  mounted: (el: HTMLElement, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      const target = event.target as HTMLElement
      if (!(el === target || el.contains(target))) {
        if (!target.closest('.dropdown-list-teleported')) {
          binding.value(event, el)
        }
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: (el: HTMLElement) => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES (omitted for brevity, assume presence)
   =================================================================== */
/* Dark Mode Variables */
.dropdowncontainer {
  --text-color: #1f2937; /* gray-900 */
  --dropdown-bg: rgba(255, 255, 255, 0.65);
  --dropdown-border: rgba(0, 0, 0, 0.2);
  --button-focus-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);

  &.dark {
    --text-color: white;
    --dropdown-bg: rgba(30, 30, 30, 0.4);
    --dropdown-border: rgba(255, 255, 255, 0.2);
    --button-focus-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  /* ===================================================================
   DROPDOWN WRAPPER & BUTTON
   =================================================================== */
  .dropdown-wrapper {
    position: relative;
    /* The maxButtonWidth prop is applied inline in the template */
  }

  .dropdown-button {
    width: 100%; /* Important: Button always takes 100% of its wrapper's width (which is now capped) */
    padding: 0.75rem;
    border-radius: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;

    background-color: var(--dropdown-bg);
    border: 1px solid var(--dropdown-border);
    color: var(--text-color);
  }

  .dropdown-button.focus-ring {
    outline: none;
    box-shadow: var(--button-focus-shadow);
  }

  .dropdown-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  .rotate-180 {
    transform: rotate(180deg);
  }

  /* ===================================================================
   DROPDOWN LIST (TELEPORTED)
   =================================================================== */
  .dropdown-list-teleported {
    position: fixed;
    margin-top: 0;
    border-radius: 0.75rem;
    z-index: 9999;
    overflow: hidden;
    overflow-y: auto;

    background-color: var(--dropdown-bg);
    border: 1px solid var(--dropdown-border);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .dropdown-list-item {
    padding: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--text-color);
    font-size: 0.9rem;
  }

  .dropdown-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .light-theme .dropdown-list-item:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
