<template>
  <div class="glass-calendar-wrapper">
    <div class="glass-calendar">
      <header class="calendar-header">
        <button class="nav-button" @click="changeMonth(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>

        <h3>{{ currentMonthName }} {{ currentYear }}</h3>

        <button class="nav-button" @click="changeMonth(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </header>

      <div class="weekdays">
        <span v-for="day in weekDays" :key="day" class="weekday-label">{{ day }}</span>
      </div>

      <div class="days-grid">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'day',
            { 'is-not-current-month': !day.isCurrentMonth },
            { 'is-today': day.isToday },
            { 'is-selected': day.isSelected, clickable: day.date },
          ]"
          @click="day.date && selectDate(day.date)"
        >
          {{ day.dayNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Day {
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  date: Date | null
}

interface Props {
  modelValue?: string | null // Expected format: YYYY-MM-DD
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', date: string): void
}>()

const currentDate = ref(new Date())

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const weekDays = computed(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
}

const selectDate = (date: Date) => {
  // Update internal calendar view to the selected date's month
  currentDate.value = date

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  emit('update:modelValue', formattedDate)
}

const calendarDays = computed<Day[]>(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Day of the week (0=Sunday, 6=Saturday)
  const firstDayWeekDay = firstDayOfMonth.getDay()

  const days: Day[] = []

  // 1. Fill in preceding month's days
  const prevMonthYear = month === 0 ? year - 1 : year
  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeekDay; i > 0; i--) {
    const dayNumber = prevMonthLastDay - i + 1
    // Creating a valid date object for previous month days is better for navigation
    const date = new Date(prevMonthYear, prevMonth, dayNumber)

    days.push({
      dayNumber: dayNumber,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      date: date, // Allow selecting a date from a previous month
    })
  }

  // 2. Fill in current month's days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const date = new Date(year, month, dayNum)
    date.setHours(0, 0, 0, 0)

    const isToday = date.getTime() === today.getTime()

    // Normalize selected date to midnight for comparison
    const selectedDateMs = props.modelValue ? new Date(props.modelValue).setHours(0, 0, 0, 0) : null
    const isSelected = selectedDateMs !== null && date.getTime() === selectedDateMs

    days.push({
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: isToday,
      isSelected: isSelected,
      date: date,
    })
  }

  // 3. Fill in succeeding month's days
  const nextMonthYear = month === 11 ? year + 1 : year
  const nextMonth = month === 11 ? 0 : month + 1
  const totalCells = 42
  const remainingCells = totalCells - days.length

  if (remainingCells > 0) {
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(nextMonthYear, nextMonth, i)

      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        date: date, // Allow selecting a date from the next month
      })
    }
  }

  return days.slice(0, totalCells)
})
</script>
