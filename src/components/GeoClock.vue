<template>
  <div class="geoclock-container" :style="{ width: `${width}px`, height: `${height}px` }">
    <div ref="svgContainer"></div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// --- PROPS ---
const props = defineProps({
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 400,
  },
  markerLat: {
    type: Number,
    default: 51.5, // Default to London (approx)
  },
  markerLon: {
    type: Number,
    default: 0.0, // Default to London (approx)
  },
  // NEW PROP: Specifies the twilight depth to plot
  twilightLevel: {
    type: String,
    default: 'civil', // Options: 'none', 'civil', 'nautical', 'astronomical'
    validator: (value) =>
      ['none', 'civil', 'nautical', 'astronomical'].includes(value.toLowerCase()),
  },
})

// --- STATE & VARIABLES ---
const svgContainer = ref(null)
let animationFrameId = null

let svg = null
let nightPath = null
let twilightPath = null
let path = null
let landGroup = null
let projection = null

// --- TWILIGHT MAPPING ---
// Maps the prop string to the required angular offset (in degrees below the horizon)
const twilightAngleOffset = computed(() => {
  switch (props.twilightLevel.toLowerCase()) {
    case 'civil':
      return 6
    case 'nautical':
      return 12
    case 'astronomical':
      return 18
    case 'none':
    default:
      return 0
  }
})

// --- D3 INITIALIZATION & MAP DRAWING ---
function initD3() {
  d3.select(svgContainer.value).selectAll('*').remove()

  const w = props.width
  const h = props.height

  // Setup Projection
  projection = d3
    .geoEquirectangular()
    .scale(h / Math.PI)
    .translate([w / 2, h / 2])

  path = d3.geoPath().projection(projection)

  // Create SVG canvas
  svg = d3
    .select(svgContainer.value)
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('viewBox', `0 0 ${w} ${h}`)

  // --- SVG DEFINITIONS (GRADIENTS & FILTERS) ---
  const defs = svg.append('defs')

  // Radial gradient for the 'fade to black' night effect
  const nightGradient = defs
    .append('radialGradient')
    .attr('id', 'nightGradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '75%')
    .attr('fx', '50%')
    .attr('fy', '50%')
  nightGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0, 0, 0, 0.2)')
  nightGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0, 0, 0, 0.8)')

  // Filter for the blurred effect
  const blurFilter = defs.append('filter').attr('id', 'blurMap')
  blurFilter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '1.5')

  // Add background (Ocean)
  svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#0077be')

  // Add Graticule (Grid Lines)
  svg
    .append('path')
    .datum(d3.geoGraticule().step([15, 15]))
    .attr('class', 'graticule')
    .attr('d', path)

  // Load & Draw World Map Data
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world) => {
    const land = topojson.feature(world, world.objects.countries)

    landGroup = svg.append('g').attr('class', 'land-group')

    // Draw Landmasses
    landGroup
      .append('path')
      .datum(land)
      .attr('class', 'map-land')
      .attr('d', path)
      .attr('fill', '#47c78a')

    // NEW: Twilight mask (draws the largest area, e.g., 96 degrees)
    twilightPath = svg
      .append('path')
      .attr('class', 'twilight-mask')
      .attr('fill', 'rgba(75, 75, 75, 0.4)')

    // Night mask (draws the smaller area, 90 degrees, using the gradient)
    nightPath = svg.append('path').attr('class', 'night-mask').attr('fill', 'url(#nightGradient)')

    // Draw the initial marker
    drawMarker()

    // Start the animation loop
    updateGeoClock()
  })
}

// --- CORE LOGIC: CALCULATE & DRAW TERMINATOR/TWILIGHT ---
function updateGeoClock() {
  const now = new Date()

  // 1. Solar Positioning Calculations
  const dayOfYear =
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
    86400000
  const solarDeclination =
    -23.44 * Math.cos(((dayOfYear + 10) / 365.25) * 2 * Math.PI) * (180 / Math.PI)
  const hoursUTC = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600
  const subsolarLong = 180 - hoursUTC * 15

  // Antipode (center of the night hemisphere)
  const antipodeLong = subsolarLong > 0 ? subsolarLong - 180 : subsolarLong + 180
  const antipodeLat = -solarDeclination

  // 2. Twilight Boundary Calculation (90° + offset)
  const offset = twilightAngleOffset.value
  const twilightBoundaryRadius = 90 + offset

  // A. Twilight Boundary (e.g., 96° for Civil)
  const twilightBoundary = d3
    .geoCircle()
    .center([antipodeLong, antipodeLat])
    .radius(twilightBoundaryRadius)()

  // B. Solar Terminator Boundary (90° for sunset/sunrise)
  const solarTerminatorBoundary = d3.geoCircle().center([antipodeLong, antipodeLat]).radius(90)()

  // 3. Draw the Masks (Overlay)

  if (offset > 0) {
    // Twilight Path draws the larger circle (e.g., 96 degrees)
    twilightPath.attr('d', path(twilightBoundary)).style('display', 'block')
  } else {
    // Hide the twilight path if set to 'none'
    twilightPath.style('display', 'none')
  }

  // Night Path always draws the 90° boundary (Solar Terminator)
  nightPath.attr('d', path(solarTerminatorBoundary))

  // Apply blur approximation
  if (nightPath && landGroup) {
    landGroup.attr('filter', 'url(#blurMap)')
  }

  animationFrameId = requestAnimationFrame(updateGeoClock)
}

// --- MARKER LOGIC ---
function drawMarker() {
  svg.selectAll('.user-marker').remove()

  // Convert [longitude, latitude] to [x, y] coordinates
  const coords = projection([props.markerLon, props.markerLat])

  if (coords) {
    svg
      .append('circle')
      .attr('class', 'user-marker')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('pointer-events', 'none')
  }
}

// --- LIFECYCLE HOOKS & WATCHERS ---
onMounted(() => {
  initD3()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// Watch for size/twilight changes to completely redraw the map
watch([() => props.width, () => props.height, twilightAngleOffset], () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  initD3()
})

// Watch for coordinate changes to only redraw the marker
watch([() => props.markerLat, () => props.markerLon], () => {
  if (svg) {
    drawMarker()
  }
})
</script>

<style scoped>
.geoclock-container {
  position: relative;
  overflow: hidden;
  border: 2px solid #555;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
}

/* Twilight mask: Draws the outer ring (e.g., between 90° and 96°) */
.twilight-mask {
  fill: rgba(75, 75, 75, 0.4);
  pointer-events: none;
}

/* Night mask: Draws the inner circle (0° to 90°) */
.night-mask {
  /* Fills via gradient defined in the script */
  pointer-events: none;
}

.map-land {
  stroke: #333;
  stroke-width: 0.5px;
}

.graticule {
  fill: none;
  stroke: #777;
  stroke-width: 0.2px;
}
</style>
