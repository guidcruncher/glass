<template>
  <div class="glass-analog-clock" :style="clockContainerStyle">
    <div class="glass-analog-clock__face-wrapper" :style="faceWrapperStyle">
      <svg viewBox="0 0 100 100" class="glass-analog-clock__svg">
        <!-- Clock Face Circle (Glassmorphic Background) -->
        <circle cx="50" cy="50" r="48" class="glass-analog-clock__face-circle" />

        <!-- Hour Indicators -->
        <g class="glass-analog-clock__indicators">
          <line
            v-for="hour in 12"
            :key="hour"
            :class="[
              'glass-analog-clock__indicator-line',
              { 'glass-analog-clock__indicator-line--major': hour % 3 === 0 },
            ]"
            x1="50"
            y1="4"
            x2="50"
            y2="10"
            :transform="getIndicatorRotation(hour)"
          />
        </g>

        <!-- Clock Hands: Drawn pointing DOWN (y2 > 50) at 0 degrees -->

        <!-- Hour Hand (Length: 20 units) -->
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="70"
          :transform="getHandRotation(currentTime.hourAngle)"
          class="glass-analog-clock__hand glass-analog-clock__hand--hour"
        />

        <!-- Minute Hand (Length: 35 units) -->
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="85"
          :transform="getHandRotation(currentTime.minuteAngle)"
          class="glass-analog-clock__hand glass-analog-clock__hand--minute"
        />

        <!-- Second Hand (Length: 40 units) -->
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="90"
          :transform="getHandRotation(currentTime.secondAngle)"
          class="glass-analog-clock__hand glass-analog-clock__hand--second"
        />

        <!-- Center Pin -->
        <circle cx="50" cy="50" r="2.5" class="glass-analog-clock__center-pin" />
      </svg>
      <div v-if="displayTimeZoneLabel" class="glass-analog-clock__label">
        {{ timeZoneLabel }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive } from 'vue'

export default {
  name: 'GlassAnalogClock',
  props: {
    // Component size (e.g., '200px', '10rem')
    size: {
      type: [String, Number],
      default: '200px',
    },
    // Timezone string (e.g., 'America/New_York', 'Europe/London')
    timezone: {
      type: String,
      default: 'UTC',
    },
    // Opacity of the glass background (0.0 to 1.0)
    opacity: {
      type: [Number, String],
      default: 0.2, // Default to 20% transparent glass
      validator: (val) => parseFloat(val) >= 0 && parseFloat(val) <= 1,
    },
    // Optional label to display the timezone
    displayTimeZoneLabel: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    let intervalId = null
    const currentTime = reactive({
      hourAngle: 0,
      minuteAngle: 0,
      secondAngle: 0,
    })

    const updateTime = () => {
      // Use Int.DateTimeFormat to get time components in the specified timezone
      const now = new Date()
      const options = {
        timeZone: props.timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }

      // Extract time components using formatToParts
      const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now)

      let hour = 0
      let minute = 0
      let second = 0

      parts.forEach((part) => {
        if (part.type === 'hour') hour = parseInt(part.value)
        if (part.type === 'minute') minute = parseInt(part.value)
        if (part.type === 'second') second = parseInt(part.value)
      })

      // Handle the clock logic (12-hour cycle)
      const h = hour % 12 || 12

      // Angle Calculations (0 degrees at 12 o'clock, clockwise rotation)

      // Hour: 30 deg per hour + 0.5 deg per minute (30/60)
      currentTime.hourAngle = h * 30 + minute * 0.5

      // Minute: 6 deg per minute + 0.1 deg per second (6/60)
      currentTime.minuteAngle = minute * 6 + second * 0.1

      // Second: 6 deg per second
      currentTime.secondAngle = second * 6
    }

    onMounted(() => {
      updateTime()
      // Update every 100 milliseconds for smooth second hand movement
      intervalId = setInterval(updateTime, 100)
    })

    onUnmounted(() => {
      clearInterval(intervalId)
    })

    // --- Computed Styles/Props ---

    const clockContainerStyle = computed(() => ({
      width: typeof props.size === 'number' ? `${props.size}px` : props.size,
      height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    }))

    // Style applied to the face wrapper to include the opacity variable
    const faceWrapperStyle = computed(() => ({
      '--glass-opacity': props.opacity,
    }))

    const timeZoneLabel = computed(() => {
      // Format the timezone name nicely
      return props.timezone.replace(/_/g, ' ').split('/').pop()
    })

    // --- Methods ---

    const getIndicatorRotation = (hour) => {
      // Indicators are drawn pointing UP (y2 < 50) at 0 degrees.
      // Offset by -90 degrees so 12 o'clock (0 angle) is pointing UP.
      const angle = hour * 30 - 90
      return `rotate(${angle}, 50, 50)`
    }

    const getHandRotation = (angle) => {
      // FIX: Hands are drawn pointing DOWN (y2 > 50) at 0 degrees.
      // We must rotate by 180 degrees to flip 0 degrees from DOWN (6 o'clock) to UP (12 o'clock).
      // This is the correct fix for SVG elements drawn vertically down from the center (50, 50).
      return `rotate(${angle + 180}, 50, 50)`
    }

    return {
      currentTime,
      clockContainerStyle,
      faceWrapperStyle,
      timeZoneLabel,
      getIndicatorRotation,
      getHandRotation,
    }
  },
}
</script>
