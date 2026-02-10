<script setup lang="ts">
import Cell from "./components/Cell.vue";
import { ref } from "vue";
const grid = ref<{ isHidden: boolean; isMine: boolean }[][]>(
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ isHidden: true, isMine: false })),
  ),
);

function placeMines(revealedRowIndex: number, revealedColumnIndex: number) {
  const totalCells = 64;
  const revealedIndex = revealedRowIndex * 8 + revealedColumnIndex;

  const mineIndexes = Array.from({ length: totalCells }, (_, i) => i)
    .filter((i) => i !== revealedIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  mineIndexes.forEach((mineIndex) => {
    const mineRowIndex = Math.floor(mineIndex / 8);
    const mineColumnIndex = mineIndex % 8;
    grid.value[mineRowIndex]![mineColumnIndex]!.isMine = true;
  });
}

function reveal(rowIndex: number, columnIndex: number) {
  if (rowIndex < 0 || rowIndex >= grid.value.length) return;
  if (columnIndex < 0 || columnIndex >= grid.value[rowIndex]!.length) return;

  grid.value[rowIndex]![columnIndex]!.isHidden = false;
  placeMines(rowIndex, columnIndex);
}
</script>

<template>
  <div v-for="(row, rowIndex) in grid" :key="rowIndex">
    <Cell
      v-for="(column, columnIndex) in row"
      :key="columnIndex"
      :is-hidden="column.isHidden"
      :is-mine="column.isMine"
      v-on:reveal="reveal(rowIndex, columnIndex)"
    />
  </div>
</template>

<style scoped></style>
