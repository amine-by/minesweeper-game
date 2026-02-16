<script setup lang="ts">
import { computed, type CSSProperties, type StyleValue } from "vue";

export type CellProps = {
  state: "HIDDEN" | "REVEALED" | "FLAGGED";
  isMine: boolean;
  adjacentMinesCount?: number;
};

const { state, isMine, adjacentMinesCount } = defineProps<CellProps>();

const styleHashmap: Record<CellProps["state"], CSSProperties> = {
  HIDDEN: {
    backgroundColor: "lightgray",
    borderWidth: "8px",
    borderRightColor: "darkgray",
    borderBottomColor: "darkgray",
    borderLeftColor: "white",
    borderTopColor: "white",
  },
  FLAGGED: {
    backgroundColor: "lightgray",
    borderWidth: "8px",
    borderRightColor: "darkgray",
    borderBottomColor: "darkgray",
    borderLeftColor: "white",
    borderTopColor: "white",
  },
  REVEALED: {
    backgroundColor: "gray",
    borderWidth: "4px",
    borderColor: "darkgray",
  },
};

const content = computed(() => {
  if (state === "FLAGGED") return "🚩";

  if (state === "REVEALED") {
    if (isMine) return "💣";
    if (adjacentMinesCount === 0) return "";
    return String(adjacentMinesCount);
  }

  return "";
});
</script>

<template>
  <button
    :style="{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '40px',
      height: '40px',
      ...styleHashmap[state],
    }"
    @click.left="$emit('reveal')"
    @click.right.prevent="$emit('flag')"
  >
    {{ content }}
  </button>
</template>
