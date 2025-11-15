<template>
  <svg
    :width="svgSize"
    :height="svgHeight"
    viewBox="0 0 420 120"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :class="`theme-${theme}`"
  >
    <defs>
      <filter id="lcdGlow">
        <feFlood :flood-color="isDark ? '#00eaff' : '#0070c0'" flood-opacity="0.8" result="flood" />
        <feComposite in="flood" in2="SourceGraphic" operator="in" result="comp" />
        <feGaussianBlur in="comp" stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="glassShadow">
        <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="black" flood-opacity="0.2" />
      </filter>

      <g id="segment-a"><path d="M10 0 L70 0 L65 5 L15 5 Z" /></g>
      <g id="segment-b"><path d="M70 10 L70 50 L65 45 L65 15 Z" /></g>
      <g id="segment-c"><path d="M70 60 L70 100 L65 95 L65 65 Z" /></g>
      <g id="segment-d"><path d="M10 100 L70 100 L65 95 L15 95 Z" /></g>
      <g id="segment-e"><path d="M0 60 L0 100 L5 95 L5 65 Z" /></g>
      <g id="segment-f"><path d="M0 10 L0 50 L5 45 L5 15 Z" /></g>
      <g id="segment-g"><path d="M10 50 L70 50 L65 55 L15 55 Z" /></g>
    </defs>

    <g
      v-for="(digitSegments, digitIndex) in timeDigits"
      :key="digitIndex"
      :transform="`translate(${digitX(digitIndex)}, 15) scale(${segmentScale})`"
    >
      <g :fill="inactiveColor">
        <use xlink:href="#segment-a" />
        <use xlink:href="#segment-b" />
        <use xlink:href="#segment-c" />
        <use xlink:href="#segment-d" />
        <use xlink:href="#segment-e" />
        <use xlink:href="#segment-f" />
        <use xlink:href="#segment-g" />
      </g>

      <g :fill="activeColor" :filter="`url(#lcdGlow)`">
        <use v-if="digitSegments.a" xlink:href="#segment-a" />
        <use v-if="digitSegments.b" xlink:href="#segment-b" />
        <use v-if="digitSegments.c" xlink:href="#segment-c" />
        <use v-if="digitSegments.d" xlink:href="#segment-d" />
        <use v-if="digitSegments.e" xlink:href="#segment-e" />
        <use v-if="digitSegments.f" xlink:href="#segment-f" />
        <use v-if="digitSegments.g" xlink:href="#segment-g" />
      </g>
    </g>

    <g
      class="colon-set"
      :fill="activeColor"
      :filter="`url(#lcdGlow)`"
      :transform="`scale(${segmentScale})`"
    >
      <circle :cx="colonX[0]" cy="45" r="4" />
      <circle :cx="colonX[0]" cy="75" r="4" />

      <circle :cx="colonX[1]" cy="45" r="4" />
      <circle :cx="colonX[1]" cy="75" r="4" />
    </g>

    <text
      x="410"
      y="110"
      text-anchor="end"
      class="timezone-label"
      :fill="inactiveColor"
      font-size="12"
    >
      {{ timezoneLabel }}
    </text>
  </svg>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// 1. PROPS
const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
})

// 2. SIZE AND THEME COMPUTATION
const sizeMap = {
  sm: { width: 300, height: 90, scale: 0.7 },
  md: { width: 420, height: 120, scale: 1 },
  lg: { width: 560, height: 160, scale: 1.3 },
}
const currentSize = computed(() => sizeMap[props.size] || sizeMap['md'])
const svgSize = computed(() => currentSize.value.width)
const svgHeight = computed(() => currentSize.value.height)
const segmentScale = computed(() => currentSize.value.scale)

const activeColor = computed(() => (isDark ? '#00eaff' : '#0070c0'))
const inactiveColor = computed(() => (isDark ? 'rgba(0, 234, 255, 0.1)' : 'rgba(0, 112, 192, 0.1)'))

// 3. TIME MANAGEMENT
const currentTime = ref('')
let timer = null

const updateTime = () => {
  try {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: props.timezone,
    }
    const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date())
    currentTime.value = timeString.replace(/:/g, '') // Store as "HHMMSS"
  } catch (e) {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '')
  }
}

const timezoneLabel = computed(() => {
  try {
    const timeZoneName = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: props.timezone,
    })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value
    return timeZoneName || props.timezone.toUpperCase()
  } catch {
    return props.timezone.toUpperCase()
  }
})

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 4. DIGIT LOGIC MAPPING
const segmentMap = {
  0: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
  1: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  2: { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
  3: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
  4: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
  5: { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
  6: { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
  7: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  8: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
  9: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
  ' ': { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 },
}

const timeDigits = computed(() => {
  const timeStr = String(currentTime.value).padEnd(6, '0')
  return Array.from(timeStr)
    .slice(0, 6)
    .map((char) => segmentMap[char] || segmentMap[' '])
})

// 5. LAYOUT COMPUTATION
const digitWidth = 80
const digitSpacing = 10
const colonGap = 15
const desiredPadding = 10

// FINAL FIX: Calculate the unscaled translation required to achieve the desired visual padding.
const leftOffset = computed(() => desiredPadding / segmentScale.value)

const digitX = (index) => {
  let x = leftOffset.value + index * (digitWidth + digitSpacing)
  if (index >= 2) x += colonGap
  if (index >= 4) x += colonGap
  return x
}

const colonX = computed(() => {
  const c1_x = digitX(1) + digitWidth + digitSpacing + colonGap / 2
  const c2_x = digitX(3) + digitWidth + digitSpacing + colonGap / 2
  return [c1_x / segmentScale.value, c2_x / segmentScale.value]
})
</script>

<style scoped>
svg {
  /* Crucial for filters (shadows, glow) to be visible outside the defined element bounds */
  overflow: visible;
  transition:
    width 0.3s,
    height 0.3s;
}

.timezone-label {
  font-family: monospace;
  font-weight: bold;
}
</style>
