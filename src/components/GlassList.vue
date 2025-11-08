<script setup>
const emit = defineEmits(['row-click'])

// Define props. modelValue holds the list data.
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
    required: true,
  },
})

const handleItemClick = (item, index) => {
  emit('row-click', item, index)
}
</script>

<template>
  <div class="glass-list-container">
    <div class="glass-list-wrapper">
      <!-- HEADER SLOT -->
      <header v-if="$slots.header" class="list-header">
        <slot name="header"></slot>
      </header>

      <!-- LIST ITEMS -->
      <ul class="list-body">
        <li
          v-for="(item, index) in modelValue"
          :key="item.id || index"
          class="list-item clickable"
          @click="handleItemClick(item, index)"
        >
          <!-- ITEM SLOT -->
          <div class="item-content">
            <slot name="item" :item="item" :index="index">
              <!-- Default Item Co ntent -->
              <span class="default-label">
                <i v-if="item.icon" :class="item.icon"></i>&nbsp; {{ item.label || item.id }}</span
              >
            </slot>
          </div>
        </li>
      </ul>

      <!-- FOOTER SLOT -->
      <footer v-if="$slots.footer" class="list-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>
