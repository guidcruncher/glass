<template>
  <div style="width: 100%; z-index: 1000">
    <header :class="headerClasses">
      <div class="glass-appbar-content">
        <div class="glass-appbar__section glass-appbar__section--left">
          <button
            v-if="hasDrawer"
            class="glass-appbar__drawer-btn"
            @click="$emit('toggle-drawer')"
            aria-label="Toggle navigation drawer"
          >
            <i class="fas fa-bars"></i>
          </button>
          <slot name="left"></slot>
        </div>

        <div class="glass-appbar__section glass-appbar__section--middle">
          <slot name="middle"></slot>
        </div>

        <div class="glass-appbar__section glass-appbar__section--right">
          <slot name="right"></slot>
        </div>
      </div>
    </header>
  </div>
  <div v-if="sticky" class="glass-appbar-spacer"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  sticky?: boolean
  hasDrawer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sticky: true,
  hasDrawer: false,
})

const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const headerClasses = computed(() => ['glass-appbar', { 'glass-appbar--sticky': props.sticky }])
</script>

<style lang="scss">
@use '../scss/components/GlassAppBar.scss';
</style>
