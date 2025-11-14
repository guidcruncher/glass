import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Provides a reactive ref for the current theme state by observing the 'dark'
 * class on the document's root element.
 * @returns {{ isDark: Ref<boolean> }}
 */
export function useTheme() {
  const isDark = ref(document.documentElement.classList.contains('dark'))
  let observer = null

  const updateTheme = (mutationsList) => {
    // Check if the 'class' attribute was mutated
    if (mutationsList.some((mutation) => mutation.attributeName === 'class')) {
      isDark.value = document.documentElement.classList.contains('dark')
    }
  }

  onMounted(() => {
    // MutationObserver monitors changes to the <html> element's attributes
    observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true })

    // Initial check in case the component mounts after the class is set
    isDark.value = document.documentElement.classList.contains('dark')
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isDark,
  }
}
