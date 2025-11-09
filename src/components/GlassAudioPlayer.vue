<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// --- PROPS & EMITS ---

const props = defineProps({
  tracklist: {
    type: Array,
    required: true,
    validator: (list) =>
      list.every((t) => 'id' in t && 'title' in t && 'artist' in t && 'src' in t),
  },
  // Bound via v-model:currentTrackId
  currentTrackId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['update:currentTrackId', 'control-action', 'track-change', 'seek'])

// --- STATE MANAGEMENT ---

const audioElement = ref(null) // Ref to the HTML <audio> element
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)
const volume = ref(0.8)

let isDragging = false // State for handling progress bar drag
const progressBar = ref(null) // Ref for progress bar DOM element

// --- COMPUTED PROPERTIES ---

const currentTrackData = computed(() => {
  return (
    props.tracklist.find((t) => t.id === props.currentTrackId) ||
    props.tracklist[0] || { id: -1, title: 'No Track', artist: 'N/A', src: '' }
  )
})

const progressPercentage = computed(() => {
  if (audioDuration.value === 0 || isNaN(audioDuration.value)) return 0
  return (currentTime.value / audioDuration.value) * 100
})

// --- WATCHERS ---

// 1. Sync local volume state to the HTML audio element
watch(volume, (newVolume) => {
  if (audioElement.value) {
    audioElement.value.volume = newVolume
  }
})

// 2. Handle track ID change (triggered externally or by next/prev buttons)
watch(
  () => props.currentTrackId,
  () => {
    if (audioElement.value) {
      // Reload the audio source (which is bound via the template attribute)
      audioElement.value.load()
      currentTime.value = 0
    }
  },
)

// --- AUDIO EVENT LISTENERS SETUP ---

const setupAudioListeners = () => {
  if (!audioElement.value) return
  const audio = audioElement.value

  audio.ontimeupdate = () => {
    if (!isDragging) {
      currentTime.value = audio.currentTime
    }
  }

  audio.onloadedmetadata = () => {
    audioDuration.value = audio.duration
    if (isPlaying.value) {
      audio.play().catch((e) => console.error('Autoplay failed:', e))
    }
  }

  audio.onplay = () => {
    isPlaying.value = true
  }
  audio.onpause = () => {
    isPlaying.value = false
  }

  // Auto advance on end
  audio.onended = () => {
    isPlaying.value = false
    handleTrackChange('next')
  }

  audio.volume = volume.value
  audio.load()
}

// --- METHODS: Playback Control ---

const handleControl = (action) => {
  const audio = audioElement.value
  if (!audio) return

  try {
    if (action === 'play') {
      if (audioDuration.value === 0 && currentTrackData.value.src) {
        audio.load()
      }
      audio.play()
    } else if (action === 'pause') {
      audio.pause()
    } else if (action === 'stop') {
      audio.pause()
      audio.currentTime = 0
      currentTime.value = 0
    } else if (action === 'fastforward') {
      audio.currentTime = Math.min(audio.currentTime + 15, audioDuration.value)
    } else if (action === 'rewind') {
      audio.currentTime = Math.max(0, audio.currentTime - 15)
    }
  } catch (error) {
    console.error(`Audio control failed for action ${action}:`, error)
  }

  emit('control-action', action)
}

/**
 * Handles track navigation and emits the change for v-model.
 * FIX: Pauses audio before state change for clean source reload.
 */
const handleTrackChange = (direction) => {
  const audio = audioElement.value
  if (audio) {
    audio.pause() // Ensure current playback stops cleanly
  }

  const tracks = props.tracklist
  if (tracks.length === 0) return

  const currentIndex = tracks.findIndex((t) => t.id === props.currentTrackId)
  let newIndex =
    direction === 'next'
      ? (currentIndex + 1) % tracks.length
      : (currentIndex - 1 + tracks.length) % tracks.length
  const newTrackId = tracks[newIndex].id

  emit('update:currentTrackId', newTrackId)
  emit('track-change', newTrackId)
}

// --- METHODS: Seeking (Drag and Click) ---

const startDrag = (event) => {
  event.preventDefault()
  isDragging = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', endDrag)
}

const endDrag = () => {
  if (!isDragging || !audioElement.value) return
  isDragging = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)

  audioElement.value.currentTime = currentTime.value
  const normalizedTime = currentTime.value / audioDuration.value
  emit('seek', { time: currentTime.value, normalizedTime: normalizedTime })
}

const handleDrag = (event) => {
  if (!isDragging || !progressBar.value || audioDuration.value === 0) return
  const clientX = event.clientX || event.touches?.[0]?.clientX
  if (clientX === undefined) return
  const rect = progressBar.value.getBoundingClientRect()
  let x = clientX - rect.left
  let percent = Math.max(0, Math.min(x / rect.width, 1))
  currentTime.value = Math.floor(percent * audioDuration.value)
}

const handleSeekClick = (event) => {
  if (isDragging || audioDuration.value === 0 || !audioElement.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  let percent = Math.max(0, Math.min(x / rect.width, 1))
  const newTime = Math.floor(percent * audioDuration.value)
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
  const normalizedTime = currentTime.value / audioDuration.value
  emit('seek', { time: currentTime.value, normalizedTime: normalizedTime })
}

// --- UTILITIES ---
const formatTime = (totalSeconds) => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  if (audioElement.value) {
    setupAudioListeners()
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
})
</script>

<template>
  <div class="audio-player">
    <div class="audio-player-container">
      <!-- Hidden HTML Audio Element -->
      <!-- The src attribute automatically updates when currentTrackData.src changes -->
      <audio ref="audioElement" :src="currentTrackData.src" preload="metadata"></audio>

      <div class="audio-player-wrapper">
        <div class="track-info">
          <div class="track-icon">
            <!-- Music Note Icon SVG -->
            <svg viewBox="0 0 24 24" fill="var(--label)" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 3v10.55a4 4 0 1 1-2-3.46V7h4V5h-6V3h8M10 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"
              />
            </svg>
          </div>
          <div class="track-details">
            <span class="track-title">{{ currentTrackData.title || 'No Track Loaded' }}</span>
            <span class="track-artist">{{ currentTrackData.artist || 'N/A' }}</span>
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
              <!-- Handle for dragging -->
              <div class="progress-handle" @mousedown="startDrag" @touchstart="startDrag"></div>
            </div>
          </div>
        </div>

        <!-- Time Display -->
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="duration">{{ formatTime(audioDuration) }}</span>
        </div>

        <!-- Controls -->
        <div class="controls-row">
          <button
            class="glass-button control-button"
            @click="handleTrackChange('previous')"
            title="Previous Track"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button
            class="glass-button control-button"
            @click="handleControl('rewind')"
            title="Rewind 15s"
          >
            <i class="fa-solid fa-backward"></i>
          </button>

          <button
            class="glass-button main-control-button"
            @click="handleControl(isPlaying ? 'pause' : 'play')"
            :title="isPlaying ? 'Pause' : 'Play'"
          >
            <i v-if="!isPlaying" class="fa-solid fa-play"></i>
            <i v-else class="fa-solid fa-pause"></i>
          </button>

          <button class="glass-button control-button" @click="handleControl('stop')" title="Stop">
            <i class="fa-solid fa-stop"></i>
          </button>
          <button
            class="glass-button control-button"
            @click="handleControl('fastforward')"
            title="Fast Forward 15s"
          >
            <i class="fa-solid fa-forward"></i>
          </button>
          <button
            class="glass-button control-button"
            @click="handleTrackChange('next')"
            title="Next Track"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!--  Volume Slider -->
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
  </div>
</template>
