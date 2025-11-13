<template>
  <GlassAppView
    initial-theme="dark"
    headerTitle="Glass UI Demo App"
    backgroundImageUrl="https://wallpapercg.com/download/ipados-26-2064x2752-28525.jpg"
  >
    <template #header-nav-links>
      <a href="#" class="text-sm font-medium hover:opacity-100 opacity-70 transition">Dashboard</a>
      <a href="#" class="text-sm font-medium hover:opacity-100 opacity-70 transition">Settings</a>
    </template>

    <template #left>
      <GlassSidebar />
    </template>

    <template #bottom>
      <GlassFooter />
    </template>

    <template #body>
      <div class="p-8 space-y-12">
        <!-- New: iPad OS Tab Panel Control -->
        <GlassTabContainer v-model="selectedTab" :tabs="tabItems" :full-width="false">
          <!-- Tab 1: Inputs & Pickers -->
          <template #inputs_pickers>
            <h2 class="text-3xl font-semibold opacity-90 mb-6">Inputs & Pickers</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassSlider v-model="sliderValue" />

              <TimePicker />

              <GlassDatePicker v-model="selectedDate" />

              <GlassColorPicker v-model="pageColor" />

              <GlassColorPalette v-model="pageColor" :is-dark="true" :picker-size="350" />
              <p>
                Selected Color: <strong>{{ pageColor }}</strong>
              </p>
            </div>

            <!-- Buttons and Inputs Panel -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
              <GlassPanel>
                <h3 class="text-xl font-semibold">Interaction Demo</h3>
                <p class="text-sm opacity-80">Test buttons and modals.</p>
                <div class="flex flex-col space-y-4 pt-4">
                  <GlassButton variant="primary" @click="modalOpen = true">
                    Open Glass Modal
                  </GlassButton>
                  <GlassButton variant="secondary"> Secondary Button </GlassButton>
                  <GlassButton variant="destructive">
                    <span class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span>Glass Button with Icon</span>
                    </span>
                  </GlassButton>
                </div>
              </GlassPanel>

              <GlassPanel>
                <h3 class="text-xl font-semibold">Checkboxes & Radios</h3>
                <div class="space-y-4 mt-4">
                  <GlassCheckbox v-model="checkbox1"> Enable Feature X </GlassCheckbox>

                  <GlassRadioGroup
                    v-model="selectedFruit"
                    name="fruit-select"
                    :theme="theme"
                    :disabled="groupDisabled"
                  >
                    <GlassRadioItem value="apple" label="Apple" />
                    <GlassRadioItem value="banana" label="Banana" />

                    <GlassRadioItem value="cherry" label="Cherry" :disabled="true" />

                    <GlassRadioItem value="grape" label="Grape" />
                  </GlassRadioGroup>

                  <GlassRadioGroup name="option" v-model="radioValue" value="A">
                    Select Option A
                  </GlassRadioGroup>
                  <GlassRadioGroup name="option" v-model="radioValue" value="B">
                    Select Option B
                  </GlassRadioGroup>
                </div>
              </GlassPanel>
            </div>
          </template>

          <!-- Tab 2: Displays & Indicators -->
          <template #displays_indicators>
            <h2 class="text-3xl font-semibold opacity-90 mb-6">Displays & Indicators</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <GlassCalendar />

              <GlassDropdown />

              <GlassGauge />

              <GlassProgressBar :progress-value="progressValue" />
            </div>
          </template>

          <!-- Tab 3: Clocks & Geo -->
          <template #clocks_geo>
            <h2 class="text-3xl font-semibold opacity-90 mb-6">Clocks & Geo</h2>
            <!-- Digital Clocks -->
            <h3 class="text-xl font-medium opacity-80 mt-4">Digital Clocks (World)</h3>
            <div class="flex justify-center flex-wrap gap-8 mt-4">
              <div>
                <GlassDigitalClock size="sm" timezone="Europe/London" />
              </div>
              <div>
                <GlassDigitalClock size="md" timezone="America/New_York" />
              </div>
              <div>
                <GlassDigitalClock size="lg" timezone="Asia/Tokyo" />
              </div>
            </div>
            <!-- Analog Clocks -->
            <h3 class="text-xl font-medium opacity-80 mt-8">Analog Clocks</h3>
            <div class="flex justify-center flex-wrap gap-8 mt-4">
              <div>
                <AnalogClock size="300px" timeZone="America/Los_Angeles" />
              </div>
              <div>
                <AnalogClock size="300px" timeZone="Europe/Madrid" />
              </div>
              <div>
                <AnalogClock size="300px" timeZone="Asia/Tokyo" />
              </div>
            </div>
            <!-- Geo Clock -->
            <h3 class="text-xl font-medium opacity-80 mt-8">Global GeoClock</h3>
            <div class="mt-4">
              <GeoClock
                :width="600"
                twilightLevel="nautical"
                :height="300"
                :marker-lat="51.477928"
                :marker-lon="-0.001545"
              />
            </div>
          </template>
        </GlassTabContainer>
        <!-- End of GlassTabContainer -->
      </div>
    </template>
  </GlassAppView>

  <AppleGlassModal v-model="modalOpen">
    <template #title>Configuration</template>
    <p>This is a floating glass modal component.</p>
    <template #footer>
      <GlassButton variant="primary" @click="modalOpen = false">Close</GlassButton>
    </template>
  </AppleGlassModal>
</template>

<script setup>
import { ref } from 'vue'

// --- Demo State ---
const selectedFruit = ref('banana')
const groupDisabled = ref(false)
const sliderValue = ref(75)
const selectedDate = ref(new Date())
const selectedTab = ref('inputs_pickers')
const modalOpen = ref(false)
const progressValue = ref(65)
const checkbox1 = ref(true)
const radioValue = ref('A')
const pageColor = ref('#1E90FF')

// Updated tab items with required 'icon' property for the new component
const tabItems = ref([
  { id: "inputs_pickers", name: "inputs_pickers", label: "Inputs & Pickers", icon: "sliders" }, // Using sliders for inputs
  { id: "displays_indicators", name: "displays_indicators", label: "Displays & Indicators", icon: "tv" }, // Using tv for displays
  { id: "clocks_geo", name: "clocks_geo", label: "Clocks & Geo", icon: "globe" }, // Using globe for geo/clocks
]);

// Note: The TimePicker, GlassDropdown, GlassCalendar, GlassGauge,
// and GlassFlipClock components manage their own internal state.
</script>

<style lang="scss">
/* Global CSS Variables for the Theme and Glass Effects. */
:root {
  // --- ACCENT/THEME COLORS ---
  --accent-color: #007aff; // Blue for dark mode
  --accent-color-light: #007aff; // Blue for light mode

  // --- GLASSMOPHISM BASE ---
  --glass-blur: 14px;
  --glass-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

  // --- DARK MODE (Default) ---
  --glass-bg-base: rgba(30, 30, 30, 0.4);
  --glass-border-color: rgba(255, 255, 255, 0.15);
  --text-color-base: #f9fafb; // light text
}

.light {
  // --- LIGHT MODE OVERRIDES ---
  --glass-bg-base: rgba(255, 255, 255, 0.65);
  --glass-border-color: rgba(0, 0, 0, 0.15);
  --glass-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  --text-color-base: #111827; // dark text
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-color-base);
  background-image: var(--page-bg-url);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
