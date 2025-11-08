<template>
  <div
    class="glass-timepicker-wrapper"
    :class="{ 'is-disabled': disabled, 'dark-mode': isDark }"
    v-click-outside="closeDropdown"
  >
    <input
      type="text"
      :value="displayTime"
      @click="toggleDropdown"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      class="glass-input time-display"
    />

    <i
      :class="['fas fa-clock time-icon', { 'is-open': isDropdownOpen }]"
      @click.stop="toggleDropdown"
      aria-hidden="true"
    ></i>

    <div v-if="isDropdownOpen" class="time-dropdown glass-content-panel">
      <div class="time-scroll-area">
        <div class="time-scroller hour-scroller">
          <div
            v-for="h in hourOptions"
            :key="'h' + h.value"
            :class="['time-option', { 'is-selected': h.value === hours }]"
            @click="setHours(h.value)"
          >
            {{ h.display }}
          </div>
        </div>

        <div class="separator">:</div>

        <div class="time-scroller minute-scroller">
          <div
            v-for="m in minuteOptions"
            :key="'m' + m.value"
            :class="['time-option', { 'is-selected': m.value === minutes }]"
            @click="setMinutes(m.value)"
          >
            {{ m.display }}
          </div>
        </div>

        <div class="ampm-scroller" v-if="!is24Hour">
          <div :class="['time-option', { 'is-selected': ampm === 'AM' }]" @click="setAmpm('AM')">
            AM
          </div>
          <div :class="['time-option', { 'is-selected': ampm === 'PM' }]" @click="setAmpm('PM')">
            PM
          </div>
        </div>
      </div>

      <div class="timepicker-footer">
        <GlassButton @click="closeDropdown" class="done-btn">Done</GlassButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import GlassButton from './GlassButton.vue'

interface Props {
  modelValue: string // HH:MM or HH:MM AM/PM
  is24Hour?: boolean
  placeholder?: string
  disabled?: boolean
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  is24Hour: false,
  placeholder: 'Select Time',
  disabled: false,
  isDark: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

// --- Internal State Refs ---
const hours = ref(0)
const minutes = ref(0)
const ampm = ref<'AM' | 'PM'>('AM')
const isDropdownOpen = ref(false)

const parseTime = (timeStr: string) => {
  const parts = timeStr.trim().split(/\s+/)
  const time = parts[0]
  const ampmPart = parts[1] ? parts[1].toUpperCase() : ''
  const [hStr, mStr] = time.split(':')
  let h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)

  if (isNaN(h) || isNaN(m)) return { h: 0, m: 0 }

  // Adjust 12-hour format
  if (ampmPart === 'PM' && h < 12) h += 12
  if (ampmPart === 'AM' && h === 12) h = 0 // Midnight case

  return { h, m }
}

const updateInternalTime = (timeStr: string) => {
  const { h, m } = parseTime(timeStr)
  hours.value = h % 24 // Ensure hours are 0-23
  minutes.value = m % 60 // Ensure minutes are 0-59
  ampm.value = hours.value >= 12 ? 'PM' : 'AM'
}

// Initialize internal time from modelValue
updateInternalTime(props.modelValue)

// --- Computed Properties ---

const displayTime = computed(() => {
  let h = hours.value
  let m = minutes.value

  if (props.is24Hour) {
    return `${pad(h)}:${pad(m)}`
  } else {
    const h12 = h % 12 || 12 // 0 becomes 12 (midnight), 12 remains 12 (noon)
    return `${pad(h12)}:${pad(m)} ${ampm.value}`
  }
})

const hourOptions = computed(() => {
  const maxHour = props.is24Hour ? 23 : 12
  const minHour = props.is24Hour ? 0 : 1
  const options = []
  for (let h = minHour; h <= maxHour; h++) {
    let h24 = h
    let display = pad(h)

    if (!props.is24Hour) {
      h24 = h % 12
      if (h === 12) h24 = 12 // Noon/Midnight case
      if (ampm.value === 'AM' && h === 12) h24 = 0 // Midnight (12 AM)
      if (ampm.value === 'PM' && h < 12) h24 = h + 12

      display = pad(h % 12 || 12)
    }

    options.push({ value: props.is24Hour ? h : h24, display: display })
  }
  // Need to generate 0-23 (24h) or 1-12 (12h) based on context
  const hourList = []
  const hStart = props.is24Hour ? 0 : 1
  const hEnd = props.is24Hour ? 23 : 12

  for (let i = hStart; i <= hEnd; i++) {
    hourList.push({
      value: props.is24Hour
        ? i
        : i === 12 && ampm.value === 'AM'
          ? 0
          : i === 12 && ampm.value === 'PM'
            ? 12
            : ampm.value === 'PM'
              ? i + 12
              : i,
      display: pad(i % 12 || 12),
    })
  }
  return hourList
})

const minuteOptions = computed(() => {
  const options = []
  for (let i = 0; i < 60; i++) {
    options.push({ value: i, display: pad(i) })
  }
  return options
})

// --- Methods ---

const setTime = () => {
  // Generate the time string based on internal state
  let timeString: string
  let h = hours.value
  let m = minutes.value

  if (props.is24Hour) {
    timeString = `${pad(h)}:${pad(m)}`
  } else {
    const h12 = h % 12 || 12
    const finalAmpm = h >= 12 ? 'PM' : 'AM'
    timeString = `${pad(h12)}:${pad(m)} ${finalAmpm}`
  }

  emit('update:modelValue', timeString)
}

const setHours = (h: number) => {
  hours.value = h
  setTime()
  // Scroll to the selected hour (requires DOM access via nextTick)
}

const setMinutes = (m: number) => {
  minutes.value = m
  setTime()
  // Scroll to the selected minute
}

const setAmpm = (newAmpm: 'AM' | 'PM') => {
  // Adjust hours if PM changes to AM or vice versa
  if (newAmpm !== ampm.value) {
    if (newAmpm === 'AM' && hours.value >= 12) {
      hours.value -= 12 // E.g., 12 PM (h=12) -> 12 AM (h=0)
    } else if (newAmpm === 'PM' && hours.value < 12) {
      hours.value += 12 // E.g., 1 AM (h=1) -> 1 PM (h=13)
    }
  }
  ampm.value = newAmpm
  setTime()
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value
    if (isDropdownOpen.value) {
      // Scroll to the current time options when opening
      nextTick(() => {
        const hourEl = document.querySelector('.hour-scroller .is-selected') as HTMLElement
        const minuteEl = document.querySelector('.minute-scroller .is-selected') as HTMLElement
        hourEl?.scrollIntoView({ block: 'nearest' })
        minuteEl?.scrollIntoView({ block: 'nearest' })
      })
    }
  }
}

// Sync internal state when modelValue prop changes
watch(
  () => props.modelValue,
  (newVal) => {
    // Only update if the modelValue changes to something that doesn't match the current internal time.
    if (newVal !== displayTime.value) {
      updateInternalTime(newVal)
    }
  },
  { immediate: true },
)
</script>
