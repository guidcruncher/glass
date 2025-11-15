<template>
  <div
    class="app-container"
    :style="{
      '--header-height': headerHeight,
      '--footer-height': footerHeight,
    }"
  >
    <header class="app-header" :style="{ height: headerHeight }">
      <template v-if="$slots.top">
        <slot name="top"></slot>
      </template>

      <AppHeader
        v-else
        :title="headerTitle"
        :toggle-left="toggleWrapper('left', toggleLeftSidebar)"
        :is-left-open="isLeftSidebarOpen"
        :toggle-right="toggleWrapper('right', toggleRightSidebar)"
        :is-right-open="isRightSidebarOpen"
      >
        <template v-if="$slots['header-nav-links']" #nav-links>
          <slot name="header-nav-links"></slot>
        </template>
      </AppHeader>
    </header>

    <div class="main-content-wrapper">
      <aside
        class="app-sidebar sidebar-left"
        :style="{ width: leftSidebarWidth }"
        :class="{ 'sidebar-closed': leftSidebarWidth === '0' }"
      >
        <slot name="left"></slot>
      </aside>

      <main class="main-content">
        <slot name="body" v-if="$slots['body']"></slot>
        <slot v-else></slot>
      </main>

      <aside
        class="app-sidebar sidebar-right"
        :style="{ width: rightSidebarWidth }"
        :class="{ 'sidebar-closed': rightSidebarWidth === '0' }"
      >
        <slot name="right"></slot>
      </aside>
    </div>

    <footer class="app-footer" :style="{ height: footerHeight }" v-if="slots.bottom">
      <slot name="bottom"></slot>
    </footer>
  </div>
  <div style="display: none" v-if="$slots.hidden">
    <slot name="hidden"></slot>
  </div>
</template>

<script setup>
import { computed, onMounted, useSlots, watch } from 'vue'
// Pinia store import
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../composables/useThemeStore'
import AppHeader from './AppHeader.vue'

const props = defineProps({
  initialTheme: {
    type: String,
    default: 'dark',
    validator: (value) => ['light', 'dark'].includes(value),
  },
  headerHeight: { type: String, default: '4rem' },
  footerHeight: { type: String, default: '3rem' },
  sidebarWidth: { type: String, default: '16rem' },
  headerTitle: { type: String, default: 'Glass App' },
  backgroundImageUrl: { type: String, required: false, default: null },
})

const slots = useSlots()
const OPEN_WIDTH = computed(() => props.sidebarWidth)

// --- PINIA STORE INTEGRATION ---
const themeStore = useThemeStore()
// Destructure state properties using storeToRefs to maintain reactivity
const { theme, isLeftSidebarOpen, isRightSidebarOpen } = storeToRefs(themeStore)
// Destructure actions
const { setTheme } = themeStore

// --- Sidebar Toggles (Now setting Pinia state) ---

const toggleWrapper = (name, func) => {
  return slots[name] ? func : undefined
}

const toggleLeftSidebar = () => {
  // Toggling the reactive Pinia state property
  if (slots.left) {
    themeStore.toggleLeftSidebar()
  }
}
const toggleRightSidebar = () => {
  // Toggling the reactive Pinia state property
  if (slots.right) {
    themeStore.toggleRightSidebar()
  }
}

// Dynamic width calculation (Controlled by Pinia state)
const leftSidebarWidth = computed(() => {
  // If the 'left' slot is NOT used, width is locked to '0'.
  // Otherwise, use the Pinia state value.
  if (!slots.left) {
    return '0'
  }
  return isLeftSidebarOpen.value ? OPEN_WIDTH.value : '0'
})

const rightSidebarWidth = computed(() => {
  // If the 'right' slot is NOT used, width is locked to '0'.
  // Otherwise, use the Pinia state value.
  if (!slots.right) {
    return '0'
  }
  return isRightSidebarOpen.value ? OPEN_WIDTH.value : '0'
})

// NOTE: LocalStorage sidebar watchers are removed as persistence should be handled by the Pinia store itself.

// Expose state for parent control
defineExpose({
  toggleLeft: toggleLeftSidebar,
  toggleRight: toggleRightSidebar,
  isLeftOpen: isLeftSidebarOpen,
  isRightOpen: isRightSidebarOpen,
})

// --- Theme Application Logic (Now uses Pinia's 'theme' state) ---
const applyTheme = (currentTheme) => {
  const isDarkTheme = currentTheme === 'dark'
  const root = document.documentElement
  let backgroundUrl

  if (props.backgroundImageUrl) {
    backgroundUrl = `url("${props.backgroundImageUrl}")`
  }

  // Apply theme classes
  if (isDarkTheme) {
    root.classList.remove('light')
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
    root.classList.add('light')
  }

  // Apply background image
  document.body.style.backgroundImage = backgroundUrl
  document.body.style.overflow = 'hidden'
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundAttachment = 'fixed'

  // NOTE: Removed localStorage.setItem('_theme', theme)
}

// Watch for changes in the theme state from Pinia, and apply it
watch(
  theme,
  (newTheme) => {
    applyTheme(newTheme)
  },
  { immediate: true }, // Run once immediately on setup to apply the initialized store theme
)

// Watch for changes to the background URL prop
watch(
  () => props.backgroundImageUrl,
  () => {
    // Re-apply theme only to update the background image if the prop changes
    applyTheme(theme.value)
  },
)

onMounted(() => {
  // Use the initialTheme prop to set the theme in the store if it hasn't been set or persisted yet.
  // In a real scenario, the store would handle loading the persisted state.

  // A safer approach for initialization: if the store theme is null/default/uninitialized, use the prop.
  // Since Pinia states are initialized, we'll ensure the prop's theme is set as the initial theme
  // if the store's current theme doesn't match the desired initial theme.
  if (theme.value !== props.initialTheme) {
    setTheme(props.initialTheme)
  }
})
</script>

<style>
/* (Global styles remain unchanged) */
/* ======================================================\
  GLOBAL CSS SCAFFOLDING & THEME VARIABLES
  ======================================================
*/

/* 1. Global Variables (Defaults to Dark Mode) */
:root {
  --glass-bg: rgba(30, 30, 30, 0.4);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --glass-blur: 14px;
  --text-color: #f9fafb;
}

/* Light Mode Overrides */
html.light {
  --glass-bg: rgba(255, 255, 255, 0.65);
  --glass-border: rgba(0, 0, 0, 0.15);
  --glass-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --text-color: #111827;
}

/* 2. Global Resets and Transitions */
html {
  touch-action: pan-x pan-y;
}
body {
  overflow: hidden;
  overscroll-behavior: none;
  color: var(--text-color);
}
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 3. Global App Layout */
.app-container {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
}
.main-content-wrapper {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
}
.main-content {
  flex-grow: 1;
  overflow-y: auto;
}

/* 4. Glassmorphic Sections */
.app-header,
.app-footer,
.app-sidebar {
  flex-shrink: 0;
  background-color: var(--glass-bg);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}
.app-header {
  height: var(--header-height);
  border-bottom: 1px solid var(--glass-border);
  position: sticky;
  top: 0;
  z-index: 50;
}
.app-footer {
  height: var(--footer-height);
  border-top: 1px solid var(--glass-border);
  position: sticky;
  bottom: 0;
  z-index: 50;
}
.app-sidebar {
  overflow-y: auto;
  transition: width 0.3s ease;
  flex-shrink: 0;
}
.sidebar-left {
  border-right: 1px solid var(--glass-border);
}
.sidebar-right {
  border-left: 1px solid var(--glass-border);
}
.sidebar-closed {
  overflow: hidden;
}

/* 5. Scrollbar Styling */
main::-webkit-scrollbar,
aside::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-thumb,
aside::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
html.light main::-webkit-scrollbar-thumb,
html.light aside::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
