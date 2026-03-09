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
  <div class="display">
    <span class="display-content">{{ content }}</span>
  </div>
</template>

<style scoped>
.display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
  border-radius: 6px;
  border-bottom: "#0e0e0e";
  border-width: 2px;
  border-style: solid;
  background-image: linear-gradient(to bottom, #a01c1c 20%, #3a0a0a 80%);
}

.display-content {
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(to bottom, #f98c47, #f42204);
  font-size: 24px;
  font-family: "Share Tech Mono", monospace;
}
</style>
