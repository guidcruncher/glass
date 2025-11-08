<template>
  <label :for="id" :class="wrapperClasses">
    <input
      :id="id"
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
      class="glass-radio__native"
    />

    <span class="glass-radio">
      <span class="glass-radio__dot"></span>
    </span>

    <span class="glass-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Utility for a unique ID (replace with your actual useUniqueId composable if available)
const useUniqueId = (): number => Math.floor(Math.random() * 100000)

// 1. Define Props with TypeScript Interface
interface Props {
  /** The currently selected value for the entire radio group (v-model) */
  modelValue: string | number | boolean | null | undefined
  /** The unique value of this specific radio button */
  value: string | number | boolean
  /** The name attribute for the radio group (important for grouping) */
  name: string
  /** Optional label text */
  label?: string
  /** Whether the radio button is disabled */
  disabled?: boolean
  /** Prop to support dark mode styling (isDark theme prop) */
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: '',
  disabled: false,
  isDark: false,
})

// 2. Define Emits
const emit = defineEmits<{
  /** Fires to update v-model */
  (e: 'update:modelValue', value: Props['value']): void
  /** Fires on change event */
  (e: 'change', value: Props['value']): void
}>()

// 3. Composition API Logic
const id = `glass-radio-${useUniqueId()}`

// Determine if this specific radio is the one currently selected
const isChecked = computed(() => props.modelValue === props.value)

// Dynamic classes for the wrapper
const wrapperClasses = computed(() => [
  'glass-radio-wrapper',
  { 'dark-mode': props.isDark },
  { 'glass-radio-wrapper--disabled': props.disabled },
  { 'glass-radio-wrapper--checked': isChecked.value },
])

// 4. Event Handler
const handleChange = () => {
  if (props.disabled) return

  // Update v-model: Emit this component's value to the parent
  emit('update:modelValue', props.value)

  // Emit the explicit 'change' event
  emit('change', props.value)
}
</script>
