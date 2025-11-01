<template>
  <div :class="['glass-content-panel']" :style="panelStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: string
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: '1.5rem',
  borderRadius: 'var(--glass-border-radius, 12px)',
})

const panelStyles = computed(() => ({
  padding: props.padding,
  borderRadius: props.borderRadius,
}))
</script>
