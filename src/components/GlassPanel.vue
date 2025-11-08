<template>
  <div class="glass-panel">
    <div v-if="title" class="panel-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
}

// Using withDefaults for future-proofing, even if no default is strictly necessary for title.
withDefaults(defineProps<Props>(), {
  title: '',
})
</script>
