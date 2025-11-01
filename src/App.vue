<template>
  <div :class="{ 'dark-mode': isDark }">
    <GlassApp sidebar-dock="left" sidebar-width="260px" :is-dark="isDark" :sidebar-sticky="true">
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

      <template #main-content>
        <h2>{{ activeComponent }} Component Showcase</h2>

        <GlassTabStrip v-model="activeTab" :tabs="tabsData" />

        <GlassContentPanel v-if="activeTab === 'time'" style="padding: 2rem; height: 100%">
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
        </GlassContentPanel>

        <GlassContentPanel v-if="activeTab === 'pickers'" style="padding: 2rem">
          <div class="component-grid">
            <div class="component-grid">
              <GlassDatePicker v-model="selectedDate" label="Pick a Date" :is-dark="isDark" />
              <GlassTimePicker v-model="selectedTime" label="Pick a Time" :is-dark="isDark" />
            </div>
          </div>
        </GlassContentPanel>

        <GlassContentPanel v-if="activeTab === 'forms'" style="padding: 2rem">
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
        </GlassContentPanel>

        <GlassContentPanel v-if="activeTab === 'controls'" style="padding: 2rem">
          <h3>Buttons, Toggles, and Sliders</h3>

          <h4>Buttons</h4>
          <div class="button-group">
            <GlassButton label="Default" />
            <GlassButton label="Primary" icon="fas fa-magic" />
            <GlassButton label="Small" size="sm" />
            <GlassButton icon="fas fa-times" size="lg" />
            <GlassButton label="Disabled" disabled />
          </div>

          <h4>Toggles</h4>
          <div class="button-group">
            <GlassToggle v-model="toggleState.small" size="sm" />
            <GlassToggle v-model="toggleState.medium" size="md" />
            <GlassToggle v-model="toggleState.large" size="lg" />
            <GlassToggle v-model="toggleState.disabled" disabled />
          </div>

          <h4>Checkboxes</h4>
          <div class="button-group">
            <GlassCheckbox v-model="checkboxState.one" label="Option One" />
            <GlassCheckbox v-model="checkboxState.two" label="Option Two" />
            <GlassCheckbox v-model="checkboxState.disabled" label="Disabled" disabled />
          </div>

          <h4>Slider</h4>
          <div class="slider-group">
            <GlassSlider v-model="sliderValue" :min="0" :max="100" :step="1" accent-color="#64b5f6">
              <template #left-control>Blur ({{ sliderValue }})</template>
              <template #right-control><i class="fas fa-sliders-h"></i></template>
            </GlassSlider>
          </div>
        </GlassContentPanel>

        <GlassPanel
          v-if="activeTab === 'layout'"
          title="Layout Showcase"
          style="margin-top: 1.5rem"
        >
          <p>This is content inside a GlassPanel component.</p>
          <p>
            It can be used to group related controls or information with its own glassmorphic
            effect.
          </p>
        </GlassPanel>
      </template>
    </GlassApp>

    <GlassModal
      v-model="showModal"
      title="App Settings"
      :is-windowed="true"
      :allow-full-screen="true"
      max-width="500px"
    >
      <div class="component-grid">
        <GlassCheckbox v-model="isDark" label="Enable Dark Mode" />
        <GlassCheckbox v-model="isStickySidebar" label="Sticky Sidebar" disabled />
      </div>
      <GlassSlider v-model="blurSetting" :min="0" :max="20" :step="1">
        <template #left-control>Blur Level ({{ blurSetting }}px)</template>
      </GlassSlider>
    </GlassModal>
    <br />
    <br /><br /><br />rro
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
import GlassContentPanel from '@/components/GlassContentPanel.vue'
import GlassDatePicker from '@/components/GlassDatePicker.vue'
import GlassDigitalClock from '@/components/GlassDigitalClock.vue'
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
const isDark = ref(false)
const showModal = ref(false)
const activeComponent = ref('GlassApp')
const activeTab = ref('forms')
const sliderValue = ref(50)
const blurSetting = ref(10)
const isStickySidebar = ref(true)

// Form data states
const inputName = ref('')
const inputEmail = ref('')
const textAreaContent = ref('')
const selectedOption = ref<string | null>(null)
const selectedCombo = ref('vue')
const selectedDate = ref('2023-11-01')
const selectedTime = ref('10:30')

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

// --- Static Data ---
const componentList: string[] = Object.keys(GlassComponents)

const tabsData: Tab[] = [
  { value: 'forms', text: 'Forms', icon: 'fas fa-pen-to-square' },
  { value: 'controls', text: 'Controls', icon: 'fas fa-sliders-h' },
  { value: 'pickers', text: 'Pickers', icon: 'fas fa-sliders-h' },
  { value: 'layout', text: 'Layout', icon: 'fas fa-layer-group' },
  { value: 'time', text: 'Time', icon: 'fas fa-clock' },
]

const selectOptions: SelectOption[] = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Ember.js', value: 'ember' },
]

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
</style>
