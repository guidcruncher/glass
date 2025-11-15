<template>
  <GlassDropdownContainer class="glass-date-picker" :max-button-width="'400px'">
    <template #selected>
      <span v-if="formattedDate" class="selected-date-text">
        {{ formattedDate }}
      </span>
      <span v-else class="placeholder-text"> Select a date... </span>
    </template>

    <template #dropdown="{ close: closeDropdown }">
      <div class="calendar-wrapper">
        <Calendar
          :show-borders="false"
          :modelValue="dateValue"
          @update:modelValue="handleDateSelect($event, closeDropdown)"
          @date-selected="handleDateSelect($event, closeDropdown)"
        />
      </div>
    </template>
  </GlassDropdownContainer>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
// Assuming GlassDropdownContainer is imported from its file path
import GlassDropdownContainer from './GlassDropdownContainer.vue'

// --- Placeholder for GlassCalendar (replace with actual component) ---
// For a real app, this should be the actual calendar component
const GlassCalendar = defineAsyncComponent(() =>
  import('./GlassCalendar.vue').catch(() => ({
    template: `
        <div class="glass-calendar-placeholder p-4 text-center text-sm">
            <p>GlassCalendar Placeholder</p>
            <button @click="$emit('date-selected', new Date().toISOString().split('T')[0])" 
                    class="mt-2 p-2 bg-blue-500 text-white rounded">
                Select Today
            </button>
        </div>
    `,
    emits: ['update:modelValue', 'date-selected'],
  })),
)

// --- PROPS and EMITS (v-model for selected date) ---
const props = defineProps({
  // modelValue can be a Date object, ISO string, or null
  modelValue: {
    type: [Date, String, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

// Use the computed property for V-model
const dateValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// --- DATE LOGIC ---

/**
 * Formats the modelValue for display in the button.
 * Uses a default locale date string.
 */
const formattedDate = computed(() => {
  if (!dateValue.value) return null

  let dateObj
  if (dateValue.value instanceof Date) {
    dateObj = dateValue.value
  } else if (typeof dateValue.value === 'string') {
    // Attempt to parse ISO string or similar
    dateObj = new Date(dateValue.value)
  }

  if (dateObj && !isNaN(dateObj)) {
    // Example format: "Thu, Nov 13, 2025"
    return dateObj.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  return null
})

/**
 * Handles the selection of a date from the calendar.
 * @param {Date | String} date - The newly selected date.
 * @param {Function} closeDropdown - Function provided by GlassDropdownContainer slot.
 */
const handleDateSelect = (date, closeDropdown) => {
  // Update the modelValue to reflect the new selection
  dateValue.value = date

  // Close the dropdown immediately after selection
  closeDropdown()
}
</script>

<style scoped lang="scss">
/* Scoped styles specific to the Date Picker */

/* Styles for the visible selected text */
.selected-date-text {
  font-weight: 600;
  white-space: nowrap;
}

.placeholder-text {
  opacity: 0.7;
  font-style: italic;
}

/* Wrapper for the calendar to apply any necessary spacing/sizing */
.calendar-wrapper {
  /* Ensure the calendar takes up the full width provided by the container */
  width: 100%;
  padding: 0.5rem; /* Add padding inside the dropdown panel */
}

/* Optional: Placeholder for a dark theme if needed */
.glass-calendar-placeholder {
  background-color: rgba(255, 255, 255, 0.9);
  color: #111827;
  border-radius: 0.5rem;
}
</style>
