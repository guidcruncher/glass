<template>
  <GlassButton
    class="theme-chooser-btn"
    :class="{ 'dark-mode-active': isDark }"
    @click="toggleTheme"
    icon-only
    size="sm"
    :aria-pressed="isDark.toString()"
  >
    <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
  </GlassButton>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const isDark = ref(false)

const setTheme = (theme) => {
  const isDarkTheme = theme === 'dark'
  isDark.value = isDarkTheme
  const root = document.documentElement

  // Set root class
  if (isDarkTheme) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // NOTE: External elements relying on theme should now use CSS variables
  // defined on :root/.dark instead of class replacement logic.
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.style.setProperty(
      '--overlay-color',
      isDarkTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)',
    )
  }

  localStorage.setItem('_theme', theme)
}

const toggleTheme = (event) => {
  const newTheme = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('_theme')
  if (savedTheme) {
    setTheme(savedTheme)
  } else if (prefersDark.matches) {
    setTheme('dark')
  } else {
    setTheme('light')
  }
})
</script>

<style scoped lang="scss">
/* ===================================================================
   THEME VARIABLES
   =================================================================== */

/* Dark Mode (Default) */
:root {
  --slider-bg: rgba(255, 255, 255, 0.2); /* bg-white/20 */
  --slider-border: rgba(255, 255, 255, 0.3); /* border-white/30 */
  --thumb-bg: white;
  --thumb-left: 3px;
  --thumb-transform: 20px;
}

/* Light Mode (Override on parent .dark class) */
.dark {
  --slider-bg: rgba(0, 0, 0, 0.1);
  --slider-border: rgba(0, 0, 0, 0.15);
  --thumb-bg: #1f2937; /* Gray-900 */
}
</style>
