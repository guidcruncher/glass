<template>
  <div
    :class="['glass-app-icon', { 'glass-app-icon--disabled': disabled }]"
    :style="wrapperStyle"
    @click="handleClick"
    :aria-disabled="disabled ? 'true' : 'false'"
    :tabindex="disabled ? -1 : 0"
    role="button"
  >
    <div :class="imageClasses" :style="iconStyle">
      <img v-if="imageUrl" :src="imageUrl" alt="" class="glass-app-icon__img-asset" />

      <i v-else-if="icon" :class="['glass-app-icon__icon', icon]"></i>

      <slot name="icon" v-else></slot>
    </div>

    <span v-if="label || $slots.label" class="glass-app-icon__label">
      <slot name="label">{{ label }}</slot>
    </span>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GlassAppIcon',
  props: {
    // Font Awesome icon class or similar (e.g., 'fas fa-camera')
    icon: {
      type: String,
      default: null,
    },
    // NEW: URL for an image (e.g., 'https://example.com/logo.png')
    imageUrl: {
      type: String,
      default: null,
    },
    // Text label displayed below the icon
    label: {
      type: String,
      default: '',
    },
    // Component size (e.g., '80px', '100px'). Controls both icon size and font size.
    size: {
      type: [String, Number],
      default: '80px',
    },
    // Disabled state
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    // Standardize size to a string with 'px' if a number is passed
    const iconSize = computed(() =>
      typeof props.size === 'number' ? `${props.size}px` : props.size,
    )

    const handleClick = (event) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    // Style for the image container to set its fixed size and scale the icon
    const iconStyle = computed(() => ({
      width: iconSize.value,
      height: iconSize.value,
      // Set font size for the icon (only applicable if no image URL is provided)
      fontSize: props.imageUrl ? '0' : `calc(${iconSize.value} * 0.45)`,
    }))

    // Wrapper style for flexible layout
    const wrapperStyle = computed(() => ({
      width: iconSize.value,
    }))

    const imageClasses = computed(() => ['glass-app-icon__image'])

    return {
      handleClick,
      iconStyle,
      wrapperStyle,
      imageClasses,
    }
  },
}
</script>
