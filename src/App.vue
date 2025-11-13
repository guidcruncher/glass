<template>
  <GlassAppView
    initial-theme="dark"
    headerTitle="Glass UI Demo App"
    backgroundImageUrl="https://wallpapercg.com/download/ipados-26-2064x2752-28525.jpg"
  >
    <template #header-nav-links>
      <a
        href="#"
        class="text-sm font-medium hover:opacity-100 opacity-70 transition"
        >Dashboard</a
      >
      <a
        href="#"
        class="text-sm font-medium hover:opacity-100 opacity-70 transition"
        >Settings</a
      >
    </template>

    <template #left>
      <GlassSidebar />
    </template>

    <template #bottom>
      <GlassFooter />
    </template>

    <template #body>
      <div class="p-8 space-y-12">
        <h1 class="text-4xl font-bold border-b-2 pb-2 border-accent-color/50">
          Glassmorphism Component Showcase
        </h1>

        <GlassTabStrip
          v-model="selectedTab"
          :tabs="tabItems"
          labelField="name"
          keyField="id"
        />

        <div v-if="selectedTab === 'inputs_pickers'" class="space-y-8">
          <h2 class="text-3xl font-semibold opacity-90">Inputs & Pickers</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassSlider v-model="sliderValue" />

            <TimePicker />

            <GlassDatePicker v-model="selectedDate" />

            <GlassColorPicker v-model="pageColor" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <GlassPanel>
              <h3 class="text-xl font-semibold">Interaction Demo</h3>
              <p class="text-sm opacity-80">Test buttons and modals.</p>
              <div class="flex flex-col space-y-4 pt-4">
                <GlassButton variant="primary" @click="modalOpen = true">
                  Open Glass Modal
                </GlassButton>
                <GlassButton variant="secondary">
                  Secondary Button
                </GlassButton>
                <GlassButton variant="destructive">
                  <span class="flex items-center space-x-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                <GlassInput
                  v-model="textValue"
                  placeholder="Type something..."
                />
                <GlassTextarea
                  v-model="textValue"
                  placeholder="Type something..."
                />

                <GlassCheckbox v-model="checkbox1">
                  Enable Feature X
                </GlassCheckbox>

                <GlassRadioGroup
                  v-model="selectedFruit"
                  name="fruit-select"
                  :theme="theme"
                  :disabled="groupDisabled"
                  glassi
                >
                  <GlassRadioItem value="apple" label="Apple" />
                  <GlassRadioItem value="banana" label="Banana" />

                  <GlassRadioItem
                    value="cherry"
                    label="Cherry"
                    :disabled="true"
                  />

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
        </div>

        <div v-if="selectedTab === 'displays_indicators'" class="space-y-8">
          <h2 class="text-3xl font-semibold opacity-90">
            Displays & Indicators
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <GlassCalendar />

            <GlassDropdown />

            <GlassGauge />

            <GlassProgressBar :progress-value="progressValue" />
          </div>
        </div>

        <div v-if="selectedTab === 'clocks_geo'" class="space-y-8">
          <h2 class="text-3xl font-semibold opacity-90">Clocks & Geo</h2>
          <h3 class="text-xl font-medium opacity-80">Digital Clocks (World)</h3>
          <div class="flex justify-center flex-wrap gap-8">
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
          <h3 class="text-xl font-medium opacity-80">Analog Clocks</h3>
          <div class="flex justify-center flex-wrap gap-8">
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
          <h3 class="text-xl font-medium opacity-80">Global GeoClock</h3>
          <div>
            <GeoClock
              :width="600"
              twilightLevel="nautical"
              :height="300"
              :marker-lat="51.477928"
              :marker-lon="-0.001545"
            />
          </div>
        </div>
      </div>
    </template>
  </GlassAppView>

  <AppleGlassModal v-model="modalOpen">
    <template #title>Configuration</template>
    <p>This is a floating glass modal component.</p>
    <template #footer>
      <GlassButton variant="primary" @click="modalOpen = false"
        >Close</GlassButton
      >
    </template>
  </AppleGlassModal>
</template>

<script setup>
import { ref } from "vue";

// --- Layout Components ---
// 1. v-model State
const selectedFruit = ref("banana"); // 'banana' will be initially selected
// 3. Disabled State
const groupDisabled = ref(false);
const textValue = ref("");

const sliderValue = ref(75);
const selectedDate = ref(new Date());
// Updated initial tab state to match the new tab structure
const selectedTab = ref("inputs_pickers");
const modalOpen = ref(false);
const progressValue = ref(65);
const checkbox1 = ref(true);
const radioValue = ref("A");
const pageColor = ref("#1E90FF");

// Updated tab items to reflect logical groupings
const tabItems = ref([
  { id: "inputs_pickers", name: "Inputs & Pickers" },
  { id: "displays_indicators", name: "Displays & Indicators" },
  { id: "clocks_geo", name: "Clocks & Geo" },
]);

// Note: The TimePicker, GlassDropdown, GlassCalendar, GlassGauge,
// and GlassFlipClock components manage their own internal state.
</script>

<style lang="scss">
/* Global CSS Variables for the Theme and Glass Effects. 
  These define the theme structure used by the SASS refactoring in the components.
  These variables should ideally be defined in a main CSS file, 
  but are included here for a self-contained demo.
*/
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
  font-family: "Inter", sans-serif;
  color: var(--text-color-base);
  background-image: var(--page-bg-url);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
