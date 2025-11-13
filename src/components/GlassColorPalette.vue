<template>
  <div
    :class="['glass-color-picker', { 'dark-theme': isDarkTheme }]"
    @mouseleave="isDragging = false"
  >
    <div
      class="color-area-container"
      ref="colorAreaRef"
      @mousedown="startDrag($event, 'color')"
    >
      <svg
        class="color-area-svg"
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #ff0000" />
            <stop offset="16.666%" style="stop-color: #ffff00" />
            <stop offset="33.333%" style="stop-color: #00ff00" />
            <stop offset="50%" style="stop-color: #00ffff" />
            <stop offset="66.666%" style="stop-color: #0000ff" />
            <stop offset="83.333%" style="stop-color: #ff00ff" />
            <stop offset="100%" style="stop-color: #ff0000" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="100" fill="url(#hueGradient)" />

        <rect
          x="0"
          y="0"
          width="200"
          height="100"
          fill="white"
          style="opacity: 0.1"
        />
        <rect
          x="0"
          y="0"
          width="200"
          height="100"
          fill="black"
          style="opacity: 0.1"
        />
      </svg>
      <div
        class="color-handle"
        :style="{
          left: colorHandlePosition.x + '%',
          top: colorHandlePosition.y + '%',
        }"
      >
        <div
          class="inner-ring"
          :style="{ backgroundColor: currentHexColor }"
        ></div>
      </div>
    </div>

    <div class="controls-container">
      <div
        class="hue-slider"
        ref="hueSliderRef"
        @mousedown="startDrag($event, 'hue')"
      >
        <div class="hue-track"></div>
        <div
          class="slider-handle"
          :style="{ left: hueHandlePosition.x + '%' }"
        ></div>
      </div>

      <div class="color-info">
        <div
          class="color-preview"
          :style="{ backgroundColor: currentHexColor }"
        ></div>
        <div class="color-value">
          <input
            type="text"
            :value="currentHexColor"
            @input="updateFromInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { hexToHsv, hsvToHex } from "../utils/color-utils";

const props = defineProps({
  modelValue: {
    type: String,
    default: "#ff0000", // Default to red
  },
});

const emit = defineEmits(["update:modelValue", "colorSelected"]);

// --- Theme State ---
const isDarkTheme = ref(false); // Can be driven by a global store or a more complex check

// --- Color State (HSV) ---
const hsv = ref(hexToHsv(props.modelValue));

// --- DOM Refs and Drag State ---
const colorAreaRef = ref(null);
const hueSliderRef = ref(null);
const isDragging = ref(false);
const dragType = ref(""); // 'color' or 'hue'

// --- Color Conversion and Output ---
const currentHexColor = computed(() => hsvToHex(hsv.value));

// --- Position Computations ---
const colorHandlePosition = computed(() => ({
  x: hsv.value.s, // Saturation (0-100)
  y: 100 - hsv.value.v, // Value (0-100) -> inverted for vertical position
}));

const hueHandlePosition = computed(() => ({
  x: hsv.value.h / 3.6, // Hue (0-360) -> scale to 0-100%
}));

// --- Watchers and Handlers ---

// Update internal HSV when prop changes externally
watch(
  () => props.modelValue,
  (newHex) => {
    if (newHex !== currentHexColor.value) {
      hsv.value = hexToHsv(newHex);
    }
  },
  { immediate: true },
);

// Emit updated hex color when internal HSV changes
watch(
  hsv,
  (newHsv) => {
    emit("update:modelValue", hsvToHex(newHsv));
    emit("colorSelected", hsvToHex(newHsv));
  },
  { deep: true },
);

const updateFromInput = (event) => {
  const newHex = event.target.value;
  if (/^#?([0-9A-F]{3}){1,2}$/i.test(newHex)) {
    hsv.value = hexToHsv(newHex);
  }
};

const updateColorFromMouseEvent = (event, type) => {
  if (!isDragging.value) return;

  if (type === "color" && colorAreaRef.value) {
    const rect = colorAreaRef.value.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Clamp values
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    // Update Saturation (S) and Value (V)
    hsv.value.s = Math.round((x / rect.width) * 100);
    hsv.value.v = Math.round(100 - (y / rect.height) * 100);
  } else if (type === "hue" && hueSliderRef.value) {
    const rect = hueSliderRef.value.getBoundingClientRect();
    let x = event.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));

    // Update Hue (H)
    hsv.value.h = Math.round((x / rect.width) * 360);
  }
};

const startDrag = (event, type) => {
  event.preventDefault();
  isDragging.value = true;
  dragType.value = type;
  updateColorFromMouseEvent(event, type); // Update immediately on click
};

const stopDrag = () => {
  isDragging.value = false;
  dragType.value = "";
};

// Global event listeners for dragging
const handleMouseMove = (event) => {
  if (isDragging.value) {
    updateColorFromMouseEvent(event, dragType.value);
  }
};

onMounted(() => {
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopDrag);

  // Simple initial check for a 'dark-theme' class on the body
  if (document.body.classList.contains("dark-theme")) {
    isDarkTheme.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped lang="scss"></style>
