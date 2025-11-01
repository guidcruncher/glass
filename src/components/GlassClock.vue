<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Interface for component props.
 */
interface Props {
  // Clock size, e.g., 300 or '200px'.
  size?: number | string
  // Timezone string (e.g., 'America/New_York', 'GMT', 'Asia/Tokyo').
  timezone?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  // Default to the user's local timezone
  timezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
})

const time = ref(new Date())
let intervalId: number | null = null

const sizeInPx = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

/**
 * Safely extracts hours, minutes, and seconds for the given timezone.
 * Uses Intl.DateTimeFormat for accurate timezone conversion.
 */
const getTimeComponents = (date: Date, timeZone: string) => {
  // Configure formatter to get time parts in 24hr format
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: timeZone,
  })

  const parts = formatter.formatToParts(date)

  // Extract values, falling back to local time if parts are missing
  const getPartValue = (type: string, fallback: number) => {
    const part = parts.find((p) => p.type === type)
    return part ? parseInt(part.value, 10) : fallback
  }

  let hours = getPartValue('hour', date.getHours())
  const minutes = getPartValue('minute', date.getMinutes())
  const seconds = getPartValue('second', date.getSeconds())

  // Ensure 24:00 is treated as 0 for 12-hour analog conversion
  if (hours === 24) hours = 0

  return { hours, minutes, seconds }
}

/**
 * Updates the time reference every second.
 */
const updateTime = () => {
  time.value = new Date()
}

onMounted(() => {
  // Update every 1000ms for second-hand movement
  intervalId = window.setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

// --- Computed Properties for Hand Rotation ---

const timeComponents = computed(() => getTimeComponents(time.value, props.timezone))

/**
 * Calculates the rotation for the hour hand.
 * Formula: (12-hour * 30 deg/hr) + (minutes * 0.5 deg/min) + (seconds * (0.5/60) deg/sec)
 */
const hourHandRotation = computed(() => {
  const { hours, minutes, seconds } = timeComponents.value
  const h12 = hours % 12

  const minuteAdjustment = minutes * 0.5
  const secondAdjustment = seconds * (0.5 / 60)

  return h12 * 30 + minuteAdjustment + secondAdjustment
})

/**
 * Calculates the rotation for the minute hand.
 * Formula: (minutes * 6 deg/min) + (seconds * 0.1 deg/sec)
 */
const minuteHandRotation = computed(() => {
  const { minutes, seconds } = timeComponents.value
  return minutes * 6 + seconds * 0.1
})

/**
 * Calculates the rotation for the second hand.
 * Formula: seconds * 6 deg/sec
 */
const secondHandRotation = computed(() => {
  const { seconds } = timeComponents.value
  return seconds * 6
})

// --- Computed Properties for Digital Display ---

const digitalDisplay = computed(() => {
  try {
    return time.value.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: props.timezone,
    })
  } catch (e) {
    return 'Invalid Timezone'
  }
})

const timezoneDisplay = computed(() => {
  try {
    // Use short offset format (e.g., 'EST' or 'GMT-5')
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'shortOffset',
      timeZone: props.timezone,
    }).formatToParts(time.value)

    const tzPart = parts.find((p) => p.type === 'timeZoneName')
    return tzPart ? tzPart.value : props.timezone
  } catch (e) {
    return props.timezone
  }
})
</script>

<template>
  <div class="glass-analog-clock-wrapper" :style="{ width: sizeInPx, height: sizeInPx }">
    <!-- Digital overlay for time and timezone -->
    <div class="glass-face-overlay">
      <div class="timezone-label">{{ timezoneDisplay }}</div>
      <div class="digital-time">{{ digitalDisplay }}</div>
    </div>

    <svg class="analog-clock-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Clock Face Border -->
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        stroke-width="1.5"
      />

      <!-- Hour Markers (Rendered at top and rotated) -->
      <g class="markers">
        <template v-for="i in 12" :key="i">
          <line
            x1="50"
            y1="3"
            x2="50"
            y2="8"
            stroke="rgba(255, 255, 255, 0.9)"
            :stroke-width="i % 3 === 0 ? 2.5 : 1"
            stroke-linecap="round"
            transform-origin="50 50"
            :transform="`rotate(${i * 30}, 50, 50)`"
          />
        </template>
      </g>

      <!-- Clock Hands Group -->
      <g class="hands">
        <!-- Hour Hand -->
        <line
          class="hour-hand"
          x1="50"
          y1="50"
          x2="50"
          y2="28"
          stroke="#2c3e50"
          stroke-width="3"
          stroke-linecap="round"
          transform-origin="50 50"
          :style="{ transform: `rotate(${hourHandRotation}deg)` }"
        />

        <!-- Minute Hand -->
        <line
          class="minute-hand"
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="#34495e"
          stroke-width="2"
          stroke-linecap="round"
          transform-origin="50 50"
          :style="{ transform: `rotate(${minuteHandRotation}deg)` }"
        />

        <!-- Second Hand -->
        <line
          class="second-hand"
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="#e74c3c"
          stroke-width="1.2"
          stroke-linecap="round"
          transform-origin="50 50"
          :style="{ transform: `rotate(${secondHandRotation}deg)` }"
        />
      </g>

      <!-- Hand Overlap Pin -->
      <circle cx="50" cy="50" r="2" fill="#e74c3c" />

      <!-- Center Pin Overlay (for style) -->
      <circle cx="50" cy="50" r="6" fill="#fff" opacity="0.1" />
    </svg>
  </div>
</template>

<style scoped>
/* Glassmorphism Variables & Base Styles */
.glass-analog-clock-wrapper {
  /* Glassmorphism Effect */
  --glass-bg-color: rgba(255, 255, 255, 0.15);
  --glass-border-color: rgba(255, 255, 255, 0.4);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
  --glass-blur: 15px;
  --primary-text-color: #2c3e50; /* Dark text for light glass */

  position: relative;
  margin: 20px auto;
  border-radius: 50%;

  /* Apply Glassmorphism */
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  background-color: var(--glass-bg-color);
  border: 1px solid var(--glass-border-color);

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
}

/* Fallback for dark mode, making the text and hands visible */
.dark-mode .glass-analog-clock-wrapper {
  --primary-text-color: #ecf0f1; /* Light text for dark glass */
  --glass-bg-color: rgba(0, 0, 0, 0.15);
  --glass-border-color: rgba(0, 0, 0, 0.4);
}

/* Digital overlay for time and timezone */
.glass-face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 10;
  color: var(--primary-text-color);
  text-align: center;
}

.timezone-label {
  position: absolute;
  top: 25%;
  font-size: 0.8em;
  font-weight: 500;
  opacity: 0.8;
}

.digital-time {
  position: absolute;
  bottom: 25%;
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.25em 0.5em;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* SVG Clock Styles */
.analog-clock-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
}

/* Hand Transition - makes the movement smooth */
.hour-hand,
.minute-hand {
  /* Subtle transition for continuous, smooth movement */
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.second-hand {
  /* Stepped transition for the classic second-hand tick */
  transition: transform 0.1s steps(1) linear;
}

.dark-mode .hour-hand {
  stroke: #ecf0f1;
}

.dark-mode .minute-hand {
  stroke: #bdc3c7;
}

.dark-mode .markers line {
  stroke: rgba(255, 255, 255, 0.9);
}
</style>
