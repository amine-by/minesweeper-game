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
  typeof content.value === "number" && content.value > 0
    ? `cell--content--number cell--content--${content.value}`
    : "",
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

.cell--content--number {
  background-clip: text;
  color: transparent;
}

.cell--content--1 {
  background-image: linear-gradient(to bottom right, #002966, #0052cc);
}

.cell--content--2 {
  background-image: linear-gradient(to bottom right, #003309, #00991c);
}

.cell--content--3 {
  background-image: linear-gradient(to bottom right, #660000, #cc0000);
}

.cell--content--4 {
  background-image: linear-gradient(to bottom right, #4b0066, #9600cc);
}

.cell--content--5 {
  background-image: linear-gradient(to bottom right, #005866, #00b1cc);
}

.cell--content--6 {
  background-image: linear-gradient(to bottom right, #662c00, #cc5800);
}

.cell--content--7 {
  background-image: linear-gradient(to bottom right, #66004c, #cc0099);
}

.cell--content--8 {
  background-image: linear-gradient(to bottom right, #666600, #cccc00);
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
