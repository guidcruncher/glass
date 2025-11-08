<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// --- 1. TypeScript Interfaces and Types ---

/**
 * Defines the successful or "no more data" response structure from the fetch function.
 */
interface DataPageResult<T> {
  data: T[]
  hasMore: boolean // Flag to indicate if more pages exist
  error?: string // Optional error message
}

/**
 * The signature for the data fetching function provided by the parent component.
 * It is a function that returns a Promise resolving to a DataPageResult.
 */
type DataFetcher<T> = (page: number, pageSize: number) => Promise<DataPageResult<T>>

/**
 * Defines the props for the GlassInfiniteScroll component.
 */
interface GlassInfiniteScrollProps<T> {
  /** The function to call to fetch data pages. */
  fetchData: DataFetcher<T>
  /** The number of items to fetch per page. */
  pageSize: number
  /** The total height of the component (e.g., '100%' (default), '500px', '80vh'). */
  height: string
  /** The intensity of the blur effect (e.g., '10px'). */
  blur: string
  /** Sets the border radius (e.g., '16px'). */
  borderRadius: string
  /** Defines the color theme. */
  theme: 'light' | 'dark'
}

// --- 2. Props and State Initialization ---

const emit = defineEmits(['row-click'])

const props = withDefaults(defineProps<GlassInfiniteScrollProps<T>>(), {
  pageSize: 20,
  height: '100%',
  blur: '12px',
  borderRadius: '16px',
  theme: 'light',
})

// Reactive State
const data = ref<T[]>([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const error = ref<string | null>(null)

// Element Refs for Intersection Observer
const scrollContainerRef = ref<HTMLElement | null>(null)
const observerTargetRef = ref<HTMLElement | null>(null)

// --- 3. Core Infinite Scroll Logic ---

/**
 * Fetches the next page of data and updates the component state.
 */
const loadMore = async () => {
  if (isLoading.value || !hasMore.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const result = await props.fetchData(currentPage.value, props.pageSize)

    if (result.error) {
      error.value = result.error
    } else {
      data.value.push(...result.data)
      hasMore.value = result.hasMore
      currentPage.value++
    }
  } catch (err: any) {
    error.value = 'Failed to load data. ' + (err.message || String(err))
  } finally {
    isLoading.value = false
  }
}

const handleItemClick = (item, index) => {
  emit('row-click', item, index)
}

// --- 4. Intersection Observer Setup ---

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Initial load when the component mounts
  loadMore()

  // Set up Intersection Observer
  if (observerTargetRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        // If the target is intersecting (visible) and we have more data and not already loading
        if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
          loadMore()
        }
      },
      {
        root: scrollContainerRef.value, // Observe intersection relative to the scrollable body
        rootMargin: '0px 0px 200px 0px', // Start loading 200px before the end
        threshold: 0.1,
      },
    )
    observer.observe(observerTargetRef.value)
  }
})

onUnmounted(() => {
  // Clean up the observer when the component is unmounted
  if (observer && observerTargetRef.value) {
    observer.unobserve(observerTargetRef.value)
  }
})

// --- 5. Computed Styles for Glassmorphism ---

// Inject props as CSS Variables via the :style binding.
const containerStyle = computed(() => ({
  '--panel-blur': props.blur,
  '--panel-border-radius': props.borderRadius,
  height: props.height,
}))

// Compute the class used by SCSS to apply dark mode theming
const themeClass = computed(() => ({
  'glass-scroll--dark': props.theme === 'dark',
}))

// Expose data and loading state for the body slot
defineExpose({
  data,
  isLoading,
  hasMore,
  error,
  loadMore, // Allows parent to manually trigger a load
})
</script>

<template>
  <div class="glass-scroll-wrapper" :class="themeClass" :style="containerStyle">
    <header class="glass-scroll__header">
      <slot name="header"></slot>
    </header>

    <div ref="scrollContainerRef" class="glass-scroll__body">
      <slot name="body" :data="data" :is-loading="isLoading" :has-more="has - more" :error="error">
        <ul class="default-list">
          <li v-for="(item, index) in data" :key="inex" @click="handleItemClick(item, index)">
            {{ item }}
          </li>
        </ul>
      </slot>

      <div ref="observerTargetRef" class="observer-target">
        <div v-if="isLoading">Loading more items...</div>
        <div v-else-if="error" class="error-message">
          Error: {{ error }} <button @click="loadMore">Retry</button>
        </div>
        <div v-else-if="!hasMore">No more items to load.</div>
      </div>
    </div>

    <footer class="glass-scroll__footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
