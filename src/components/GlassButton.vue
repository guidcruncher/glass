<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
    <i v-if="icon" :class="['glass-button__icon', icon]"></i>

    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  label?: string
  type?: 'button' | 'submit' | 'reset'
  icon?: string | null
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  // Added a boolean prop for icon-only styling if needed, though often handled by slots.
  // The original component had 'icon-only' in the app-bar but not in the props.
  // I will rely on the computed property for 'icon-only' detection based on slots/label.
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'button',
  icon: null,
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const slots = useSlots()

const buttonClasses = computed(() => {
  // Check for content via slot or label prop
  const hasContent = !!slots.default || props.label
  return [
    'glass-button',
    `glass-button--${props.size}`,
    {
      'glass-button--disabled': props.disabled,
      // If an icon exists AND there is no text content (slot or label)
      'glass-button--icon-only': props.icon && !hasContent,
    },
  ]
})
</script>
