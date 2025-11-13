<script setup lang="ts">
import { computed, ref } from 'vue';

// Define the structure for a single tab item
interface TabItem {
  label: string;
  name: string; // The unique name, used for v-model and slot name
  icon: string; // FA class suffix (e.g., 'house', 'gear')
}

// Define component props using Vue's runtime declaration
const props = defineProps<{
  modelValue: string; // The currently active tab name
  tabs: TabItem[]; // The list of tabs
  fullWidth?: boolean; // Controls whether to expand to full width or be contained
}>();

// Define emitted events
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Computed property for the currently selected tab name
const selectedTabName = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// Function to handle tab click
const selectTab = (name: string) => {
  if (name !== selectedTabName.value) {
    selectedTabName.value = name;
  }
};

</script>

<template>
  <div :class="['space-y-6', fullWidth ? 'w-full' : 'w-full lg:max-w-4xl lg:mx-auto']">
    <!-- iPad OS Style Tab Strip -->
    <div class="glass-tabstrip-container">
      <!-- This wrapper ensures horizontal flow and scrolling -->
      <div class="flex flex-nowrap space-x-2 p-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="selectTab(tab.name)"
          :aria-selected="tab.name === selectedTabName"
          role="tab"
          :tabindex="tab.name === selectedTabName ? 0 : -1"
          :class="[
            'tab-item',
            tab.name === selectedTabName ? 'active-tab' : 'inactive-tab'
          ]"
        >
          <!-- Font Awesome <i> tag replacement -->
          <i :class="['fa-solid', `fa-${tab.icon}`, 'w-4', 'h-4', 'flex-shrink-0']" aria-hidden="true"></i>

          <!-- Use flex-grow for responsive label width but ensure it's min-width is zero -->
          <span class="text-sm font-medium whitespace-nowrap min-w-0">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content Area -->
    <div class="glass-content-panel p-6 sm:p-8 rounded-2xl min-h-[300px]">
      <template v-for="tab in tabs" :key="tab.name">
        <!-- Renders the specific named slot only if it matches the active tab -->
        <slot v-if="tab.name === selectedTabName" :name="tab.name" />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Custom utility to hide the horizontal scrollbar but allow scrolling */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 1. Glass Tab Strip Container */
.glass-tabstrip-container {
  /* Use global variables for glassmorphism effect */
  background-color: var(--glass-bg-base);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-color);
  box-shadow: var(--glass-shadow);
  border-radius: 1.5rem 1.5rem 0 0;
  overflow: hidden;
  padding: 2px;
}

/* 2. Individual Tab Button Styling */
.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Retained 4px vertical padding (4px top + 4px bottom) + 16px icon = 24px total height */
  padding: 4px 12px; 
  cursor: pointer;
  float:left;
  height:40px;
  transition: all 0.2s ease-in-out;
  /* CHANGE: Applied radius only to top corners for square bottom */
  border-radius: 1rem 1rem 0 0;
  /* Ensure no wrapping and flexible sizing */
  flex: 1 1 auto;
  min-width: fit-content;
  justify-content: center;
}

/* Inactive State: Transparent with hover */
.inactive-tab {
  background-color: transparent;
  color: var(--text-color-base);
}

/* Hover effect for inactive tabs */
.inactive-tab:hover {
  background-color: var(--glass-border-color);
  opacity: 0.9;
}

/* Active State: Uses the accent color as a solid background */
.active-tab {
  background-color: var(--accent-color);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 122, 255, 0.4);
}

/* 3. Glass Content Panel (optional, but good for consistency) */
.glass-content-panel {
  background-color: var(--glass-bg-base);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-color);
  box-shadow: var(--glass-shadow);
  border-radius: 1rem; /* Rounded corners for the content panel */
}
</style>

