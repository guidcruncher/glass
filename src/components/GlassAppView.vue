<template>
  <div
    class="app-container"
    :style="{
      '--header-height': headerHeight,
      '--footer-height': footerHeight,
    }"
  >
    <header class="app-header" :style="{ height: headerHeight }">
      <!-- Option 1: Full custom header via slot -->
      <template v-if="$slots.top">
        <slot name="top"></slot>
      </template>

      <!-- Option 2: Default header using AppHeader component -->
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
      <!-- LEFT SIDEBAR SLOT: Renders always, using its width state -->
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

      <!-- RIGHT SIDEBAR SLOT: Renders always, using its width state -->
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
</template>

<script setup>
import { computed, onMounted, ref, useSlots, watch } from 'vue'
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

// --- LOCAL STORAGE KEYS ---
const SIDEBAR_LEFT_KEY = 'glassappview_sidebar_left_open'
const SIDEBAR_RIGHT_KEY = 'glassappview_sidebar_right_open'

const getInitialState = (key) => {
  if (typeof localStorage !== 'undefined') {
    const storedState = localStorage.getItem(key)
    return storedState === 'true'
  }
  return true // Default to open
}

// --- Sidebar State Management (Initialized from Local Storage) ---
// Initialize state. If state is not found, default to TRUE only if the slot exists.
const isLeftSidebarOpen = ref(getInitialState(SIDEBAR_LEFT_KEY))
const isRightSidebarOpen = ref(getInitialState(SIDEBAR_RIGHT_KEY))

const toggleWrapper = (name, func) => {
  return slots[name] ? func : undefined
}

const toggleLeftSidebar = () => {
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}
const toggleRightSidebar = () => {
  isRightSidebarOpen.value = !isRightSidebarOpen.value
}

// Dynamic width calculation (Sidebar width is now controlled purely by the toggle state)
const leftSidebarWidth = computed(() => (isLeftSidebarOpen.value ? OPEN_WIDTH.value : '0'))
const rightSidebarWidth = computed(() => (isRightSidebarOpen.value ? OPEN_WIDTH.value : '0'))

// --- WATCHERS FOR STATE PERSISTENCE ---

watch(isLeftSidebarOpen, (newValue) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SIDEBAR_LEFT_KEY, newValue ? 'true' : 'false')
  }
})

watch(isRightSidebarOpen, (newValue) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SIDEBAR_RIGHT_KEY, newValue ? 'true' : 'false')
  }
})

// Expose state for parent control
defineExpose({
  toggleLeft: toggleLeftSidebar,
  toggleRight: toggleRightSidebar,
  isLeftOpen: isLeftSidebarOpen,
  isRightOpen: isRightSidebarOpen,
})

// --- Theme Application Logic (Remains Unchanged) ---
const applyTheme = (theme) => {
  const isDarkTheme = theme === 'dark'
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
  localStorage.setItem('_theme', theme)
}

// Watch for changes in the theme and the new background URL
watch(
  () => [props.initialTheme, props.backgroundImageUrl],
  () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    applyTheme(currentTheme)
  },
  { deep: true },
)

onMounted(() => {
  const savedTheme = localStorage.getItem('_theme')
  const initialThemeToUse = savedTheme || props.initialTheme
  applyTheme(initialThemeToUse)
})
</script>

<style>
/* (Global styles from previous step remain unchanged) */
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
