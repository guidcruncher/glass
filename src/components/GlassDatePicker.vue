<template>
  <div
    class="glass-datepicker-wrapper"
    :class="{ 'is-disabled': disabled }"
    v-click-outside="closeDropdown"
  >
    <input
      type="text"
      :value="formattedDate"
      @click="toggleDropdown"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      class="glass-input date-display"
    />

    <i
      :class="['fas fa-calendar-alt date-icon', { 'is-open': isDropdownOpen }]"
      @click.stop="toggleDropdown"
      aria-hidden="true"
    ></i>

    <div v-if="isDropdownOpen" class="date-dropdown glass-content-panel">
      <GlassCalendar :modelValue="internalDate" @update:modelValue="selectDate" />

      <div class="datepicker-footer">
        <GlassButton @click="closeDropdown" size="sm">Done</GlassButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GlassButton from './GlassButton.vue'
import GlassCalendar from './GlassCalendar.vue'

interface Props {
  modelValue?: string | null // Expected format: YYYY-MM-DD
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select Date',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', date: string | null): void
}>()

const isDropdownOpen = ref(false)
const internalDate = ref(props.modelValue)

const formattedDate = computed(() => {
  if (!internalDate.value) return ''
  try {
    const dateObj = new Date(internalDate.value + 'T00:00:00') // Append T00:00:00 to avoid timezone issues with YYYY-MM-DD
    if (isNaN(dateObj.getTime())) return internalDate.value

    // Use the user's local timezone for display formatting
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      weekday: 'short',
    }).format(dateObj)
  } catch (e) {
    console.error('Date formatting failed:', e)
    return internalDate.value
  }
})

const selectDate = (date: string) => {
  internalDate.value = date
  emit('update:modelValue', date)
  // You might choose to close the dropdown immediately here, or keep it open until 'Done' is clicked.
  // Keeping it open until 'Done' is more user-friendly for calendar selection.
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value
  }
}

// Sync internalDate when modelValue prop changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalDate.value) {
      internalDate.value = newVal
    }
  },
)
</script>
