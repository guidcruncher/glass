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

const emit = defineEmits(['update:modelValue', 'close', 'minimize', 'maximize'])

const isVisible = ref(props.modelValue)
const isMaximized = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
    // Control body scroll when modal is open
    document.body.style.overflow = newVal ? 'hidden' : ''
  },
)

const close = () => {
  isVisible.value = false
  isMaximized.value = false // Reset maximization on close
  emit('update:modelValue', false)
  emit('close')
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
  console.log('Modal maximized state toggled:', isMaximized.value)
  emit('maximize', isMaximized.value) // Emit new state to parent
}

defineExpose({
  close,
  minimize,
  toggleMaximize,
})
</script>

<style scoped lang="scss">
// SASS Variables for Glassmorphic Styling (Unchanged)
$modal-bg: rgba(255, 255, 255, 0.8);
$modal-border: rgba(255, 255, 255, 0.9);
$modal-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
$modal-blur: 14px;
$modal-text: #111827;
$header-bg-tint: rgba(255, 255, 255, 0.2);
$header-border-color: rgba(0, 0, 0, 0.1);

// ------------------------------------
// 1. BACKDROP AND CONTAINER (Unchanged, relies on position: fixed)
// ------------------------------------

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);

  // Background blur behind the modal
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  transition: background-color 0.3s ease;
}

.modal-container {
  position: relative;
  border-radius: 0.75rem; /* rounded-xl */
  width: 100%;
  max-width: 42rem; /* max-w-xl */
  color: $modal-text;
  overflow: hidden;

  // Glassmorphism effect
  background-color: $modal-bg;
  border: 1px solid $modal-border;
  box-shadow: $modal-shadow;
  backdrop-filter: blur($modal-blur);
  -webkit-backdrop-filter: blur($modal-blur);

  // Transition for size and opacity changes
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(0.95);
  opacity: 0;

  &.is-visible {
    transform: scale(1);
    opacity: 1;
  }
}

// ------------------------------------
// 2. MAXIMIZED STATE (Unchanged)
// ------------------------------------

.modal-container.is-maximized {
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  transform: none !important;
  box-shadow: none;
}

// ------------------------------------
// 3. HEADER (Unchanged)
// ------------------------------------

.modal-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid $header-border-color;
  background-color: $header-bg-tint;
}

.header-button-group {
  display: flex;
  gap: 0.5rem; /* space-x-2 */
}

.header-title {
  flex-grow: 1; /* flex-grow */
  text-align: center;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  opacity: 0.7;
}

// ------------------------------------
// 4. HEADER BUTTONS (MAC STYLE) (Unchanged)
// ------------------------------------

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

  // Icon inside button
  .icon-svg {
    width: 6px;
    height: 6px;
    opacity: 0;
    transition: opacity 0.1s ease;
    color: rgba(0, 0, 0, 0.7);
  }

  // Show icons on hover
  &:hover .icon-svg {
    opacity: 1;
  }
}

// ------------------------------------
// 5. BODY AND FOOTER (Unchanged)
// ------------------------------------

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;

  .is-maximized & {
    // Adjust body height when maximized (100vh - header height - footer height if present)
    max-height: calc(100vh - (0.75rem * 2 + 1px) - 1.5rem - 1rem);
    padding: 2rem;
  }
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid $header-border-color;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: $header-bg-tint;
}
</style>
