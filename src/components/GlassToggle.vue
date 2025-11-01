<template>
  <div
    :class="toggleClasses"
    @click="toggle"
    role="switch"
    :aria-checked="modelValue.toString()"
    :aria-disabled="disabled.toString()"
  >
    <input
      type="checkbox"
      :id="id"
      :checked="modelValue"
      :disabled="disabled"
      class="glass-toggle__native"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

interface Props {
  modelValue: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const id = `glass-toggle-${useUniqueId()}`

const toggleClasses = computed(() => {
  return [
    'glass-toggle',
    `glass-toggle--${props.size}`,
    { 'glass-toggle--checked': props.modelValue },
    { 'glass-toggle--disabled': props.disabled },
  ]
})

const toggle = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>
