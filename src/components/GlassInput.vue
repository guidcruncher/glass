<template>
  <div class="glass-input-wrapper" :style="{ width, height }">
    <label v-if="label" :for="id">{{ label }}</label>

    <textarea
      v-if="multiline"
      :id="id"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="glass-textarea"
    ></textarea>

    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="glass-input"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'color'

interface Props {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  type?: InputType
  multiline?: boolean
  rows?: number | string
  disabled?: boolean
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: '',
  type: 'text',
  multiline: false,
  rows: 4,
  disabled: false,
  width: '100%',
  height: 'auto',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const id = computed(() => `glass-input-${useUniqueId()}`)
</script>
