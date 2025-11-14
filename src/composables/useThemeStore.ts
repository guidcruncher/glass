// src/stores/useThemeStore.js (or '../consumables/useThemeStore.js')

import { defineStore } from 'pinia'

// --- CONSTANTS for LocalStorage Keys ---
const THEME_KEY = 'glassapp_theme'
const SIDEBAR_LEFT_KEY = 'glassapp_sidebar_left_open'
const SIDEBAR_RIGHT_KEY = 'glassapp_sidebar_right_open'

// --- HELPER FUNCTION to Safely Get State from LocalStorage ---
const getInitialState = (key, defaultValue) => {
  if (typeof localStorage !== 'undefined') {
    const storedValue = localStorage.getItem(key)
    if (storedValue !== null) {
      // Convert stored strings "true" or "false" to boolean for sidebar states
      if (key === THEME_KEY) {
        return storedValue
      }
      return storedValue === 'true'
    }
  }
  return defaultValue
}

export const useThemeStore = defineStore('themeStore', {
  state: () => ({
    // Initialize state from localStorage, defaulting to 'dark' and 'true' (open)
    theme: getInitialState(THEME_KEY, 'dark'),
    isLeftSidebarOpen: getInitialState(SIDEBAR_LEFT_KEY, true),
    isRightSidebarOpen: getInitialState(SIDEBAR_RIGHT_KEY, true),
  }),

  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      // Persist the change to LocalStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_KEY, newTheme)
      }
    },

    toggleLeftSidebar() {
      this.isLeftSidebarOpen = !this.isLeftSidebarOpen
      // Persist the change to LocalStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SIDEBAR_LEFT_KEY, this.isLeftSidebarOpen ? 'true' : 'false')
      }
    },

    toggleRightSidebar() {
      this.isRightSidebarOpen = !this.isRightSidebarOpen
      // Persist the change to LocalStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SIDEBAR_RIGHT_KEY, this.isRightSidebarOpen ? 'true' : 'false')
      }
    },

    // Optional: Action to be called when the theme is toggled by a user action
    // Note: The AppLayout component relies on directly modifying the state properties
    // for sidebars (via storeToRefs) to trigger its computed width.
    // If you prefer to use actions for sidebars globally, you'd use these actions:
    // toggleLeft: this.toggleLeftSidebar,
    // toggleRight: this.toggleRightSidebar,
  },
})
