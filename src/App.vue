<script setup lang="ts">
import Cell from "./components/Cell.vue";
import { ref } from "vue";
const grid = ref<boolean[][]>(
  Array.from({ length: 8 }, () => Array(8).fill(true)),
);
function reveal(rowIndex: number, columnIndex: number) {
  if (rowIndex < 0 || rowIndex >= grid.value.length) return;
  if (columnIndex < 0 || columnIndex >= grid.value[rowIndex]!.length) return;

  grid.value[rowIndex]![columnIndex] = false;
}
</script>

<template>
  <div v-for="(row, rowIndex) in grid" :key="rowIndex">
    <Cell
      v-for="(column, columnIndex) in row"
      :key="columnIndex"
      :is-hidden="column"
      v-on:reveal="reveal(rowIndex, columnIndex)"
    />
  </div>
</template>

<style scoped></style>
