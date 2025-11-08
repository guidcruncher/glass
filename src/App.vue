w
<template>
  <div :class="{ 'dark-mode': isDark }">
    <GlassApp sidebar-dock="left" sidebar-width="260px">
      <template #appbar-left>
        <h1 class="app-logo">Glassmorphic Demo</h1>
      </template>
      <template #appbar-middle> </template>
      <template #appbar-right>
        <GlassThemeChooser v-model:isDark="isDark" />
        <i class="fas fa-cog glass-appbar-icon" @click="showModal = true"></i>
      </template>

      <template #sidebar>
        <h3 class="sidebar-header">App Controls</h3>
        <h3 class="sidebar-header mt-4">Components ({{ componentList.length }})</h3>
        <div class="sidebar-nav">
          <GlassButton
            v-for="name in componentList"
            :key="name"
            style="width: 100%; justify-content: start"
            :class="{ 'accent-btn': activeComponent === name }"
            @click="activeComponent = name"
          >
            {{ name }}
          </GlassButton>
        </div>
      </template>

      <template #body>
        <h2>{{ activeComponent }} Component Showcase</h2>

        <GlassTabStrip :autoSaveActiveTab="true" v-model="activeTab" :tabs="tabsData" />

        <GlassPanel v-if="activeTab === 'time'">
          <h3>Glassmorphic Analog Clocks with Timezone</h3>
          <div class="clock-showcase-grid">
            <div class="clock-item">
              <h4>Local Time</h4>
              <GlassClock :size="200" :is-dark="isDark" />
            </div>
            <div class="clock-item">
              <h4>New York (EST)</h4>
              <GlassClock :size="200" timezone="America/New_York" :is-dark="isDark" />
            </div>
          </div>

          <div class="clock-showcase-grid">
            <div class="clock-item">
              <GlassDigitalClock size="270px" :is-dark="isDark" title="Your location" />
            </div>
            <div class="clock-item">
              <GlassDigitalClock
                size="270px"
                timezone="America/New_York"
                title="New York"
                :is-dark="isDark"
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel v-if="activeTab === 'pickers'">
          <div class="component-grid">
            <div class="component-grid">
              <GlassDatePicker v-model="selectedDate" label="Pick a Date" :is-dark="isDark" />
              <GlassTimePicker v-model="selectedTime" label="Pick a Time" :is-dark="isDark" />
            </div>
          </div>
          <div class="component-grid">
            <div class="component-grid">
              <GlassColorPicker v-model="selectedColor" />
              <p>Selected Color: {{ selectedColor }}</p>
            </div>
          </div>
          <div class="component-grid">
            <div class="component-grid">
              <GlassDropdownColorPicker v-model="appSelectedColor" />
            </div>
          </div>
          <div class="component-grid">
            <div class="component-grid">
              <GlassCalendar v-model="selectedDate" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel v-if="activeTab === 'forms'">
          <h3>Input and Selection Components</h3>
          <div class="component-grid">
            <GlassInput v-model="inputName" label="Full Name" placeholder="John Doe" type="text" />
            <GlassInput
              v-model="inputEmail"
              label="Email Address"
              placeholder="name@example.com"
              type="email"
            />

            <GlassSelect
              v-model="selectedOption"
              label="Select a Framework"
              :options="selectOptions"
              placeholder="Choose one..."
            />

            <GlassComboBox
              v-model="selectedCombo"
              label="Search or Select"
              :options="selectOptions"
              placeholder="Search frameworks..."
            />
          </div>

          <GlassTextarea v-model="textAreaContent" label="Text Area" rows="5" />

          <div class="radio-group">
            <GlassRadio
              v-model="selectedLayout"
              value="desktop"
              name="layout"
              label="Desktop View"
              :is-dark="isDarkTheme"
              @change="handleLayoutChange"
            />

            <GlassRadio
              v-model="selectedLayout"
              value="tablet"
              name="layout"
              label="Tablet View"
              :is-dark="isDarkTheme"
              :disabled="true"
              @change="handleLayoutChange"
            />

            <GlassRadio
              v-model="selectedLayout"
              value="mobile"
              name="layout"
              label="Mobile View"
              :is-dark="isDarkTheme"
              @change="handleLayoutChange"
            />
          </div>
        </GlassPanel>

        <GlassPanel v-if="activeTab === 'controls'">
          <h3>Buttons, Toggles, and Sliders</h3>

          <h4>Buttons</h4>
          <div class="button-group">
            <GlassButton label="Desteictive" action="destructive" />
            <GlassButton label="Default" />
            <GlassButton label="Primary" icon="fas fa-magic" action="primary" />
            <GlassButton :key="name" @click="showWindow = true"> Show window </GlassButton>
            {{ showWindow }}
          </div>

          <div class="button-group">
            <GlassButton label="Small" size="sm" />
            <GlassButton icon="fas fa-times" size="lg" />
            <GlassButton
              image-url="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/apple-retro.svg"
              label="Apple"
              size="lg"
            />
            <GlassButton label="Disabled" disabled />
          </div>

          <div>
            <GlassActivityIndicator v-model="isOpLoading" size="sm" />
            <GlassActivityIndicator v-model="isOpLoading" size="md" />
            <GlassActivityIndicator v-model="isOpLoading" size="lg" />
          </div>

          <div class="app-icon-showcase">
            <h3>Icon from Font Awesome</h3>
            <GlassAppIcon icon="fas fa-satellite-dish" label="Signals" size="80px" />

            <div class="spacer"></div>

            <h3>Icon from Image URL (e.g., a Company Logo)</h3>
            <GlassAppIcon
              image-url="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/apple-music.svg"
              label="Music"
              size="100px"
            />

            <div class="spacer"></div>

            <h3>Image Icon (Disabled)</h3>
            <GlassAppIcon
              image-url="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/apple-retro.svg"
              label="Cloud Storage"
              size="60px"
              :disabled="true"
            />
          </div>

          <h4>Toggles</h4>
          <div class="button-group">
            <GlassToggle v-model="toggleState.small" size="sm" />
            <GlassToggle v-model="toggleState.medium" size="md" />
            <GlassToggle v-model="toggleState.large" size="lg" />
            <GlassToggle v-model="toggleState.disabled" disabled />
            {{ toggleState }}
          </div>

          <h4>Checkboxes</h4>
          <div class="button-group">
            <GlassCheckbox v-model="checkboxState.one" label="Option One" />
            <GlassCheckbox v-model="checkboxState.two" label="Option Two" />
            <GlassCheckbox v-model="checkboxState.disabled" label="Disabled" disabled />
          </div>

          <h4>Slider</h4>
          <div class="slider-group">
            <GlassSlider
              v-model="sliderValue"
              :min="0"
              :max="100"
              :step="1"
              ui-accent-color="#64b5f6"
            >
              <template #before>Blur ({{ sliderValue }})</template>
              <template #after><i class="fas fa-sliders-h"></i></template>
            </GlassSlider>
          </div>

          <h4>Progress Bar</h4>
          <div>
            <GlassProgressBar v-model="progressValue" :min="0" :max="200" />
            <input type="range" min="0" max="200" v-model.number="progressValue" />
          </div>

          <h4>Gauges</h4>
          <div>
            <GlassCircularGauge v-model="myGaugeValue" size="lg" :max="100" />

            <input type="range" min="0" max="100" v-model.number="myGaugeValue" />
          </div>

          <h4>Hi-Fi</h4>
          <div></div>
        </GlassPanel>

        <GlassPanel v-if="activeTab === 'scroll'">
          <GlassInfiniteScroll
            :fetch-data="mockDataFetcher"
            :page-size="10"
            blur="10px"
            height="250px"
          >
            <template #header> My Infinite Feed </template>

            <template #body="{ data: items, isLoading, hasMore }">
              <div v-for="item in items" :key="item.id" class="list-item">
                {{ item.content }}
              </div>

              <div v-if="isLoading && items.length === 0" class="initial-loading">
                <i class="fas fa-spinner fa-spin"></i> Initial Load...
              </div>
            </template>
          </GlassInfiniteScroll>
        </GlassPanel>

        <GlassPanel v-if="activeTab === 'layout'" title="Layout Showcase">
          <p>This is content inside a GlassPanel component.</p>
          <p>
            It can be used to group related controls or information with its own glassmorphic
            effect.
          </p>

          <GlassAudioPlayer
            @control-action="handlePlayerControl"
            @track-change="handleTrackChange"
            @seek="handleSeek"
          />

          <GlassContainer :border-radius="'20px'" :padding="'1rem'">
            <p>This content is inside the glass effect container.</p>

            <GlassList v-model="listItems" />
          </GlassContainer>
          <br />

          <GlassList v-model="listItems" />
        </GlassPanel>

        <GlassWindow v-model="showWindow" width="40vw" height="40vh">
          This panel uses the full v-model binding. Click the background or the 'x' to close it.
        </GlassWindow>
      </template>
      <template #footer>
        <GlassFooter :is-fixed="true" z-index="999">
          <template #left>
            <span style="font-size: 0.9em; opacity: 0.8">© 2025 GlassUI</span>
          </template>

          <template #center> </template>

          <template #right>
            <GlassAppIcon icon="fab fa-github" size="30px" />
          </template>
        </GlassFooter>
      </template>
    </GlassApp>

    <GlassModal
      v-model="showModal"
      title="App Settings"
      :is-windowed="true"
      :allow-full-screen="true"
      max-width="500px"
    >
      <template #body>
        <div class="component-grid">
          <GlassCheckbox v-model="isDark" label="Enable Dark Mode" />
          <GlassCheckbox v-model="isStickySidebar" label="Sticky Sidebar" disabled />
        </div>
        <GlassSlider v-model="blurSetting" :min="0" :max="20" :step="1">
          <template #left-control>Blur Level ({{ blurSetting }}px)</template>
        </GlassSlider>
      </template>
      <template #footer>
        <GlassButton>OK</GlassButton>
      </template>
    </GlassModal>
    <br />
    <br /><br /><br />
  </div>
</template>

<script setup lang="ts">
import { GlassComponents } from '@/components/index'
import { onMounted, reactive, ref } from 'vue'

// Import all required components for direct use in template
import GlassApp from '@/components/GlassApp.vue'
import GlassButton from '@/components/GlassButton.vue'
import GlassCheckbox from '@/components/GlassCheckbox.vue'
import GlassClock from '@/components/GlassClock.vue'
import GlassComboBox from '@/components/GlassComboBox.vue'
import GlassDatePicker from '@/components/GlassDatePicker.vue'
import GlassDigitalClock from '@/components/GlassDigitalClock.vue'
import GlassInfiniteScroll from '@/components/GlassInfiniteScroll.vue'
import GlassInput from '@/components/GlassInput.vue'
import GlassModal from '@/components/GlassModal.vue'
import GlassPanel from '@/components/GlassPanel.vue'
import GlassSelect from '@/components/GlassSelect.vue'
import GlassSlider from '@/components/GlassSlider.vue'
import GlassTabStrip from '@/components/GlassTabStrip.vue'
import GlassTextarea from '@/components/GlassTextarea.vue'
import GlassThemeChooser from '@/components/GlassThemeChooser.vue'
import GlassTimePicker from '@/components/GlassTimePicker.vue'
import GlassToggle from '@/components/GlassToggle.vue'
import GlassWindow from '@/components/GlassWindow.vue'

// --- Mock Data Setup ---
let totalItems = 100
// Defines the result structure for the data function
interface MockItem {
  id: number
  content: string
}
interface DataPageResult<T> {
  data: T[]
  hasMore: boolean
  error?: string
}

// Define the array using the
// --- Type Definitions ---
interface SelectOption {
  label: string
  value: string
}

interface Tab {
  value: string
  text: string
  icon: string
}

// --- Reactive State ---

// Audio Player Status
const playerStatus = ref({
  action: 'Initializing...',
  details: null,
  trackId: 1, // Start with the first track ID
})

const volume = ref(50)
const treble = ref(0)
const bass = ref(0)

const isOpLoading = ref(true)
const selectedColor = ref('#1e90ff') // Initial color
const appSelectedColor = ref('#d6d3ff') // Initial color
const isDark = ref(false)
const showModal = ref(false)
const activeComponent = ref('GlassApp')
const activeTab = ref('forms')
const sliderValue = ref(50)
const blurSetting = ref(10)
const isStickySidebar = ref(true)
const showWindow = ref(false)
const myGaugeValue = ref(75)
const progressValue = ref(75)

// Form data states
const inputName = ref('')
const inputEmail = ref('')
const textAreaContent = ref('')
const selectedOption = ref<string | null>(null)
const selectedCombo = ref('vue')
const selectedDate = ref('2023-11-01')
const selectedTime = ref('10:30')

const selectedLayout = ref('desktop')
const isDarkTheme = ref(false)

const handleLayoutChange = (newValue: string | number | boolean) => {
  console.log(`Radio option changed! New value: ${newValue}`)
  // Perform side effects here
}

// Grouped reactive states
const toggleState = reactive({
  small: false,
  medium: true,
  large: false,
  disabled: false,
})

const checkboxState = reactive({
  one: false,
  two: true,
  disabled: false,
})

const listItems = [
  { id: 1, label: 'View Profile', icon: 'fas fa-user-circle' },
  { id: 2, label: 'Change Password', icon: 'fas fa-lock' },
  { id: 3, label: 'Log Out', icon: 'fas fa-sign-out-alt' },
  { id: 4, label: 'Subscription (Disabled)', icon: 'fas fa-star' },
]

const handlePlayerControl = (action) => {
  playerStatus.value.action = action
  playerStatus.value.details = action === 'play' ? 'Playback started' : action
}

const handleTrackChange = (trackId) => {
  playerStatus.value.action = 'track-change'
  playerStatus.value.details = `Switched to track ID: ${trackId}`
  playerStatus.value.trackId = trackId
}

const handleSeek = (seekData) => {
  playerStatus.value.action = 'seek'
  playerStatus.value.details = `Seeked to ${seekData.time}s (${(seekData.normalizedTime * 100).toFixed(2)}%)`
}

// --- Static Data ---
const componentList: string[] = Object.keys(GlassComponents)

const tabsData: Tab[] = [
  { value: 'forms', text: 'Forms', icon: 'fas fa-pen-to-square' },
  { value: 'controls', text: 'Controls', icon: 'fas fa-sliders-h' },
  { value: 'pickers', text: 'Pickers', icon: 'fas fa-sliders-h' },
  { value: 'layout', text: 'Layout', icon: 'fas fa-layer-group' },
  { value: 'time', text: 'Time', icon: 'fas fa-clock' },
  { value: 'scroll', text: 'Infinite scroll', icon: 'fa-solid fa-table' },
]

const selectOptions: SelectOption[] = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Ember.js', value: 'ember' },
]

const mockDataFetcher = (page: number, pageSize: number): Promise<DataPageResult<MockItem>> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Logic for determining the range of items to return
      const start = (page - 1) * pageSize
      const end = page * pageSize
      if (start >= totalItems) {
        // Condition for "No More Data"
        return resolve({
          data: [],
          hasMore: false,
        })
      }
      // Generate the data chunk
      const chunk: MockItem[] = []
      for (let i = start; i < end && i < totalItems; i++) {
        chunk.push({
          id: i + 1,
          content: `This is the liquid glass item number ${i + 1}.`,
        })
      }
      // Condition for successful data return
      resolve({
        data: chunk,
        hasMore: end < totalItems,
      })
    }, 800) // 800ms delay for simulation
  })
}

// --- Lifecycle ---
onMounted(() => {
  isDark.value = document.body.classList.contains('dark-mode')
})
</script>

<style scoped>
.clock-showcase-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  padding: 2rem;
  justify-content: space-around;
  align-items: flex-end;
}

.clock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.clock-item h4 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}

.slider-group {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-header {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.glass-appbar-icon {
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.glass-appbar-icon:hover {
  color: #4caf50;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
}

/* Scoped style for the usage component */
.info-display {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
}

.background-image-container {
  height: 500px;
  width: 100%;
  background: url('path/to/your/image.jpg') center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-item {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.initial-loading {
  text-align: center;
  padding: 20px;
}
</style>
