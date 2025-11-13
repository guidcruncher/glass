<template>
  <button
    :class="[
      'glass-button',
      buttonSizeClass,
      disabled ? 'disabled' : enabledClass,
    ]"
    :style="buttonStyles"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** The text label to display on the button. */
  label: {
    type: String,
    default: "Button",
  },
  /** Defines the button's style variant. */
  variant: {
    type: String,
    default: "primary",
  },
  /** Optional custom color (applies only if variant is 'custom'). */
  color: {
    type: String,
    default: "",
  },
  /** Optional width for the button (e.g., '120px'). */
  width: {
    type: String,
    default: "auto",
  },
  /** Optional height for the button (e.g., '40px'). */
  height: {
    type: String,
    default: "auto",
  },
  /** If true, the button is disabled and click event is suppressed. */
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

/**
 * Calculates the class name for the enabled variant style.
 */
const enabledClass = computed(() => {
  if (props.variant === "custom" && props.color) {
    return "custom";
  }
  // All other variants map directly to a CSS class
  return props.variant;
});

/**
 * Calculates the class for default padding/sizing only if width/height are auto.
 */
const buttonSizeClass = computed(() => {
  return props.width === "auto" && props.height === "auto"
    ? "default-size"
    : "custom-size";
});

/**
 * Applies custom width and height styles.
 * Also passes the custom color for the `custom` variant via CSS variables.
 */
const buttonStyles = computed(() => {
  const styles = {
    "--btn-width": props.width,
    "--btn-height": props.height,
  };

  if (props.variant === "custom" && props.color) {
    // Set a CSS variable for the custom color base and hover effects
    styles["--custom-color-base"] = props.color + "60"; // 60% opacity
    styles["--custom-color-hover"] = props.color;
  }

  return styles;
});

/**
 * Emits the click event only if the button is not disabled.
 */
const handleClick = (event) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<style scoped>
/* ===================================================================
   BASE BUTTON STYLES (Applies to all states and variants)
   =================================================================== */
.glass-button {
  /* Layout and Font */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px; /* rounded-xl */
  font-weight: 600; /* font-semibold */
  line-height: 1.5;
  cursor: pointer;

  /* Sizing */
  width: var(--btn-width, auto);
  height: var(--btn-height, auto);
  min-width: 90px;

  /* Glassmorphism */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  /* Transitions and Interaction */
  transition:
    transform 0.2s ease,
    background 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.3s ease;
  transform-origin: center;
  border-width: 1px;
}

/* Default Padding for buttons without explicit width/height */
.default-size {
  padding: 10px 20px; /* px-5 py-2.5 */
}

/* Interaction States */
.glass-button:hover:not([disabled]) {
  transform: scale(1.02);
}

.glass-button:active:not([disabled]) {
  transform: scale(0.95);
  box-shadow: none;
}

/* ===================================================================
   VARIANT STYLES (Apple-Aligned Colors)
   =================================================================== */

/* --- 1. Accent (System Blue: Affirmative Action) --- */
.accent {
  background-color: #007aff; /* Apple System Blue */
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 5px 15px rgba(0, 122, 255, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.1);
}
.accent:hover:not([disabled]) {
  background-color: #0073e5;
}

/* --- 2. Destructive (System Red: Warning/Delete) --- */
.destructive {
  background-color: #ff3b30; /* Apple System Red */
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 5px 15px rgba(255, 59, 48, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.1);
}
.destructive:hover:not([disabled]) {
  background-color: #e5362b;
}

/* --- 3. Primary (Dark Glass: Default/Secondary Action) --- */
.primary {
  background-color: rgba(30, 30, 30, 0.4); /* Dark Glass */
  color: white;
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.3),
    0 3px 6px rgba(0, 0, 0, 0.2);
}
.primary:hover:not([disabled]) {
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ); /* Subtle white overlay on hover */
}

/* --- 4. Light (White Glass: Secondary Action over dark BG) --- */
.light {
  background-color: rgba(255, 255, 255, 0.65); /* Light Glass */
  color: #1f2937; /* Dark text */
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 10px 15px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.05);
}
.light:hover:not([disabled]) {
  background-color: rgba(255, 255, 255, 0.9);
}

/* --- 5. Custom Color --- */
.custom {
  background-color: var(
    --custom-color-base,
    #33333360
  ); /* Default to dark if var is missing */
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.1);
}
.custom:hover:not([disabled]) {
  background-color: var(--custom-color-hover, #333333);
}

/* ===================================================================
   DISABLED STATE
   =================================================================== */
.disabled {
  background-color: rgba(107, 114, 128, 0.3); /* Gray/Disabled Glass */
  border-color: rgba(156, 163, 175, 0.2);
  color: #9ca3af; /* Light Gray Text */
  cursor: not-allowed;
  opacity: 0.6;
  transform: none !important; /* Override active/hover transformations */
  box-shadow: none !important;
}
</style>
