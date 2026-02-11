<script setup lang="ts">
import Cell from "./components/Cell.vue";
import { ref } from "vue";

type GameState = "IDLE" | "PLAYING" | "LOST" | "WON";
const gameState = ref<GameState>("IDLE");
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

  const currentCell = grid.value[rowIndex]![columnIndex];

  switch (gameState.value) {
    case "IDLE":
      currentCell!.isHidden = false;
      placeMines(rowIndex, columnIndex);
      gameState.value = "PLAYING";
      break;

    case "PLAYING":
      if (currentCell!.isMine) {
        grid.value.forEach((row) =>
          row
            .filter((cell) => cell.isMine)
            .forEach((mine) => (mine.isHidden = false)),
        );
        gameState.value = "LOST";
      } else {
        currentCell!.isHidden = false;
        const revealedCellsSum = grid.value.reduce(
          (acc, row) => acc + row.filter((cell) => !cell.isHidden).length,
          0,
        );
        if (revealedCellsSum === 54) {
          grid.value.forEach((row) =>
            row
              .filter((cell) => cell.isMine)
              .forEach((mine) => (mine.isHidden = false)),
          );
          gameState.value = "WON";
        }
      }
      break;
  }
}

defineExpose({
  gameState,
});
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
