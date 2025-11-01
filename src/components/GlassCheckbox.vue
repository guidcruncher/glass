<template>
  <label :for="id" :class="labelClasses">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="glass-checkbox__native"
    />

    <span :class="checkboxClasses">
      <i class="fas fa-check glass-checkbox__checkmark"></i>
    </span>

    <span class="glass-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

// Define Props using TypeScript interface
interface Props {
  modelValue: boolean // For v-model support
  label?: string
  disabled?: boolean
}

// Use withDefaults for runtime defaults
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
})

// Define Emits using TypeScript syntax
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const id = computed(() => {
  // Note: useUniqueId is assumed to be a working composable
  // Use a function call directly inside computed, as composables usually return a ref/value
  // Assuming useUniqueId returns a unique ID string.
  return `glass-checkbox-${useUniqueId()}`
})

const labelClasses = computed(() => [
  'glass-checkbox-wrapper',
  { 'glass-checkbox-wrapper--disabled': props.disabled },
])

const checkboxClasses = computed(() => [
  'glass-checkbox',
  { 'glass-checkbox--checked': props.modelValue },
])
</script>

<style lang="scss">
@use '../scss/components/GlassCheckbox.scss';
</style>
