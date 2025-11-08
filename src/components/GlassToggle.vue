<template>
  <div
    :class="[
      'apple-switch',
      `apple-switch--${size}`,
      {
        'is-checked': modelValue,
        'is-disabled': disabled,
      },
    ]"
    @click="toggle"
    role="switch"
    :aria-checked="modelValue.toString()"
    :aria-disabled="disabled.toString()"
  >
    <span class="apple-switch__inner">
      <span class="apple-switch__thumb"></span>
    </span>
  </div>
</template>

<script setup>
// Define Props for size and disabled state
const props = defineProps({
  // Size prop: 'sm', 'md', 'lg'. Default is 'md'.
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  // Disabled state prop
  disabled: {
    type: Boolean,
    default: false,
  },
})

/**
 * Define the model for v-model binding.
 * It expects a boolean value and is required.
 */
const modelValue = defineModel({ type: Boolean, required: true })

/**
 * Toggles the switch state only if the component is not disabled.
 */
const toggle = () => {
  if (!props.disabled) {
    modelValue.value = !modelValue.value
  }
}
</script>
