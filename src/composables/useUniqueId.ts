// useUniqueId.js

import { computed, getCurrentInstance } from 'vue'

// Global counter ensures unique IDs across the entire application
let globalUniqueIdCounter = 0

/**
 * Custom composable to generate a stable, unique ID for a component instance.
 * Useful for linking labels to inputs (accessibility).
 * @returns {Object} An object containing the computed property 'uniqueId'.
 */
export function useUniqueId() {
  const instance = getCurrentInstance()

  // 1. Define the uniqueId as a computed property
  const uniqueId = computed(() => {
    if (!instance) {
      console.log('useUniqueId must be called within a component setup function.')
      return 'no-id'
    }

    // 2. Check if the ID has already been generated and stored on the instance
    if (!instance.appUniqueId) {
      // Get the component name or fall back to 'component'
      const name = instance.type.name || 'component'

      // Generate and store the ID on the instance itself to ensure stability across renders
      instance.appUniqueId = `${name}-${++globalUniqueIdCounter}`
    }
    return instance.appUniqueId
  })
  return uniqueId.value ?? uniqueId
}
