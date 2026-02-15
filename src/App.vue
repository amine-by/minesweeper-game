<script setup lang="ts">
import Cell from "./components/Cell.vue";
import { ref } from "vue";
import { generateMinesCoordinates } from "./game/mines";
import {
  countAdjacentMines,
  getAdjacentCellCoordinates,
} from "./game/adjacency";

type GameState = "IDLE" | "PLAYING" | "LOST" | "WON";

export type Cell = {
  state: "HIDDEN" | "REVEALED" | "FLAGGED";
  isMine: boolean;
  adjacentMinesCount?: number;
};
export type Grid = Cell[][];

const gameState = ref<GameState>("IDLE");
const grid = ref<Grid>(
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ state: "HIDDEN", isMine: false })),
  ),
);

function placeMines(revealedRowIndex: number, revealedColumnIndex: number) {
  const minesCoordinates = generateMinesCoordinates(
    revealedRowIndex,
    revealedColumnIndex,
  );

  minesCoordinates.forEach(({ rowIndex, columnIndex }) => {
    const cellRow = grid.value[rowIndex];
    if (!cellRow) return;

    const cell = cellRow[columnIndex];
    if (!cell) return;

    cell.isMine = true;
  });
}

function reveal(rowIndex: number, columnIndex: number) {
  const currentRow = grid.value[rowIndex];
  if (!currentRow) return;

  const currentCell = currentRow[columnIndex];
  if (!currentCell) return;

  if (currentCell.state === "FLAGGED") return;

  switch (gameState.value) {
    case "IDLE":
      currentCell.state = "REVEALED";
      placeMines(rowIndex, columnIndex);
      gameState.value = "PLAYING";
      currentCell.adjacentMinesCount = countAdjacentMines({
        grid: grid.value,
        cellCoordinates: { rowIndex, columnIndex },
      });
      if (currentCell.adjacentMinesCount === 0)
        getAdjacentCellCoordinates({ rowIndex, columnIndex }).forEach(
          ({ rowIndex, columnIndex }) => {
            if (grid.value[rowIndex]?.[columnIndex]?.state === "HIDDEN")
              reveal(rowIndex, columnIndex);
          },
        );
      break;

    case "PLAYING":
      if (currentCell.isMine) {
        grid.value.forEach((row) =>
          row
            .filter((cell) => cell.isMine)
            .forEach((mine) => (mine.state = "REVEALED")),
        );
        gameState.value = "LOST";
      } else {
        currentCell.state = "REVEALED";
        const revealedCellsSum = grid.value.reduce(
          (acc, row) =>
            acc + row.filter((cell) => cell.state === "REVEALED").length,
          0,
        );
        if (revealedCellsSum === 54) {
          grid.value.forEach((row) =>
            row
              .filter((cell) => cell.isMine)
              .forEach((mine) => (mine.state = "REVEALED")),
          );
          gameState.value = "WON";
        }
        currentCell.adjacentMinesCount = countAdjacentMines({
          grid: grid.value,
          cellCoordinates: { rowIndex, columnIndex },
        });
        if (currentCell.adjacentMinesCount === 0)
          getAdjacentCellCoordinates({ rowIndex, columnIndex }).forEach(
            ({ rowIndex, columnIndex }) => {
              if (grid.value[rowIndex]?.[columnIndex]?.state === "HIDDEN")
                reveal(rowIndex, columnIndex);
            },
          );
      }
      break;
  }
}

function flag(rowIndex: number, columnIndex: number) {
  const currentRow = grid.value[rowIndex];
  if (!currentRow) return;

  const currentCell = currentRow[columnIndex];
  if (!currentCell) return;

  if (currentCell.state === "FLAGGED") {
    currentCell.state = "HIDDEN";
    return;
  }
  currentCell.state = "FLAGGED";
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
      :state="column.state"
      :is-mine="column.isMine"
      :adjacent-mines-count="column.adjacentMinesCount"
      v-on:reveal="reveal(rowIndex, columnIndex)"
      v-on:flag="flag(rowIndex, columnIndex)"
      :data-test="`cell-${rowIndex}-${columnIndex}`"
    />
  </div>
</template>

<style scoped></style>
