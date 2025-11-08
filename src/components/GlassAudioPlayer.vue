<template>
  <div class="audio-player-container">
    <div class="audio-player-wrapper">
      <div class="track-info">
        <div class="track-icon">
          <!-- Music Note Icon SVG -->
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3v10.55a4 4 0 1 1-2-3.46V7h4V5h-6V3h8M10 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"
            />
          </svg>
        </div>
        <div class="track-details">
          <span class="track-title">{{ currentTrackData.title }}</span>
          <span class="track-artist">{{ currentTrackData.artist }}</span>
        </div>
      </div>

      <!-- Glass Progress Bar (Custom) -->
      <div class="glass-progress-bar-container" @click="handleSeekClick">
        <div class="progress-bar-track" ref="progressBar">
          <div
            class="progress-bar-fill"
            :style="{ width: `${progressPercentage}%` }"
            :class="{ 'is-playing': isPlaying }"
          >
            <!-- Handle for dragging (simulated) -->
            <div class="progress-handle" @mousedown="startDrag" @touchstart="startDrag"></div>
          </div>
        </div>
      </div>

      <!-- Time Display -->
      <div class="time-display">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span class="duration">{{ formatTime(currentTrackData.duration) }}</span>
      </div>

      <!-- Controls -->
      <div class="controls-row">
        <!-- Previous Track -->
        <button
          class="glass-button control-button"
          @click="handleTrackChange('previous')"
          title="Previous Track"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- Rewind 15s -->
        <button
          class="glass-button control-button"
          @click="handleControl('rewind')"
          title="Rewind 15s"
        >
          <i class="fa-solid fa-backward"></i>
        </button>

        <!-- Play / Pause -->
        <button
          class="glass-button main-control-button"
          @click="handleControl(isPlaying ? 'pause' : 'play')"
          :title="isPlaying ? 'Pause' : 'Play'"
        >
          <i v-if="isPlaying" class="fa-solid fa-play"></i>
          <i v-else class="fa-solid fa-pause"></i>
        </button>

        <!-- Stop -->
        <button class="glass-button control-button" @click="handleControl('stop')" title="Stop">
          <i class="fa-solid fa-stop"></i>
        </button>

        <!-- Fast Forward 15s -->
        <button
          class="glass-button control-button"
          @click="handleControl('fastforward')"
          title="Fast Forward 15s"
        >
          <i class="fa-solid fa-forward"></i>
        </button>

        <!-- Next Track -->
        <button
          class="glass-button control-button"
          @click="handleTrackChange('next')"
          title="Next Track"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <!-- Volume Slider (Custom Glass Slider) -->
      <div class="volume-control">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 opacity-70">
          <path d="M3 9v6h4l5 5V4L7 9z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          class="glass-slider"
          title="Volume Control"
        />
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 opacity-70">
          <path
            d="M14 3.23v2.06c2.89.81 5 3.53 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM12 9L7 4v16l5-5z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

// --- DATA ---

const tracks = [
  { id: 1, title: 'Nebula Drift', artist: 'Astral Project', duration: 210 }, // 3:30
  { id: 2, title: 'Echoes of Dawn', artist: 'Synthwave Dreams', duration: 185 }, // 3:05
  { id: 3, title: 'Future Tense', artist: 'Cyberfunk Ltd.', duration: 250 }, // 4:10
]

// --- STATE MANAGEMENT ---

const currentTrack = ref(1) // Current track ID
const isPlaying = ref(false)
const currentTime = ref(0) // Current playback time in seconds
const volume = ref(0.8) // Volume from 0.0 to 1.0

// Timer reference for simulated playback interval
let playbackInterval = null
let isDragging = false // State to manage slider drag

// DOM reference for progress bar to calculate seek position
const progressBar = ref(null)

// --- EMITS ---
const emit = defineEmits([
  'control-action', // Emitted for play, pause, stop, ff, rw
  'track-change', // Emitted when previous/next is clicked
  'seek', // Emitted when the user seeks to a new time
])

// --- COMPUTED PROPERTIES ---

const currentTrackData = computed(() => {
  return tracks.find((t) => t.id === currentTrack.value) || tracks[0]
})

const progressPercentage = computed(() => {
  if (currentTrackData.value.duration === 0) return 0
  return (currentTime.value / currentTrackData.value.duration) * 100
})

// --- METHODS: Playback Simulation & Control ---

const startPlaybackSimulation = () => {
  if (playbackInterval) clearInterval(playbackInterval)

  playbackInterval = setInterval(() => {
    if (isPlaying.value && !isDragging) {
      currentTime.value += 1

      // Check if track has finished
      if (currentTime.value >= currentTrackData.value.duration) {
        clearInterval(playbackInterval)
        handleControl('stop')
        handleTrackChange('next') // Auto-advance
      }
    }
  }, 1000)
}

/**
 * Handles control button clicks and emits the action.
 * @param {'play' | 'pause' | 'stop' | 'fastforward' | 'rewind'} action
 */
const handleControl = (action) => {
  // Ensure time is reset on stop, and bounded
  if (action === 'stop') {
    isPlaying.value = false
    currentTime.value = 0
  } else if (action === 'play') {
    // If play is pressed when track ended, reset to 0
    if (currentTime.value >= currentTrackData.value.duration) {
      currentTime.value = 0
    }
    isPlaying.value = true
    startPlaybackSimulation()
  } else if (action === 'pause') {
    isPlaying.value = false
  } else if (action === 'fastforward' || action === 'rewind') {
    const skip = action === 'fastforward' ? 15 : -15
    const newTime = currentTime.value + skip
    currentTime.value = Math.max(0, Math.min(newTime, currentTrackData.value.duration))
  }

  emit('control-action', action)
}

/**
 * Handles track navigation and emits the change.
 * @param {'next' | 'previous'} direction
 */
const handleTrackChange = (direction) => {
  let newTrackId = currentTrack.value
  const currentIndex = tracks.findIndex((t) => t.id === currentTrack.value)

  if (direction === 'next') {
    newTrackId = (currentIndex + 1) % tracks.length
  } else {
    newTrackId = (currentIndex - 1 + tracks.length) % tracks.length
  }

  currentTrack.value = tracks[newTrackId].id

  // Always reset time and start/continue playback
  currentTime.value = 0
  if (isPlaying.value) {
    startPlaybackSimulation()
  }

  emit('track-change', currentTrack.value)
}

// --- METHODS: Seeking (Drag and Click) ---

const startDrag = (event) => {
  event.preventDefault() // Prevent text selection/default touch action
  isDragging = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', endDrag)
}

const endDrag = () => {
  if (!isDragging) return
  isDragging = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)

  // Emit the seek event once dragging stops
  const normalizedTime = currentTime.value / currentTrackData.value.duration
  emit('seek', { time: currentTime.value, normalizedTime: normalizedTime })
}

const handleDrag = (event) => {
  if (!isDragging || !progressBar.value) return

  const clientX = event.clientX || event.touches?.[0]?.clientX
  if (clientX === undefined) return

  const rect = progressBar.value.getBoundingClientRect()

  // Calculate the new time based on cursor position
  let x = clientX - rect.left
  let percent = Math.max(0, Math.min(x / rect.width, 1))

  currentTime.value = Math.floor(percent * currentTrackData.value.duration)
}

const handleSeekClick = (event) => {
  // Only seek on click if not dragging the handle itself (handled by mouseup)
  if (isDragging) return

  const rect = progressBar.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  let percent = Math.max(0, Math.min(x / rect.width, 1))

  currentTime.value = Math.floor(percent * currentTrackData.value.duration)

  // Emit the seek event immediately on click
  const normalizedTime = currentTime.value / currentTrackData.value.duration
  emit('seek', { time: currentTime.value, normalizedTime: normalizedTime })
}

// --- UTILITIES ---

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// --- LIFECYCLE HOOKS ---

onMounted(() => {
  // Start simulation on mount (initially paused)
  startPlaybackSimulation()
})

onUnmounted(() => {
  if (playbackInterval) {
    clearInterval(playbackInterval)
  }
})
</script>

<style scoped>
/* Scoped styles ensure they only apply to this component */

/*
  The CSS relies on custom properties defined globally by theme.scss 
  (e.g., --ui-text-color, --bg-surface, --glass-overlay).
*/

.audio-player-container {
  font-family: 'Inter', sans-serif;
  padding: 1rem;
  width: 100%;
  max-width: 450px;
  margin: 2rem auto;
  box-sizing: border-box;
}

.audio-player-wrapper {
  /* Glassmorphism Base Panel */
  background: var(--bg-surface);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
  border-radius: var(--glass-border-radius, 18px);
  border: 1px solid var(--ui-border-color);
  box-shadow: var(--shadow-lift);
  padding: 1.5rem;
  color: var(--ui-text-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* -------------------- TRACK INFO -------------------- */

.track-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.track-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-accent-gradient);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-depth);
}

.track-icon svg {
  width: 28px;
  height: 28px;
  color: var(--ui-text-color);
  opacity: 0.8;
}

.track-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  overflow: hidden;
}

.track-title {
  font-size: 1.1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* -------------------- PROGRESS BAR (Custom Glass Component) -------------------- */

.glass-progress-bar-container {
  width: 100%;
  padding: 0.5rem 0;
  cursor: pointer;
}

.progress-bar-track {
  position: relative;
  height: var(--glass-progress-bar-height, 10px);
  border-radius: var(--glass-progress-bar-border-radius, 12px);
  background-color: var(--progress-bar-bg-color);
  border: 1px solid var(--progress-bar-border-color);
  box-shadow: var(--shadow-inset);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--glass-progress-bar-border-radius, 12px);
  background: var(--progress-bar-fill-gradient);
  transition: width 0.1s linear; /* Smooth, quick transition for simulation */
  position: relative;
}

.progress-bar-fill.is-playing {
  /* Add subtle glow when playing */
  box-shadow: 0 0 8px rgba(0, 119, 255, 0.5);
}

.progress-handle {
  --handle-size: 14px;
  position: absolute;
  right: calc(0px - var(--handle-size) / 2); /* Half of handle size outside */
  top: 50%;
  transform: translateY(-50%);
  width: var(--handle-size);
  height: var(--handle-size);
  background-color: var(--slider-handle-color);
  border: 2px solid var(--ui-text-color);
  border-radius: 50%;
  box-shadow: var(--shadow-depth);
  cursor: grab;
  transition: background-color 0.1s;
}

.progress-handle:active {
  cursor: grabbing;
  transform: translateY(-50%) scale(1.1);
  background-color: var(--ui-selected-bg);
}

/* -------------------- TIME DISPLAY -------------------- */

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-family: monospace;
  opacity: 0.7;
}

/* -------------------- CONTROLS -------------------- */

.controls-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.glass-button {
  --button-size: 40px;
  width: var(--button-size);
  height: var(--button-size);
  background-color: var(--ui-button-bg-default);
  border: 1px solid var(--ui-border-color);
  border-radius: 50%;
  box-shadow: var(--shadow-depth);
  color: var(--ui-text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.glass-button:hover {
  background-color: var(--ui-button-bg-hover);
  box-shadow: var(--shadow-lift);
  transform: scale(1.05);
}

.glass-button:active {
  background-color: var(--ui-selected-bg);
  color: var(--ui-selected-text-color);
  box-shadow: var(--shadow-inset);
  transform: scale(0.95);
}

.control-button svg {
  width: 18px;
  height: 18px;
}

.main-control-button {
  --button-size: 56px; /* Larger for the main play/pause button */
  width: var(--button-size);
  height: var(--button-size);
}

.main-control-button svg {
  width: 28px;
  height: 28px;
}

/* -------------------- VOLUME SLIDER -------------------- */

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.volume-control svg {
  width: 20px;
  height: 20px;
}

/* Standard HTML Range Input Styling (Custom Glass Slider) */
.glass-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--slider-track-bg);
  border-radius: 3px;
  outline: none;
  margin: 0;
  transition: all 0.2s ease;
}

/* THUMB (Handle) STYLING */
.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--slider-handle-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-depth);
  border: 2px solid var(--ui-text-color);
  transition:
    background 0.15s,
    box-shadow 0.15s;
}

.glass-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--slider-handle-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-depth);
  border: 2px solid var(--ui-text-color);
}

.glass-slider:hover::-webkit-slider-thumb {
  background: var(--ui-selected-bg);
  box-shadow: 0 0 5px var(--ui-accent-color);
}

/* -------------------- RESPONSIVENESS -------------------- */

@media (max-width: 480px) {
  .audio-player-container {
    padding: 0.5rem;
  }
  .audio-player-wrapper {
    padding: 1rem;
  }
  .track-icon {
    width: 40px;
    height: 40px;
  }
  .track-icon svg {
    width: 24px;
    height: 24px;
  }
  .track-title {
    font-size: 1rem;
  }
  .track-artist {
    font-size: 0.8rem;
  }
  .controls-row {
    gap: 0.5rem;
  }
  .glass-button {
    --button-size: 36px;
  }
  .main-control-button {
    --button-size: 50px;
  }
  .control-button svg {
    width: 16px;
    height: 16px;
  }
  .main-control-button svg {
    width: 24px;
    height: 24px;
  }
}
</style>
