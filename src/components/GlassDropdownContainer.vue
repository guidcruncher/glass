<template>
  <section class="dropdown-section">
    <div class="dropdown-wrapper" v-click-outside="closeDropdown">
      <button
        @click="openDropdown"
        ref="dropdownButton"
        class="dropdown-button"
        :class="{
          'dark-theme': isDark,
          'light-theme': !isDark,
          'focus-ring': isOpen,
        }"
      >
        <slot name="selected">
          <span>{{ selectedValue }}</span>
        </slot>

        <svg
          class="dropdown-icon"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <teleport to="body">
        <div
          v-show="isOpen"
          class="dropdown-list-teleported"
          :class="{ 'dark-theme': isDark, 'light-theme': !isDark }"
          :style="listPositionStyle"
        >
          <slot name="dropdown" :close="closeDropdown">
            <div
              v-for="option in options"
              :key="option"
              class="dropdown-list-item"
              @click="selectOption(option)"
              :class="{ 'dark-hover': isDark, 'light-hover': !isDark }"
            >
              {{ option }}
            </div>
          </slot>
        </div>
      </teleport>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

// Define Props for initial value (optional for the container) and options
const props = defineProps({
  options: {
    type: Array,
    default: () => ["Meeting", "Call", "Task", "Reminder", "Birthday"],
  },
  initialValue: {
    type: String,
    default: "Select an option...",
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

// --- STATE ---
const selectedValue = ref(props.initialValue);
const isOpen = ref(false);

// Refs for positioning
const dropdownButton = ref(null);
const listPositionStyle = ref({});

// --- THEME AWARENESS ---
const isDark = ref(true);
const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

// --- LIFECYCLE ---
let themeCheckerInterval = null;

onMounted(() => {
  checkTheme();
  themeCheckerInterval = setInterval(checkTheme, 300);
  window.addEventListener("scroll", recalculatePosition);
  window.addEventListener("resize", recalculatePosition);
});

onUnmounted(() => {
  if (themeCheckerInterval) clearInterval(themeCheckerInterval);
  window.removeEventListener("scroll", recalculatePosition);
  window.removeEventListener("resize", recalculatePosition);
});

// --- POSITIONING LOGIC ---
const recalculatePosition = () => {
  if (!dropdownButton.value || !isOpen.value) return;

  const { top, left, height, width } =
    dropdownButton.value.getBoundingClientRect();

  listPositionStyle.value = {
    top: `${top + height + 8}px`,
    left: `${left}px`,
    width: `${width}px`,
  };
};

// --- DROPDOWN LOGIC ---
const openDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    recalculatePosition();
  }
};

const selectOption = (value) => {
  selectedValue.value = value;
  isOpen.value = false;
  // Emit the selection for external use
  emit("select", value);
  emit("update:modelValue", value);
};

const closeDropdown = () => {
  isOpen.value = false;
};

// --- VUE DIRECTIVE (Must be globally registered or implemented) ---
const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (!event.target.closest(".dropdown-list-teleported")) {
          binding.value(event, el);
        }
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Dark Mode Variables */
.dark-theme {
  --text-color: white;
  --dropdown-bg: rgba(30, 30, 30, 0.4);
  --dropdown-border: rgba(255, 255, 255, 0.2);
  --button-focus-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  --list-item-hover: rgba(255, 255, 255, 0.1);
}

/* Light Mode Variables */
.light-theme {
  --text-color: #1f2937; /* gray-900 */
  --dropdown-bg: rgba(255, 255, 255, 0.65);
  --dropdown-border: rgba(0, 0, 0, 0.2);
  --button-focus-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  --list-item-hover: rgba(0, 0, 0, 0.1);
}

/* ===================================================================
   SECTION AND TITLE 
   =================================================================== */
.dropdown-section {
  padding: 2rem;
  border-radius: 1rem;
  background-color: rgba(30, 30, 30, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: white;
}
.light-theme.dropdown-section {
  background-color: rgba(255, 255, 255, 0.65);
  border-color: rgba(0, 0, 0, 0.15);
  color: #1f2937;
}

.dropdown-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* ===================================================================
   DROPDOWN WRAPPER & BUTTON
   =================================================================== */
.dropdown-wrapper {
  position: relative;
}

.dropdown-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  background-color: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  color: var(--text-color);
}

@media (min-width: 768px) {
  .dropdown-button {
    padding: 1rem;
  }
}

.dropdown-button.focus-ring {
  outline: none;
  box-shadow: var(--button-focus-shadow);
}

.dropdown-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0; /* Prevent icon from shrinking if selected content is long */
}
.rotate-180 {
  transform: rotate(180deg);
}

/* ===================================================================
   DROPDOWN LIST (TELEPORTED)
   =================================================================== */
.dropdown-list-teleported {
  position: fixed;
  margin-top: 0;
  border-radius: 0.75rem;
  z-index: 9999;
  overflow: hidden;

  background-color: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-list-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text-color);
}

@media (min-width: 768px) {
  .dropdown-list-item {
    padding: 1rem;
  }
}

.dropdown-list-item.dark-hover:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-list-item.light-hover:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
