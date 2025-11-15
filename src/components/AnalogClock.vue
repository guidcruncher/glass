<template>
  <div :class="['clock-face-container', glassClass]" :style="{ width: size, height: size }">
    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <line
        v-for="i in 12"
        :key="`marker-${i}`"
        :x1="getMarkerPosition(i - 1).outerX"
        :y1="getMarkerPosition(i - 1).outerY"
        :x2="getMarkerPosition(i - 1).innerX"
        :y2="getMarkerPosition(i - 1).innerY"
        :stroke="isDark ? '#ffffff' : '#1f2937'"
        :stroke-width="(i - 1) % 3 === 0 ? 4 : 2"
        :opacity="isDark ? 0.6 : 0.7"
        stroke-linecap="round"
      />

      <text
        v-for="num in [12, 3, 6, 9]"
        :key="`number-${num}`"
        :x="getNumberPosition(num).x"
        :y="getNumberPosition(num).y"
        text-anchor="middle"
        dominant-baseline="middle"
        :class="['font-bold', isDark ? 'fill-white' : 'fill-gray-800']"
        :opacity="isDark ? 0.9 : 1"
        :style="{ fontSize: numberFontSize }"
      >
        {{ num }}
      </text>

      <circle cx="200" cy="200" r="12" :fill="isDark ? '#FF453A' : '#FF3B30'" filter="url(#glow)" />

      <line
        x1="200"
        y1="200"
        :x2="hourEnd.x"
        :y2="hourEnd.y"
        :stroke="isDark ? '#ffffff' : '#1f2937'"
        stroke-width="8"
        stroke-linecap="round"
        :opacity="isDark ? 0.9 : 1"
        filter="url(#glow)"
      />

      <line
        x1="200"
        y1="200"
        :x2="minuteEnd.x"
        :y2="minuteEnd.y"
        :stroke="isDark ? '#0A84FF' : '#007AFF'"
        stroke-width="6"
        stroke-linecap="round"
        filter="url(#glow)"
      />

      <line
        x1="200"
        y1="200"
        :x2="secondEnd.x"
        :y2="secondEnd.y"
        :stroke="isDark ? '#FF453A' : '#FF3B30'"
        stroke-width="2"
        stroke-linecap="round"
        filter="url(#glow)"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  timeZone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone,
    validator: (value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value })
        return true
      } catch {
        return false
      }
    },
  },
  // Controls the rendered size of the clock component
  size: {
    type: String,
    default: '400px',
  },
})

const time = ref(new Date())
const { isDark } = useTheme()
let timer = null

// --- Sizing Constants (Based on 400x400 ViewBox) ---
const VIEWBOX_SIZE = 400
const CENTER = VIEWBOX_SIZE / 2
const RADIUS = CENTER

// Hand and Marker Length Ratios (relative to RADIUS)
const HOUR_HAND_RATIO = 0.4 // 80 / 200 = 0.4
const MINUTE_HAND_RATIO = 0.6 // 120 / 200 = 0.6
const SECOND_HAND_RATIO = 0.7 // 140 / 200 = 0.7
const NUMBER_DISTANCE_RATIO = 0.65 // Hour Numbers (12, 3, 6, 9)
// Removed: const MINUTE_NUMBER_DISTANCE_RATIO = 0.80;
const OUTER_MARKER_RATIO = 0.85 // 170 / 200 = 0.85
const INNER_MARKER_RATIO = 0.75 // 150 / 200 = 0.75

// --- Time Logic ---
const getTimeInZone = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: props.timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const hours = parseInt(parts.find((p) => p.type === 'hour').value)
  const minutes = parseInt(parts.find((p) => p.type === 'minute').value)
  const seconds = parseInt(parts.find((p) => p.type === 'second').value)

  return { hours, minutes, seconds }
}

const timeInZone = computed(() => getTimeInZone(time.value))
const hours = computed(() => timeInZone.value.hours % 12)
const minutes = computed(() => timeInZone.value.minutes)
const seconds = computed(() => timeInZone.value.seconds)

const secondAngle = computed(() => seconds.value * 6 - 90)
const minuteAngle = computed(() => minutes.value * 6 + seconds.value * 0.1 - 90)
const hourAngle = computed(() => hours.value * 30 + minutes.value * 0.5 - 90)

// --- SVG Calculation Logic ---

/**
 * Calculates the end point of a hand based on angle and length ratio.
 */
const getHandEndPoint = (angle, ratio) => {
  const length = RADIUS * ratio
  const radians = (angle * Math.PI) / 180
  return {
    x: CENTER + length * Math.cos(radians),
    y: CENTER + length * Math.sin(radians),
  }
}

const hourEnd = computed(() => getHandEndPoint(hourAngle.value, HOUR_HAND_RATIO))
const minuteEnd = computed(() => getHandEndPoint(minuteAngle.value, MINUTE_HAND_RATIO))
const secondEnd = computed(() => getHandEndPoint(secondAngle.value, SECOND_HAND_RATIO))

const getMarkerPosition = (i) => {
  const angle = i * 30 - 90
  const radians = (angle * Math.PI) / 180
  return {
    // Outer Marker Position
    outerX: CENTER + RADIUS * OUTER_MARKER_RATIO * Math.cos(radians),
    outerY: CENTER + RADIUS * OUTER_MARKER_RATIO * Math.sin(radians),
    // Inner Marker Position
    innerX: CENTER + RADIUS * INNER_MARKER_RATIO * Math.cos(radians),
    innerY: CENTER + RADIUS * INNER_MARKER_RATIO * Math.sin(radians),
  }
}

const getNumberPosition = (num) => {
  const positions = {
    12: { angle: -90 },
    3: { angle: 0 },
    6: { angle: 90 },
    9: { angle: 180 },
  }
  const angle = positions[num].angle
  const radians = (angle * Math.PI) / 180

  // Position numbers further out than hands
  const distance = RADIUS * NUMBER_DISTANCE_RATIO
  return {
    x: CENTER + distance * Math.cos(radians),
    y: CENTER + distance * Math.sin(radians),
  }
}

// Removed: getMinuteNumberPosition

// --- UI Styling ---
const bgClass = computed(() =>
  isDark.value
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800'
    : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
)

const glassClass = computed(() =>
  isDark.value
    ? 'bg-[rgba(30,30,30,0.4)] border-[rgba(255,255,255,0.15)]'
    : 'bg-[rgba(255,255,255,0.65)] border-[rgba(255,255,255,0.8)]',
)

const numberFontSize = computed(() => {
  // Scales the font size based on the string value of the size prop
  const baseSize = parseFloat(props.size)
  if (!isNaN(baseSize)) {
    return `calc(${props.size} / 16)` // Scales font size relative to container size
  }
  return '1.5rem' // Default font size
})

// Removed: minuteNumberFontSize

// --- Display Text ---
const formattedTime = computed(() =>
  time.value.toLocaleTimeString('en-US', { timeZone: props.timeZone }),
)

const formattedDate = computed(() =>
  time.value.toLocaleDateString('en-US', {
    timeZone: props.timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const timeZoneLabel = computed(() => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: props.timeZone,
    timeZoneName: 'short',
  })
  const parts = formatter.formatToParts(time.value)
  return parts.find((p) => p.type === 'timeZoneName')?.value || props.timeZone
})

// --- Lifecycle ---
const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.clock-face-container {
  position: relative;
  border-radius: 50%;
  border: 2px solid;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  /* The size prop controls these dimensions */
}

.digital-display {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: 1px solid;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.time {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700; /* font-bold */
}

.date {
  font-size: 0.875rem; /* text-sm */
  margin-top: 0.5rem;
}

.timezone {
  font-size: 0.75rem; /* text-xs */
  margin-top: 0.25rem;
  font-weight: 500;
}
</style>
