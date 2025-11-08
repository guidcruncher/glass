<template>
  <div class="glass-input-wrapper">
    <label :for="id" v-if="label">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="glass-input"
    ></textarea>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// Assuming useUniqueId is a standard composable that generates a unique string
import { useUniqueId } from '../composables/useUniqueId'

// Define the component name (optional in <script setup>, but good practice)
defineOptions({
  name: 'GlassTextarea',
})

// 1. Props Definition
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: { type: String, default: 'Enter text...' },
  disabled: { type: Boolean, default: false },
  rows: { type: [String, Number], default: 4 }, // Standard HTML rows attribute
})

// 2. Emits Definition
const emit = defineEmits(['update:modelValue'])

// 3. Unique ID Generation (Composition API style)
// Generate a unique ID part once on setup
const uniqueIdPart = useUniqueId()

// Compute the final ID string for the 'for' and 'id' attributes
const id = computed(() => `glass-textarea-${uniqueIdPart}`)
</script>
