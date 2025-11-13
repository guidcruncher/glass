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

    <!-- Tab Content Area - moved slightly up with a negative margin to visually connect -->
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
  /* CHANGE 1: Remove bottom corners from container to keep content square below tabs */
  border-radius: 1.5rem 1.5rem 0 0; 
  overflow: hidden;
  /* CHANGE 2: Remove bottom padding from container to push tabs to the very edge */
  padding: 2px 2px 0 2px;
  position: relative;
  z-index: 10; /* Ensure the tab strip is above the content panel */
  height:40px;
}

/* 2. Individual Tab Button Styling */
.tab-item {
  display: flex;
  float: left;
  height: 40px ;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  /* Retain square bottom for active tab */
  border-radius: 1rem 1rem 0 0;
  flex: 1 1 auto;
  min-width: fit-content;
  justify-content: center;
}

/* Inactive State: Transparent with hover */
.inactive-tab {
  background-color: transparent;
  color: var(--text-color-base);
  /* Add bottom border to inactive tabs to separate them from the container border */
  border-bottom: 2px solid transparent; 
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
  /* IMPORTANT: Remove the border appearance by matching the color of the content panel base */
  border-bottom: 2px solid var(--accent-color); 
}

/* 3. Glass Content Panel (optional, but good for consistency) */
.glass-content-panel {
  background-color: var(--glass-bg-base);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-color);
  box-shadow: var(--glass-shadow);
  /* CHANGE 3: Remove top border radius to connect to the square bottom of the container */
  border-radius: 0 0 1rem 1rem;
  /* CHANGE 4: Add negative top margin to visually overlap the gap created by padding in container */
  margin-top: -1px; 
  position: relative;
  z-index: 5;
}
</style>


 
