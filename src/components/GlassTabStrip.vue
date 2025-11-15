<template>
  <div class="tab-strip-container">
    <nav class="tab-nav">
      <button
        v-for="tab in normalizedTabs"
        :key="tab.key"
        @click="selectTab(tab.key)"
        class="tab-button"
        :class="{ 'selected-tab': tab.key === modelValue }"
        role="tab"
        :aria-selected="tab.key === modelValue"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const props = defineProps({
  /** The currently selected tab key (v-model). */
  modelValue: {
    type: [String, Number],
    required: true,
  },
  /** Array of tabs. Can be an array of strings or objects. */
  tabs: {
    type: Array,
    required: true,
  },
  /** The field name to use for the unique identifier if 'tabs' are objects. */
  keyField: {
    type: String,
    default: 'key',
  },
  /** The field name to use for the display label if 'tabs' are objects. */
  labelField: {
    type: String,
    default: 'label',
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

/**
 * Normalizes the tabs array to [{ key: key, label: label }, ...] format.
 */
const normalizedTabs = computed(() => {
  return props.tabs.map((tab) => {
    if (typeof tab === 'string') {
      return { key: tab, label: tab }
    }
    return {
      key: tab[props.keyField],
      label: tab[props.labelField],
    }
  })
})

/**
 * Handles tab selection, updating the model value and emitting a custom event.
 */
const selectTab = (key) => {
  if (key !== props.modelValue) {
    emit('update:modelValue', key)
    emit('select', key)
  }
}
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */

/* Light Theme (Default) */
:root:not(.dark) {
  --container-bg: rgba(255, 255, 255, 0.65); /* bg-white/65 */
  --container-border: rgba(0, 0, 0, 0.15); /* border-black/15 */
  --container-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */

  --selected-bg: rgba(0, 0, 0, 0.05); /* bg-black/5 */
  --selected-text: #1f2937; /* text-gray-900 */
  --unselected-text: #4b5563; /* text-gray-700 */

  --hover-bg: rgba(255, 255, 255, 0.9); /* hover:bg-white/90 */
  --hover-text: #1f2937; /* hover:text-gray-900 */
}

/* Dark Theme */
.dark {
  --container-bg: rgba(30, 30, 30, 0.4); /* bg-[rgba(30,30,30,0.4)] */
  --container-border: rgba(255, 255, 255, 0.15); /* border-white/15 */
  --container-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); /* shadow-xl */

  --selected-bg: rgba(255, 255, 255, 0.1); /* bg-white/10 */
  --selected-text: white;
  --unselected-text: rgba(255, 255, 255, 0.7); /* text-white/70 */

  --hover-bg: rgba(255, 255, 255, 0.05); /* hover:bg-white/5 */
  --hover-text: rgba(255, 255, 255, 0.9); /* hover:text-white/90 */
}

/* ===================================================================
   CONTAINER AND NAV
   =================================================================== */
.tab-strip-container {
  position: relative;
  overflow-x: auto;
  font-size: 0.875rem; /* text-sm */

  /* Glassmorphism */
  background-color: var(--container-bg);
  border-bottom: 1px solid var(--container-border);
  box-shadow: var(--container-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  /* Ensure no text wrapping */
  white-space: nowrap;
}
@media (min-width: 640px) {
  .tab-strip-container {
    font-size: 1rem; /* sm:text-base */
  }
}

.tab-nav {
  display: flex;
  gap: 0.25rem; /* space-x-1 */
  padding: 0.5rem 1rem; /* px-4 py-2 */
}
@media (min-width: 640px) {
  .tab-nav {
    gap: 0.75rem; /* sm:space-x-3 */
  }
}

/* ===================================================================
   BUTTON STYLES
   =================================================================== */
.tab-button {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 500; /* font-medium */
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: var(--unselected-text);
}

.tab-button:hover {
  background-color: var(--hover-bg);
  color: var(--hover-text);
}

.tab-button:active {
  transform: scale(0.95); /* active:scale-95 */
}

/* Selected Tab State */
.selected-tab {
  background-color: var(--selected-bg);
  color: var(--selected-text);
  /* Selected tab border logic: blue border-b-2 */
  border-bottom: 2px solid #007aff;
  padding-bottom: calc(0.5rem - 2px); /* Adjust padding to keep height consistent */
}

.selected-tab:hover {
  background-color: var(--selected-bg);
  color: var(--selected-text);
}
</style>
