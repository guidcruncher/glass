import { onMounted, onUnmounted } from 'vue'

/**
 * A composable function to listen for the Escape key press globally.
 *
 * @param {Function} handler The function to execute when the Escape key is pressed.
 * @param {boolean} [isActive=true] A flag to enable/disable the listener.
 */
export function useEscapeKey(handler, isActive = true) {
  const handleKeydown = (event) => {
    // Only execute the handler if the listener is active and the key is 'Escape'
    if (isActive && event.key === 'Escape') {
      event.preventDefault()
      handler()
    }
  }

  // Attach the listener when the component mounts
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    console.log('Escape key listener attached.')
  })

  // Clean up the listener when the component unmounts
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    console.log('Escape key listener cleaned up.')
  })
}
