<template>
  <div class="glass-select-wrapper" v-click-outside="closeDropdown">
    <label :for="id" v-if="label" class="glass-select__label">{{ label }}</label>

    <div :class="selectClasses" @click="toggleDropdown" :tabindex="disabled ? -1 : 0">
      <span class="glass-select__selected-value">
        {{ selectedLabel || placeholder }}
      </span>

      <i :class="caretClasses"></i>
    </div>

    <Transition name="fade-slide">
      <div v-if="isOpen && !disabled && options.length > 0" :class="dropdownClasses">
        <div
          v-for="option in options"
          :key="option.value"
          :class="[
            'glass-select__option',
            {
              'glass-select__option--active': option.value === modelValue,
            },
          ]"
          @click.stop="selectOption(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

interface Option {
  label: string
  value: any
}

interface Props {
  modelValue: string | number | object | null
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Select an option...',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const id = computed(() => `glass-select-${useUniqueId()}`)

const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : ''
})

const selectClasses = computed(() => {
  return [
    'glass-select',
    { 'glass-select--open': isOpen.value },
    { 'glass-select--disabled': props.disabled },
    { 'glass-select--placeholder': !selectedLabel.value },
  ]
})

const dropdownClasses = ['glass-select__dropdown']

const caretClasses = computed(() => {
  return [
    'fas',
    'fa-chevron-down',
    'glass-select__caret',
    { 'glass-select__caret--open': isOpen.value },
  ]
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (value: any) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
    emit('change', value)
    closeDropdown()
  }
}
</script>
