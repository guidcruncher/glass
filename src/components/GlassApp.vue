<template>
  <div
    :class="[
      'glass-app',
      {
        'glass-app--sidebar-left': sidebarDock === 'left',
        'glass-app--sidebar-right': sidebarDock === 'right',
        'glass-app--sidebar-collapsed': !isSidebarOpen,
      },
    ]"
    :style="{ '--sidebar-width': sidebarWidth }"
  >
    <GlassAppBar v-bind="attrs" ref="appBarRef" @toggle-drawer="handleSideBarClick">
      <template #left>
        <GlassButton
          class="glass-appbar-btn menu-toggle-btn"
          @click="handleSideBarClick"
          aria-label="Toggle menu"
          size="sm"
          icon-only
        >
          <i v-if="isMobile" :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          <i v-else :class="isSidebarOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"></i>
        </GlassButton>
        <slot name="appbar-left" />
      </template>
      <template #middle>
        <slot name="appbar-middle" />
      </template>
      <template #right>
        <slot name="appbar-right" />
      </template>
    </GlassAppBar>
    <div class="glass-app__body">
      <GlassSidebar
        v-bind="attrs"
        class="glass-app__sidehar"
        :dock="sidebarDock"
        :is-open="isSidebarOpen"
        :width="sidebarWidth"
        :top-offset="appBarHeight"
        :is-drawer="isMobile"
      >
        <div class="glass-app__padding_top">&nbsp;</div>
        <slot name="sidebar" />
        <div class="glass-app__padding_bottom">&nbsp;</div>
      </GlassSidebar>
      <main class="glass-app__main-content">
        <slot name="body" />
        <div class="footer-padding">&nbsp;</div>
      </main>
    </div>
    <div class="fixed-bottom">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import GlassAppBar from './GlassAppBar.vue'
import GlassButton from './GlassButton.vue'
import GlassSidebar from './GlassSidebar.vue'

const SIDEBARSTATE_STORAGE_KEY = 'glassApp_sidebarOpen'

const attrs = useAttrs()

interface Props {
  sidebarDock?: 'left' | 'right'
  sidebarWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  sidebarDock: 'left',
  sidebarWidth: '250px',
})

// Fix: Correctly type the ref to the component instance
const appBarRef = ref<InstanceType<typeof GlassAppBar> | null>(null)
const appBarHeight = ref('0px')
const isMobile = ref(false)
const isSidebarOpen = ref(false)

const measureAppBarHeight = () => {
  if (appBarRef.value?.$el) {
    appBarHeight.value = `${(appBarRef.value.$el as HTMLElement).offsetHeight}px`
  }
}

const closeSideBar = () => {
  isSidebarOpen.value = false
  localStorage.setItem(SIDEBARSTATE_STORAGE_KEY, 'false')
}

const handleSideBarClick = () => {
  const newState = !isSidebarOpen.value
  isSidebarOpen.value = newState
  localStorage.setItem(SIDEBARSTATE_STORAGE_KEY, JSON.stringify(newState))
}

const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768

  if (wasMobile && !isMobile.value) {
    // Reads the stored state when transitioning from mobile to desktop
    const storedState = localStorage.getItem(SIDEBARSTATE_STORAGE_KEY) ?? 'false'
    isSidebarOpen.value = JSON.parse(storedState)
  } else if (!wasMobile && isMobile.value) {
    // Closes the sidebar when transitioning from desktop to mobile
    isSidebarOpen.value = false
  }

  nextTick(measureAppBarHeight)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)

  const storedState = localStorage.getItem(SIDEBARSTATE_STORAGE_KEY) ?? 'false'
  isSidebarOpen.value = JSON.parse(storedState)

  nextTick(measureAppBarHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden !important;
}

/* Optional: Ensure the app mounting point fills the space too (e.g., #app) */
#app {
  height: 100vh;
  overflow: hidden !important;
}

.glass-app {
  --sidebar-width: 250px;
  --appbar-height: 60px; /* Placeholder, updated by JS */
}

/* The SCSS files handle the margin-left/right based on the parent classes 
.glass-app--sidebar-left and .glass-app--sidebar-collapsed
*/
</style>
