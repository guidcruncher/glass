<template>
  <footer :class="footerClasses">
    <div class="glass-footer__content glass-footer__content--left">
      <slot name="left"></slot>
    </div>

    <div class="glass-footer__content glass-footer__content--center">
      <slot name="center"></slot>
    </div>

    <div class="glass-footer__content glass-footer__content--right">
      <slot name="right"></slot>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GlassFooter',
  props: {
    // Controls whether the footer sticks to the bottom of the viewport
    isFixed: {
      type: Boolean,
      default: true,
    },
    // Optional: Controls a higher z-index for fixed footers
    zIndex: {
      type: [Number, String],
      default: 900,
    },
  },
  setup(props) {
    const footerClasses = computed(() => ['glass-footer', { 'glass-footer--fixed': props.isFixed }])

    const footerStyles = computed(() => ({
      zIndex: props.zIndex,
    }))

    return {
      footerClasses,
      footerStyles,
    }
  },
}
</script>
