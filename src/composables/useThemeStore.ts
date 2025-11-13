import { ref, watch } from 'vue'

export function useThemeStore(defaultValue = null) {
  const storedValue = localStorage.getItem('_theme')
  const value = ref(storedValue !== null ? storedValue : defaultValue)

  watch(value, (val) => {
    if (val === '' || val === null) {
      localStorage.removeItem('_theme')
    } else {
      localStorage.setItem('_theme', val)
    }
  })

  return value
}
