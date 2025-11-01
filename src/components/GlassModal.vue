<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="glass-modal__backdrop" @click.self="closeModal">
        <Transition :name="transitionName" appear>
          <div v-if="isVisible" :class="modalClasses" :style="modalStyle">
            <header
              class="glass-modal__header"
              :class="{ 'glass-modal__header--draggable': windowed }"
            >
              <div class="glass-modal__controls">
                <button
                  class="glass-modal__control-btn glass-modal__control-btn--close"
                  @click="closeModal"
                  title="Close"
                ></button>
                <button
                  v-if="props.allowFullScreen"
                  class="glass-modal__control-btn glass-modal__control-btn--zoom"
                  @click="toggleWindowed"
                  :title="windowed ? 'Maximize' : 'Restore'"
                ></button>
              </div>
              <div class="glass-modal__title">
                <slot name="title">
                  <h3>{{ props.title || 'Modal Title' }}</h3>
                </slot>
              </div>
            </header>

            <div class="glass-modal__body">
              <slot></slot>
            </div>

            <footer v-if="$slots.footer" class="glass-modal__footer">
              <slot name="footer"></slot>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  maxWidth?: string
  maxHeight?: string
  closeOnBackdropClick?: boolean
  allowFullScreen?: boolean
  isWindowed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Modal Title',
  maxWidth: '500px',
  maxHeight: '80vh',
  closeOnBackdropClick: true,
  allowFullScreen: true,
  isWindowed: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}>()

const windowed = ref(props.isWindowed)

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const transitionName = computed(() => {
  return windowed.value ? 'modal-windowed' : 'modal-full'
})

const modalClasses = computed(() => {
  return [
    'glass-modal',
    { 'glass-modal--windowed': windowed.value },
    { 'glass-modal--fullscreen': !windowed.value },
  ]
})

const modalStyle = computed(() => {
  if (windowed.value) {
    return {
      'max-width': props.maxWidth,
      'max-height': props.maxHeight,
      transform: 'translate(-50%, -50%)',
    }
  }
  return {}
})

const toggleWindowed = () => {
  windowed.value = !windowed.value
}

const closeModal = () => {
  if (props.closeOnBackdropClick) {
    isVisible.value = false
    emit('closed')
  }
}

watch(
  () => isVisible.value,
  (newVal) => {
    if (typeof document !== 'undefined') {
      // Toggle a class on the body to prevent background scrolling
      document.body.classList.toggle('modal-open', newVal)
    }
  },
  { immediate: true },
)
</script>
