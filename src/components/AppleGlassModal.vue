<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-backdrop" @click.self="closeOnOutsideClick && close()">
      <div
        :class="[
          'modal-container',
          // Apply scale/opacity based on visibility via CSS transition group
          { 'is-visible': isVisible, 'is-hidden': !isVisible },
          { 'is-maximized': isMaximized },
        ]"
        role="dialog"
        aria-modal="true"
      >
        <header class="modal-header">
          <div class="header-button-group">
            <button
              @click="close"
              class="header-button red-button"
              aria-label="Close dialog"
              title="Close"
            >
              <svg
                viewBox="0 0 10 10"
                class="icon-svg"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 3 L7 7 M3 7 L7 3" />
              </svg>
            </button>

            <button
              @click="minimize"
              class="header-button yellow-button"
              aria-label="Minimize dialog"
              title="Minimize"
            >
              <svg
                viewBox="0 0 10 10"
                class="icon-svg"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 5 L7 5" />
              </svg>
            </button>

            <button
              @click="toggleMaximize"
              class="header-button green-button"
              aria-label="Toggle dialog size"
              :title="isMaximized ? 'Restore Down' : 'Maximize'"
            >
              <svg
                v-if="!isMaximized"
                viewBox="0 0 10 10"
                class="icon-svg"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 3 L7 3 L7 7 L3 7 L3 3 M7 3 L7 3 M3 7 L3 7" />
              </svg>

              <svg
                v-else
                viewBox="0 0 10 10"
                class="icon-svg"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 3 L7 3 L7 5 M5 3 L5 5 M7 5 L5 5" />
                <path d="M3 5 L5 5 L5 7 L3 7 L3 5" opacity="0.6" />
              </svg>
            </button>
          </div>

          <h3 class="header-title">
            <slot name="title">Modal Title</slot>
          </h3>
        </header>

        <div class="modal-body">
          <slot>
            <p>This is the body content of the glassmorphic modal.</p>
          </slot>
        </div>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'minimize', 'maximize', 'cancel'])

const isVisible = ref(props.modelValue)
const isMaximized = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
    // Control body scroll when modal is open
    document.body.style.overflow = newVal ? 'hidden' : ''

    if (newVal) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)

const handleKeydown = (event) => {
  // Only execute the handler if the listener is active and the key is 'Escape'
  if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

const close = () => {
  isVisible.value = false
  isMaximized.value = false // Reset maximization on close
  emit('update:modelValue', false)
  emit('close')
}

const cancel = () => {
  isVisible.value = false
  isMaximized.value = false // Reset maximization on cancel
  emit('update:modelValue', false)
  emit('cancel')
}

const minimize = () => {
  // Minimizing typically means closing the modal and letting the parent
  // component handle its minimized state (e.g., a dock icon).
  close()
  console.log('Modal minimized action triggered.')
  emit('minimize')
}

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    emit('maximize')
  }
}
</script>

<style scoped lang="scss">
/*
|--------------------------------------------------------------------------
| BASE STYLES
|--------------------------------------------------------------------------
*/

.modal-backdrop {
  /* Fix: Backdrop must support both light and dark themes */
  position: fixed;
  z-index: 9998;
  backdrop-filter: blur(10px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3); /* Default (Light Mode) Backdrop */
  transition: background-color 0.3s ease;
}

/* Dark Mode Backdrop Override */
:global(html.dark) .modal-backdrop {
  background-color: rgba(0, 0, 0, 0.7); /* Darker backdrop for dark mode */
}

.modal-container {
  /* Core layout and fixed default size */
  width: 90vw; /* Default width */
  max-width: 600px; /* Equivalent to max-w-xl */
  max-height: 90vh;
  min-width: 300px;
  min-height: 150px;
  overflow: hidden;
  z-index: 9999;
  /* Glassmorphic Styling (Refactored to use global CSS variables) */
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border-color);
  box-shadow: var(--glass-shadow);
  /* The blur can be a custom variable or fall back to the global blur */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px));

  /* Text color now driven by global variable */
  color: var(--text-color);

  border-radius: 0.75rem; /* rounded-xl */
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out; /* Transition for scale and opacity */
}

/*
|--------------------------------------------------------------------------
| VISIBILITY & TRANSITIONS
|--------------------------------------------------------------------------
*/

.modal-container.is-hidden {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.modal-container.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/*
|--------------------------------------------------------------------------
| MAXIMIZED STATE
|--------------------------------------------------------------------------
*/

.modal-container.is-maximized {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
  transform: none; /* Override visibility transform */
}

/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

.modal-header {
  /* Light mode for header is usually slightly less transparent than body */
  background-color: var(--glass-header-bg, var(--glass-bg));
  border-bottom: 1px solid var(--glass-border-color);
  padding: 0.75rem 1rem; /* py-3 px-4 */
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
  position: relative;
  flex-shrink: 0;
}

.header-title {
  font-weight: 600;
  font-size: 0.875rem; /* text-sm */
  text-align: center;
  flex-grow: 1;
}

.header-button-group {
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  position: absolute; /* Position over the header to the left */
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10; /* Ensure buttons are clickable */
}

/*
|--------------------------------------------------------------------------
| HEADER BUTTONS (Mac OS Style)
|--------------------------------------------------------------------------
*/

.header-button {
  width: 0.75rem; /* w-3 */
  height: 0.75rem; /* h-3 */
  border-radius: 9999px; /* rounded-full */
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  cursor: pointer;

  &.red-button {
    background-color: #ef4444; /* bg-red-500 */
    &:hover {
      background-color: #dc2626;
    } /* hover:bg-red-600 */
  }
  &.yellow-button {
    background-color: #f59e0b; /* bg-yellow-500 */
    &:hover {
      background-color: #d97706;
    } /* hover:bg-yellow-600 */
  }
  &.green-button {
    background-color: #10b981; /* bg-green-500 */
    &:hover {
      background-color: #059669;
    } /* hover:bg-green-600 */
  }

  /* Icon inside button */
  .icon-svg {
    width: 6px;
    height: 6px;
    opacity: 0;
    transition: opacity 0.1s ease;
    /* Icon stroke color is black for the colored buttons and does not change with theme */
    color: rgba(0, 0, 0, 0.7);
  }

  /* Show icons on hover */
  &:hover .icon-svg {
    opacity: 1;
  }
}

/*
|--------------------------------------------------------------------------
| BODY & FOOTER
|--------------------------------------------------------------------------
*/

.modal-body {
  padding: 1rem; /* p-4 */
  overflow-y: auto; /* Scrollable content */
  flex-grow: 1;
}

.modal-footer {
  border-top: 1px solid var(--glass-border-color);
  padding: 0.55rem 0.55rem; /* py-3 px-4 */
  background-color: var(--glass-footer-bg, var(--glass-bg));
  flex-shrink: 0;
}
</style>
