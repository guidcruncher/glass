<template>
  <div class="glass-tab-strip-wrapper">
    <div
      ref="strip"
      :class="['glass-tab-strip', { 'glass-tab-strip--scrollable': needsScroll }]"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="onDrag"
    >
      <div
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :class="[
          'glass-tab-strip__item',
          {
            'glass-tab-strip__item--active': tab.value === modelValue,
          },
        ]"
        @click="selectTab(tab.value)"
      >
        <i v-if="tab.icon" :class="[tab.icon, 'glass-tab-strip__icon']"></i>
        <span v-if="tab.text">{{ tab.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const TABSTRIP_STORAGE_KEY = 'glassTabStrip'

interface Tab {
  value: string | number
  icon?: string
  text?: string
}

interface Props {
  modelValue: string | number
  autoSaveActiveTab: boolean
  tabs: Tab[]
}

// No defaults needed as modelValue and tabs are required.
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const strip = ref<HTMLElement | null>(null)
const needsScroll = ref(false)

const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const selectTab = (value: string | number) => {
  if (!isDragging.value) {
    if (props.autoSaveActiveTab) {
      localStorage.setItem(TABSTRIP_STORAGE_KEY, JSON.stringify(value))
    }
    emit('update:modelValue', value)
    emit('change', value)
  }
}

const checkScrollOverflow = () => {
  if (strip.value) {
    needsScroll.value = strip.value.scrollWidth > strip.value.clientWidth
  }
}

const centerActiveTab = (activeValue: string | number) => {
  if (!strip.value || !activeValue) return

  nextTick(() => {
    const activeItem = strip.value!.querySelector(
      `.glass-tab-strip__item--active`,
    ) as HTMLElement | null
    if (activeItem) {
      const containerWidth = strip.value!.clientWidth
      const itemWidth = activeItem.clientWidth
      // Calculate the scroll position to center the active item
      const scrollPosition = activeItem.offsetLeft - containerWidth / 2 + itemWidth / 2

      // Use smooth scrolling
      strip.value!.scrollTo({ left: scrollPosition, behavior: 'smooth' })
    }
  })
}

// Dragging logic
const startDrag = (e: MouseEvent) => {
  if (!strip.value) return
  isDragging.value = true
  strip.value.classList.add('glass-tab-strip--dragging')
  startX.value = e.pageX - strip.value.offsetLeft
  scrollLeft.value = strip.value.scrollLeft
}

const stopDrag = () => {
  isDragging.value = false
  // Use optional chaining to safely call remove
  strip.value?.classList.remove('glass-tab-strip--dragging')
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !strip.value) return
  e.preventDefault()
  const x = e.pageX - strip.value.offsetLeft
  const walk = (x - startX.value) * 1.5 // Multiplier for faster scroll
  strip.value.scrollLeft = scrollLeft.value - walk
}

onMounted(() => {
  checkScrollOverflow()
  window.addEventListener('resize', checkScrollOverflow)

  if (props.autoSaveActiveTab) {
    const storedTab = localStorage.getItem(TABSTRIP_STORAGE_KEY)
    if (storedTab) {
      selectTab(JSON.parse(storedTab))
    }
  }

  centerActiveTab(props.modelValue)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScrollOverflow)
})

watch(
  () => props.modelValue,
  (newVal) => {
    centerActiveTab(newVal)
  },
)
</script>
