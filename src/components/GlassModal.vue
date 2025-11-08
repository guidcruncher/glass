<template>
  <Transition name="fade">
    <div v-if="isVisible" class="glass-modal__backdrop" @click.self="closeModal">
      <Transition :name="transitionName" appear>
        <div v-if="isVisible" :class="modalClasses" :style="modalStyle">
          <header
            class="glass-modal__header"
            :class="{ 'glass-modal__header--draggable': windowed }"
          >
            <div class="glass-modal__controls">
              <button class="control-btn close-btn" @click="closeModal" title="Close"></button>
              <button
                v-if="allowFullScreen"
                class="control-btn zoom-btn"
                @click="toggleWindowed"
                :title="windowed ? 'Maximize' : 'Restore'"
              ></button>
            </div>
            <div class="glass-modal__title">
              <slot name="title">
                <h3>{{ title || 'Modal Title' }}</h3>
              </slot>
            </div>
          </header>

          <div class="glass-modal__body">
            <slot name="body"></slot>
          </div>

          <footer v-if="$slots.footer" class="glass-modal__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { useUniqueId } from '../composables/useUniqueId'

export default {
  name: 'GlassModal',
  props: {
    modelValue: { type: Boolean, default: false }, // v-model
    title: { type: String, default: '' },
    maxWidth: { type: String, default: '600px' },
    maxHeight: { type: String, default: '80vh' },
    allowFullScreen: { type: Boolean, default: true },
    closeOnBackdropClick: { type: Boolean, default: true },
    isWindowed: { type: Boolean, default: true }, // Initial state
  },
  emits: ['update:modelValue', 'closed'],
  data() {
    return {
      windowed: this.isWindowed,
      // Optional: Store window position/size for drag/restore features
    }
  },
  computed: {
    id() {
      return `glass-modal-${useUniqueId()}`
    },
    isVisible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
    transitionName() {
      // Use a distinct transition name for windowing effect
      return this.windowed ? 'modal-windowed' : 'modal-full'
    },
    modalClasses() {
      return [
        'glass-modal',
        { 'glass-modal--windowed': this.windowed },
        { 'glass-modal--fullscreen': !this.windowed },
      ]
    },
    modalStyle() {
      if (this.windowed) {
        return {
          'max-width': this.maxWidth,
          'max-height': this.maxHeight,
          // 🔑 Use transform for centering in windowed mode
          transform: 'translate(-50%, -50%)',
        }
      }
      return {} // Full-screen takes 100%
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
        this.$emit('closed')
      }
    },
  },
  methods: {
    closeModal() {
      if (this.closeOnBackdropClick) {
        this.isVisible = false
      }
    },
    toggleWindowed() {
      this.windowed = !this.windowed
    },
  },
  mounted() {
    // Initialize windowed state from prop
    this.windowed = this.isWindowed

    // Cleanup on unmount (important if modal is destroyed while open)
    if (this.modelValue) {
      document.body.classList.add('modal-open')
    }
  },
  beforeUnmount() {
    document.body.classList.remove('modal-open')
  },
}
</script>
