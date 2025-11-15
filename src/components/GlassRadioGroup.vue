<template>
  <div class="radio-group">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// 1. Props & Emits for v-model
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// 2. Computed property for easy update
const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  },
})

// 3. Provide context to child radio items
provide('radioGroup', {
  name: props.name,
  selectedValue,
  groupDisabled: computed(() => props.disabled),
  theme: computed(() => (isDark.value ? 'dark' : 'light')),
  updateValue: (value) => {
    selectedValue.value = value
  },
})
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 1.5rem; /* Space out the radio buttons */
  padding: 1rem;
  border-radius: 12px;
}
</style>
