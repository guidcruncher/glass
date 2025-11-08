<template>
  <div class="infinite-scroll-wrapper">
    <div ref="scrollContainerRef" class="infinite-scroll-content" @scroll="onScroll">
      <slot></slot>

      <div v-if="loading" class="infinite-scroll-loading">
        <slot name="loading"> Loading more items... </slot>
      </div>

      <div v-else-if="!hasMore && !loading" class="infinite-scroll-end">
        <slot name="end"> All items loaded. </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  /** A boolean indicating if data is currently being loaded. */
  loading: {
    type: Boolean,
    default: false,
  },
  /** A boolean indicating if there are more items to load. */
  hasMore: {
    type: Boolean,
    default: true,
  },
  /** The scroll distance (in pixels) from the bottom to trigger the loadMore event. */
  threshold: {
    type: Number,
    default: 150,
  },
})

const emit = defineEmits(['load-more'])

/** Ref to the scrollable element (the content container) */
const scrollContainerRef = ref(null)

/**
 * Handles the scroll event and checks if a 'load-more' event should be emitted.
 */
const onScroll = () => {
  const container = scrollContainerRef.value

  if (!container || props.loading || !props.hasMore) {
    return
  }

  // Calculation:
  // (Scroll Height - Container Height) = Max scroll distance from the top
  // Max scroll distance - Current Scroll Top = Distance from the bottom
  const distanceToBottom = container.scrollHeight - container.clientHeight - container.scrollTop

  // If the distance to the bottom is less than the threshold, load more
  if (distanceToBottom <= props.threshold) {
    emit('load-more')
  }
}

onMounted(() => {
  if (scrollContainerRef.value) {
    // Initial check in case content is smaller than container
    onScroll()
  }
})

onUnmounted(() => {
  // Not strictly necessary for a @scroll listener directly on the element,
  // but good practice if the listener were on the window or a global ref.
})
</script>
