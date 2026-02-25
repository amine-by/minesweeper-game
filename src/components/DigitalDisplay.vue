<script setup lang="ts">
import { computed } from "vue";

export type DigitalDisplayType = {
  digits: number;
};

const { digits } = defineProps<DigitalDisplayType>();

const content = computed(() => {
  if (digits >= 999) return "999";
  if (digits <= -99) return "-99";
  if (digits < 0) return "-" + ("00" + Math.floor(-digits)).slice(-2);
  return ("000" + Math.floor(digits)).slice(-3);
});
</script>

<template>
  <div class="display">{{ content }}</div>
</template>

<style scoped>
.display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #a01c1c 20%, #3a0a0a 80%);
}
</style>
