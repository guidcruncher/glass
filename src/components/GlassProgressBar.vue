<template>
  <section class="progress-section-container">
    <div class="progress-wrapper">
      <div class="progress-text-info">
        <span>Upload Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="progress-track">
        <div id="progress-fill" class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
/* ===================================================================
   THEME VARIABLES
   =================================================================== */
/* Dark Theme (Default) */
:root {
  --glass-bg: rgba(30, 30, 30, 0.4);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  --track-bg: rgba(255, 255, 255, 0.15);
  --button-bg: rgba(255, 255, 255, 0.2);
  --button-hover-bg: rgba(255, 255, 255, 0.3);
  --text-color: white;
}
/* Light Theme (Override) */
.dark {
  --track-bg: rgba(0, 0, 0, 0.15);
  --text-color: #1f2937;
}

/* ===================================================================
   CONTAINER AND LAYOUT
   =================================================================== */
.progress-section-container {
  /* Glass Panel Styling */
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 1rem; /* rounded-2xl */
  padding: 2rem; /* p-8 */
  color: var(--text-color);
}

.section-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 1.5rem;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

/* ===================================================================
   TEXT INFO
   =================================================================== */
.progress-text-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem; /* text-sm */
  opacity: 0.8;
}

/* ===================================================================
   PROGRESS BAR TRACK
   =================================================================== */
.progress-track {
  height: 0.75rem; /* h-3 */
  border-radius: 9999px; /* rounded-full */
  background-color: var(--track-bg);
  overflow: hidden;
  position: relative;
}

/* ===================================================================
   PROGRESS BAR FILL
   =================================================================== */
.progress-fill {
  height: 100%; /* h-full */
  border-radius: inherit; /* rounded-full */
  background: linear-gradient(to right, #007aff, #00c2ff); /* bg-gradient-to-r */
  transition: width 0.6s ease;
  position: relative;
}

/* Shimmer/Aesthetic effect (retaining complex CSS/Keyframes) */
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ===================================================================
   BUTTON
   =================================================================== */
.progress-control-button {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.75rem; /* rounded-xl */
  background-color: var(--button-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 500; /* font-medium */
  transition: background-color 0.2s ease;
  border: none;
  color: inherit;
  cursor: pointer;
}

.progress-control-button:hover {
  background-color: var(--button-hover-bg);
}
</style>
