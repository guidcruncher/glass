<template>
  <GlassButton
    class="theme-chooser-btn"
    :class="{ 'dark-mode-active': isDark }"
    @click="toggleTheme"
    icon-only
    size="sm"
    v-bind="attrs"
    :aria-pressed="isDark.toString()"
  >
    <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
  </GlassButton>
</template>

<script lang="ts" setup>
import { onMounted, ref, useAttrs, watch } from 'vue'
import GlassButton from './GlassButton.vue'

const THEME_STORAGE_KEY = 'glassAppTheme'

interface Props {
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false,
})

const emit = defineEmits<{
  (e: 'update:isDark', value: boolean): void
}>()

const attrs = useAttrs()
const isDark = ref(props.isDark)

const applyTheme = (isDarkState: boolean) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('dark-mode', isDarkState)
  }
  emit('update:isDark', isDarkState)
}

const loadTheme = () => {
  if (typeof window === 'undefined') return

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  let themeState: boolean = false

  if (storedTheme === 'dark') {
    themeState = true
  } else if (storedTheme === 'light') {
    themeState = false
  } else {
    // Default to system preference
    themeState = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  isDark.value = themeState
  applyTheme(themeState)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const newState = isDark.value

  applyTheme(newState)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, newState ? 'dark' : 'light')
  }
}

onMounted(() => {
  loadTheme()
})

// Watch the prop to allow external control via v-model:isDark
watch(
  () => props.isDark,
  (newVal) => {
    if (newVal !== isDark.value) {
      isDark.value = newVal
      applyTheme(newVal)
    }
  },
)
</script>
