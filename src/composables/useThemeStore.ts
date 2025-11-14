import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore({
  id: 'themeeStore',
  state: () => ({
    theme: useStorage('theme', ''),
    isLeftSidebarOpen: useStorage('leftOpen', false),
    isRightSidebarOpen: useStorage('rightOpen', false),
  }),
  getters: {
    getTheme() {
      return this.theme
    },
    getIsLeftSidebarOpen() {
      return this.isLeftSidebarOpen
    },
    getIsRightSidebarOpen() {
      return this.isRightSidebarOpen
    },
  },
  actions: {
    setTheme(value) {
      this.theme = value
    },
    setIsLeftSidebarOpen(value) {
      this.isLeftSidebarOpen = value
    },
    setIsRightSidebarOpen(value) {
      this.isRightSidebarOpen = value
    },
  },
})
