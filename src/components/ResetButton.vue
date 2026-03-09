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
  <button>{{ content }}</button>
</template>
<style scoped></style>
