<template>
  <section
    class="calendar-container"
    :class="{ 'no-borders': !props.showBorders }"
  >
    <div class="calendar-wrapper">
      <div class="header-controls">
        <button @click="prevMonth" class="month-button">Previous</button>
        <h3 class="month-title">{{ monthYearString }}</h3>
        <button @click="nextMonth" class="month-button">Next</button>
      </div>

      <div class="day-of-week-header">
        <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day">
          {{ day }}
        </div>
      </div>

      <div class="calendar-days-grid">
        <div
          v-for="day in calendarDays"
          :key="day.id"
          :class="[
            'calendar-day-cell',
            {
              'calendar-day-today': day.isToday,
              'calendar-day-selected': day.isSelected,
              'cursor-default': !day.date,
              'cursor-pointer': day.date,
            },
          ]"
          @click="day.date && selectDay(day.date)"
        >
          {{ day.dayNumber }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

// 0. Define Props (NEW)
const props = defineProps({
  showBorders: {
    type: Boolean,
    default: true, // Default is to show borders
  },
});

// 1. Define the 'date-selected' event
const emit = defineEmits(["date-selected"]);

const currentDate = ref(new Date());
const selectedDate = ref(null);

const monthYearString = computed(() =>
  currentDate.value.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  }),
);

// --- CALENDAR LOGIC ---
const getMonthDetails = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // Add preceding greyed-out days to fill the first row
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ id: `prev-${i}`, dayNumber: "", date: null });
  }

  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    const isToday = dayDate.toDateString() === new Date().toDateString();
    const isSelected =
      selectedDate.value &&
      dayDate.toDateString() === selectedDate.value.toDateString();

    days.push({
      id: i,
      dayNumber: i,
      date: dayDate,
      isToday: isToday,
      isSelected: isSelected,
    });
  }

  // Add trailing greyed-out days to complete the last row
  const totalCells = days.length;
  const trailingCount = 42 - totalCells; // Max 6 rows * 7 days = 42

  for (let i = 0; i < trailingCount; i++) {
    days.push({ id: `next-${i}`, dayNumber: "", date: null });
  }

  return days;
};

const calendarDays = computed(() => getMonthDetails(currentDate.value));

const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
};

const selectDay = (date) => {
  // 2. Update the local selected state
  selectedDate.value = date;

  // 3. Emit the event with the selected Date object
  emit("date-selected", date);
};
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */

/* Dark Theme (Default) */
:root {
  --glass-bg: rgba(30, 30, 30, 0.4);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --text-color-base: white;
  --text-color-faded: rgba(255, 255, 255, 0.5); /* opacity-50 */
  --calendar-hover-bg-dark: rgba(255, 255, 255, 0.2); /* hover:bg-white/20 */
  --calendar-selected-bg-dark: rgba(255, 255, 255, 0.4); /* bg-white/40 */
}

/* Light Theme (Override) */
.dark {
  --glass-bg: rgba(255, 255, 255, 0.65);
  --glass-border: rgba(0, 0, 0, 0.15);
  --glass-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --text-color-base: #1f2937; /* gray-900 */
  --text-color-faded: rgba(31, 41, 55, 0.6); /* opacity-60 */
  --calendar-hover-bg-dark: rgba(0, 0, 0, 0.1); /* light:hover:bg-black/10 */
  --calendar-selected-bg-dark: rgba(0, 0, 0, 0.15); /* light:bg-black/15 */
}

/* Accent Color */
:root {
  --accent-color: #007aff;
}

/* ===================================================================
   CONTAINER AND LAYOUT
   =================================================================== */
.calendar-container {
  /* Glass Panel Styling */
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 1rem; /* rounded-2xl */
  padding: 2rem; /* p-8 */
  color: var(--text-color-base);
  max-width: 400px;
  margin: 0;
}

/* New: Hide Borders (Toggled by the 'showBorders' prop) */
.calendar-container.no-borders {
  border: none;
  box-shadow: none;
}

.section-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 1.5rem;
}

/* ===================================================================
   CALENDAR CONTROLS
   =================================================================== */
.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* mb-4 */
}

.month-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 500; /* font-medium */
}

.month-button {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.month-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* ===================================================================
   DAY HEADER & GRID
   =================================================================== */
.day-of-week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* grid-cols-7 */
  text-align: center;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  opacity: 0.7; /* opacity-70 */
  margin-bottom: 0.5rem; /* mb-2 */
}
.day-of-week-header div {
  padding: 0.25rem;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* grid-cols-7 */
  gap: 0.5rem; /* gap-2 */
}

/* ===================================================================
   CALENDAR DAY CELL
   =================================================================== */
.calendar-day-cell {
  width: 100%;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* rounded-full */
  transition: all 0.2s ease;
  font-size: 0.875rem; /* text-sm */
}

/* State: Unselectable (for placeholder days) */
.calendar-day-cell:not(.cursor-pointer) {
  color: var(--text-color-faded);
  opacity: 0.5;
}

/* State: Hover (for selectable days) */
.calendar-day-cell.cursor-pointer:hover {
  transform: scale(1.1);
  background-color: var(--calendar-hover-bg-dark);
}
.dark .calendar-day-cell.cursor-pointer:hover {
  background-color: var(--calendar-hover-bg-dark); /* Light mode override */
}

/* State: Today */
.calendar-day-today {
  background-color: var(--accent-color);
  color: white;
  font-weight: 700;
}

/* State: Selected */
.calendar-day-selected {
  background-color: var(--calendar-selected-bg-dark);
  color: var(--text-color-base);
  font-weight: 500;
  box-shadow: 0 0 0 2px var(--text-color-base);
}

/* State: Selected & Today - Selected style takes priority but keeps accent color */
.calendar-day-today.calendar-day-selected {
  background-color: var(--accent-color);
  box-shadow: 0 0 0 2px white;
}
.dark .calendar-day-today.calendar-day-selected {
  box-shadow: 0 0 0 2px var(--text-color-base);
}
</style>
