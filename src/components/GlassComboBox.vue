<template>
  <div class="glass-select-wrapper" v-click-outside="closeDropdown">
    <label :for="id" v-if="label" class="glass-select__label">{{ label }}</label>

    <div
      :class="selectClasses"
      :tabindex="disabled ? -1 : 0"
      @focusin="openDropdown"
      @click="toggleDropdown"
    >
      <input
        :id="id"
        type="text"
        v-model="searchText"
        :placeholder="selectedLabel || placeholder"
        :disabled="disabled"
        @keydown.enter.prevent="handleEnter"
        @keydown.down.prevent="navigateOptions(1)"
        @keydown.up.prevent="navigateOptions(-1)"
        @blur="handleBlur"
        @click.stop
        class="glass-combobox__input"
      />

      <i :class="caretClasses" @click.stop="toggleDropdown"></i>
    </div>

    <Transition name="fade-slide">
      <div v-if="isOpen && !disabled && filteredOptions.length > 0" :class="dropdownClasses">
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :class="[
            'glass-select__option',
            {
              'glass-select__option--active': option.value === modelValue,
              'glass-select__option--focused': index === focusedIndex,
            },
          ]"
          @mousedown.prevent="selectOption(option.value)"
          @mouseover="focusedIndex = index"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  options: Option[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: 'Select an option...',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void // modelValue can be null
  (e: 'change', value: string | number | null): void // change can be null
}>()

const id = computed(() => `glass-combobox-${useUniqueId()}`)
const isOpen = ref(false)
const searchText = ref('')
const focusedIndex = ref(-1)

const selectedOption = computed(() => props.options.find((opt) => opt.value === props.modelValue))

const selectedLabel = computed(() => (selectedOption.value ? selectedOption.value.label : ''))

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options
  const lowerSearch = searchText.value.toLowerCase()
  return props.options.filter((option) => option.label.toLowerCase().includes(lowerSearch))
})

const selectClasses = computed(() => [
  'glass-select',
  {
    'glass-select--disabled': props.disabled,
    'glass-select--placeholder': !selectedOption.value && !searchText.value,
    'glass-select--open': isOpen.value,
  },
])

const caretClasses = computed(() => [
  'fas',
  'glass-select__caret',
  isOpen.value ? 'fa-chevron-up' : 'fa-chevron-down',
])

const dropdownClasses = computed(() => ['glass-select__dropdown', 'glass-combobox__dropdown'])

const openDropdown = () => {
  if (!props.disabled) {
    isOpen.value = true
  }
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const closeDropdown = () => {
  isOpen.value = false
  focusedIndex.value = -1
  // If the user types and closes without selecting, reset the text to the current value
  if (selectedOption.value) {
    searchText.value = selectedOption.value.label
  } else {
    searchText.value = ''
    // Also clear modelValue if the search text doesn't match a valid option
    if (searchText.value !== '') {
      emit('update:modelValue', null)
      emit('change', null)
    }
  }
}

const handleBlur = () => {
  // A small delay to check if the focus moved to an element inside the dropdown
  setTimeout(() => {
    if (!document.activeElement?.closest('.glass-select__dropdown')) {
      closeDropdown()
    }
  }, 100)
}

const selectOption = (value: string | number) => {
  if (!props.disabled) {
    const selected = props.options.find((opt) => opt.value === value)
    if (selected) {
      searchText.value = selected.label
      emit('update:modelValue', value)
      emit('change', value)
    }
    closeDropdown()
  }
}

const handleEnter = () => {
  if (!isOpen.value) {
    openDropdown()
    return
  }

  if (focusedIndex.value > -1) {
    selectOption(filteredOptions.value[focusedIndex.value].value)
  } else if (filteredOptions.value.length === 1) {
    selectOption(filteredOptions.value[0].value)
  } else {
    closeDropdown()
  }
}

const navigateOptions = (direction: 1 | -1) => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }

  const count = filteredOptions.value.length
  if (count === 0) return

  let nextIndex = focusedIndex.value + direction

  if (nextIndex >= count) {
    nextIndex = 0
  } else if (nextIndex < 0) {
    nextIndex = count - 1
  }

  focusedIndex.value = nextIndex

  // Scroll to focused element
  nextTick(() => {
    const dropdownEl = document.querySelector('.glass-combobox__dropdown')
    const focusedEl = dropdownEl?.querySelector(
      '.glass-select__option--focused',
    ) as HTMLElement | null
    if (focusedEl && dropdownEl) {
      // Simple scroll into view
      focusedEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Sync internal search text when modelValue changes from outside
watch(
  selectedLabel,
  (newLabel) => {
    // Only update search text if it differs from the new label AND the dropdown is closed
    if (newLabel !== searchText.value && !isOpen.value) {
      searchText.value = newLabel
    }
  },
  { immediate: true },
)

// Reset focused index when filtering changes
watch(filteredOptions, () => {
  focusedIndex.value = -1
})
</script>
