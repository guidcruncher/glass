<template>
  <section class="flip-clock-section">
    <div class="flip-clock-container">
      <div class="flip-display-grid">
        <FlipDigit :value="timeDigits[0]" />
        <FlipDigit :value="timeDigits[1]" />

        <div class="separator-dot-container">:</div>

        <FlipDigit :value="timeDigits[2]" />
        <FlipDigit :value="timeDigits[3]" />

        <div class="separator-dot-container seconds-separator-only">:</div>

        <FlipDigit :value="timeDigits[4]" class="seconds-digit-only" />
        <FlipDigit :value="timeDigits[5]" class="seconds-digit-only" />
      </div>

      <div class="info-display">
        <p class="date-text">{{ formattedDate }}</p>
        <p class="timezone-text">{{ timeZoneLabel }}</p>
      </div>

      <div class="timezone-select-wrapper">
        <label for="timezone-select" class="select-label">Timezone</label>
        <select
          id="timezone-select"
          v-model="selectedTimeZone"
          class="timezone-select-control"
        >
          <option v-for="tz in timeZones" :key="tz" :value="tz">
            {{ tz }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import FlipDigit from "./FlipDigit.vue"; // Assuming this exists

// --- STATE ---
const time = ref(new Date());
const timeZones = [
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];
const selectedTimeZone = ref(timeZones[1]);
let timer = null;

// --- Time Calculation and Formatting ---
const getTimeInZone = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedTimeZone.value,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  // Find and concatenate the hour, minute, and second parts
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  const second = parts.find((p) => p.type === "second")?.value || "00";

  return `${hour}${minute}${second}`;
};

// Returns an array of 6 digits (HHMMSS)
const timeDigits = computed(() => {
  return Array.from(getTimeInZone(time.value));
});

const formattedDate = computed(() =>
  time.value.toLocaleDateString("en-US", {
    timeZone: selectedTimeZone.value,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const timeZoneLabel = computed(() => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: selectedTimeZone.value,
    timeZoneName: "longOffset",
  });
  return formatter.format(time.value);
});

// --- Lifecycle ---
onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date();
  }, 100);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Assuming this clock is predominantly dark glass */
:root {
  --clock-text-color: white;
  --clock-bg: rgba(30, 30, 30, 0.4);
  --clock-border: rgba(255, 255, 255, 0.15);
  --clock-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --separator-opacity: 0.7;
}

/* ===================================================================
   CONTAINERS
   =================================================================== */
.flip-clock-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem; /* p-6 */
  color: var(--clock-text-color);
}
@media (min-width: 640px) {
  /* sm:p-10 */
  .flip-clock-section {
    padding: 2.5rem;
  }
}

.flip-clock-container {
  padding: 1.5rem; /* p-6 */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: var(--clock-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background-color: var(--clock-bg);
  border: 1px solid var(--clock-border);
}
@media (min-width: 640px) {
  /* sm:p-10 */
  .flip-clock-container {
    padding: 2.5rem;
  }
}

/* ===================================================================
   DISPLAY
   =================================================================== */
.flip-display-grid {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
}
@media (min-width: 640px) {
  /* sm:space-x-4 */
  .flip-display-grid {
    gap: 1rem;
  }
}

/* Separator styling */
.separator-dot-container {
  font-size: 3rem; /* text-5xl */
  font-weight: 300; /* font-light */
  opacity: var(--separator-opacity);
  margin-bottom: 0.75rem; /* mb-3 */
}
@media (min-width: 640px) {
  /* sm:text-7xl sm:mb-5 */
  .separator-dot-container {
    font-size: 4.5rem;
    margin-bottom: 1.25rem;
  }
}

/* Seconds visibility */
.seconds-separator-only,
.seconds-digit-only {
  display: none; /* hidden */
}
@media (min-width: 640px) {
  /* sm:block */
  .seconds-separator-only {
    display: block;
  }
  .seconds-digit-only {
    display: block;
  }
}

/* ===================================================================
   INFO DISPLAY
   =================================================================== */
.info-display {
  margin-top: 1.5rem; /* mt-6 */
  text-align: center; /* text-center */
}

.date-text {
  font-size: 1.25rem; /* text-xl */
  font-weight: 500; /* font-medium */
}

.timezone-text {
  font-size: 0.875rem; /* text-sm */
  opacity: 0.7;
}

/* ===================================================================
   TIMEZONE SELECT
   =================================================================== */
.timezone-select-wrapper {
  margin-top: 2rem; /* mt-8 */
  width: 100%;
}

.select-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  margin-bottom: 0.5rem; /* mb-2 */
}

.timezone-select-control {
  width: 100%;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid var(--clock-border);
  background-color: var(--clock-bg);
  color: var(--clock-text-color);
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 1rem;
}

.timezone-select-control:focus {
  outline: none;
  border-color: #007aff; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.5); /* focus:ring-3 focus:ring-blue-500/50 */
}
</style>
