<template>
  <div class="time-picker-card">
    <div class="flex space-x-2 items-center">
      <!-- Hour Picker -->
      <GlassDropdownContainer
        style="float: left"
        v-model="hourDisplay"
        :list-width="'70px'"
        :options="hours"
        :max-button-width="'70px'"
        class="flex-1"
      />
      <span class="text-2xl font-light opacity-80" style="float: left; margin-top: 10px">:</span>
      <!-- Minute Picker -->
      <GlassDropdownContainer
        style="float: left"
        v-model="minuteDisplay"
        :list-width="'70px'"
        :options="minutes"
        :max-button-width="'70px'"
        class="flex-1"
      />
      <!-- Period (AM/PM) Picker -->
      <GlassDropdownContainer
        :list-width="'70px'"
        style="float: left"
        v-model="period"
        :max-button-width="'70px'"
        :options="periods"
        class="flex-none w-20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GlassDropdownContainer from './GlassDropdownContainer.vue' // Import the base component

// Define Props and Emits
const props = defineProps<{
  modelValue: string // Expected format: "HH:MM A" (e.g., "03:45 PM")
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// --- TIME OPTIONS GENERATION ---

// Hours: "01" to "12"
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))

// Minutes: "00" to "55" in 5-minute increments
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

// Periods: AM/PM
const periods = ['AM', 'PM']

// --- INTERNAL STATE ---

// Function to parse the modelValue into internal components
const parseTime = (timeString: string) => {
  // Default to 12:00 PM if parsing fails
  if (!timeString || !timeString.match(/^\d{2}:\d{2} (AM|PM)$/)) {
    return { h: '12', m: '00', p: 'PM' }
  }
  const [time, period] = timeString.split(' ')
  const [hour, minute] = time.split(':')
  return { h: hour, m: minute, p: period }
}

const initialTime = parseTime(props.modelValue)

const hourDisplay = ref(initialTime.h)
const minuteDisplay = ref(initialTime.m)
const period = ref(initialTime.p)

// --- COMPUTED / WATCHER FOR MODEL SYNC ---

// Watch internal state and emit combined time string
watch([hourDisplay, minuteDisplay, period], ([newH, newM, newP]) => {
  const newTime = `${newH}:${newM} ${newP}`
  emit('update:modelValue', newTime)
})

// Watch external modelValue and update internal state
watch(
  () => props.modelValue,
  (newVal) => {
    const { h, m, p } = parseTime(newVal)
    // Only update if external value is different to prevent loop
    if (h !== hourDisplay.value) hourDisplay.value = h
    if (m !== minuteDisplay.value) minuteDisplay.value = m
    if (p !== period.value) period.value = p
  },
  { immediate: true },
)
</script>

<style scoped>
/*
 * Minimal styling for the Time Picker card wrapper. 
 * Relies on the GlassDropdownContainer for the actual glassmorphism effects.
 */
.time-picker-card {
  /* Using standard Tailwind/CSS variable practices for a glass container */
  background-color: var(--glass-bg-base, rgba(30, 30, 30, 0.4));
  backdrop-filter: blur(var(--glass-blur, 14px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 14px));
  border: 1px solid var(--glass-border-color, rgba(255, 255, 255, 0.15));
  box-shadow: var(--glass-shadow, 0 10px 30px rgba(0, 0, 0, 0.4));
  border-radius: 1rem;
  color: var(--text-color-base, #f9fafb);
}

/* Specific styling to ensure colon is centered */
.time-picker-card > .flex > span {
  display: block;
  padding: 0 0.25rem;
}
</style>
