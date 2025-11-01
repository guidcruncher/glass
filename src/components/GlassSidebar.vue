<template>
  <div
    :class="[
      'glass-sidebar',
      {
        'glass-sidebar--left': dock === 'left',
        'glass-sidebar--right': dock === 'right',
        'glass-sidebar--drawer': isDrawer,
      },
    ]"
    :style="sidebarStyles"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  dock?: 'left' | 'right'
  isOpen: boolean
  width?: string
  topOffset?: string
  isDrawer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dock: 'left',
  width: '300px',
  topOffset: '0px',
  isDrawer: false,
})

const sidebarStyles = computed(() => {
  const styles: Record<string, string> = {
    width: props.width,
    top: props.topOffset,
    height: `calc(100vh - ${props.topOffset})`,
    // Ensures smooth transition
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'fixed',
    zIndex: props.isDrawer ? '995' : '900',
  }

  if (props.isDrawer) {
    if (props.dock === 'left') {
      styles.left = '0'
      styles.transform = `translateX(${props.isOpen ? '0' : '-100%'})`
      styles.right = 'auto'
    } else {
      styles.right = '0'
      styles.transform = `translateX(${props.isOpen ? '0' : '100%'})`
      styles.left = 'auto'
    }
  } else {
    styles.transform = 'translateX(0)'

    if (props.dock === 'left') {
      styles.left = props.isOpen ? '0' : `calc(-1 * ${props.width})`
      styles.right = 'auto'
    } else {
      styles.right = props.isOpen ? '0' : `calc(-1 * ${props.width})`
      styles.left = 'auto'
    }
  }

  return styles
})
</script>
