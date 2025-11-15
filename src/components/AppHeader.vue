<template>
  <header class="app-header-component">
    <div class="header-content">
      <div class="header-section left-section">
        <button
          v-if="toggleLeft && isLeftOpen !== undefined"
          @click="toggleLeft"
          class="sidebar-toggle-button"
          :class="{ 'rotate-180': !isLeftOpen }"
          aria-label="Toggle left sidebar"
        >
          <i class="fa-solid fa-arrow-right-arrow-left"></i>
        </button>
        <h1 class="header-title">{{ title }}</h1>
      </div>

      <div class="header-section right-section">
        <nav class="nav-links">
          <slot name="nav-links"></slot>
        </nav>

        <ThemeToggle />
        <button
          v-if="toggleRight && isRightOpen !== undefined"
          @click="toggleRight"
          class="sidebar-toggle-button"
          :class="{ 'rotate-180': !isRightOpen }"
          aria-label="Toggle right sidebar"
        >
          <i class="fa-solid fa-arrow-right-arrow-left"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue' // Assuming ThemeToggle is a sibling component

const props = defineProps({
  title: { type: String, default: 'App Title' },
  toggleLeft: { type: Function, required: false },
  isLeftOpen: { type: Boolean, required: false },
  toggleRight: { type: Function, required: false },
  isRightOpen: { type: Boolean, required: false },
})
</script>

<style scoped lang="scss">
/* Scoped styles for the header component structure */
/* The app-header-component class is expected to be styled by GlassAppView.vue */

.header-content {
  max-width: 1280px; /* Equivalent to max-w-7xl */
  margin: 0 auto;
  padding: 0 1.5rem; /* Equivalent to px-6 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-section {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Equivalent to space-x-6 */
}
.left-section {
  gap: 0.75rem; /* Equivalent to space-x-3 */
}
.header-title {
  font-size: 1.5rem; /* Equivalent to text-2xl */
  font-weight: 600; /* Equivalent to font-semibold */
  letter-spacing: -0.025em; /* Equivalent to tracking-tight */
}
.nav-links {
  display: none; /* Equivalent to hidden */
  gap: 1.5rem;
}
@media (min-width: 768px) {
  /* Equivalent to md:flex */
  .nav-links {
    display: flex;
  }
}

/* Sidebar Toggle Button Styles */
.sidebar-toggle-button {
  padding: 0.5rem; /* Equivalent to p-2 */
  border-radius: 50%; /* Equivalent to rounded-full */
  transition: transform 0.3s ease;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.sidebar-toggle-button:hover {
  background-color: var(--glass-toggle-hover-bg, rgba(255, 255, 255, 0.1));
}
.rotate-180 {
  transform: rotate(180deg);
}
.toggle-icon {
  width: 1.5rem; /* w-6 h-6 */
  height: 1.5rem;
  color: inherit;
}

/* Right Section spacing */
.right-section {
  gap: 1.5rem;
}
</style>
