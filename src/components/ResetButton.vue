<script setup lang="ts">
import type { GameState } from "@/App.vue";
import { computed } from "vue";

export type ResetButtonType = {
  gameState: GameState;
};

const { gameState } = defineProps<ResetButtonType>();
const content = computed(() => {
  if (gameState === "LOST") return "😵";
  if (gameState === "WON") return "😎";
  return "🙂";
});
</script>
<template>
  <button class="reset-button" @click.prevent="$emit('resetGame')">
    {{ content }}
  </button>
</template>
<style scoped>
.reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom right, #d27d49, #87460e);
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
  border-style: #0e0e0e;
  font-size: 20px;
  font-family: "Share Tech Mono", monospace;
}
</style>
