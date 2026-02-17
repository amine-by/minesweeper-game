<script setup lang="ts">
import { computed } from "vue";

export type CellProps = {
  state: "HIDDEN" | "REVEALED" | "FLAGGED";
  isMine: boolean;
  adjacentMinesCount?: number;
};

const { state, isMine, adjacentMinesCount } = defineProps<CellProps>();

const stateClass = computed(() => `cell--${state.toLowerCase()}`);

const content = computed(() => {
  if (state === "FLAGGED") return "🚩";

  if (state === "REVEALED") {
    if (isMine) return "💣";
    if (adjacentMinesCount === 0) return "";
    return adjacentMinesCount;
  }

  return "";
});

const contentClass = computed(() =>
  typeof content.value === "number" ? "cell--text" : "",
);
</script>

<template>
  <button
    class="cell"
    @click.left.prevent="$emit('reveal')"
    @click.right.prevent="$emit('flag')"
  >
    <div :class="stateClass">
      <span :class="contentClass">{{ content }}</span>
    </div>
  </button>
</template>

<style scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #0e0e0e;
  font-family: "Nunito", sans-serif;
  font-size: 24px;
}

.cell--text {
  background-image: linear-gradient(to bottom right, #002966, #0052cc);
  background-clip: text;
  color: transparent;
}

.cell--hidden,
.cell--flagged {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 1px;
  background-image: linear-gradient(to bottom right, #d27d49, #87460e);
}

.cell--revealed {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 1px;
  background-image: linear-gradient(to bottom right, #fce6b4, #fbd195);
}
</style>
