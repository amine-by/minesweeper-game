<script setup lang="ts">
import Cell, { type CellType } from "./components/Cell.vue";
import { computed, ref, watch } from "vue";
import { generateMinesCoordinates } from "./game/mines";
import {
  countAdjacentMines,
  getAdjacentCellCoordinates,
} from "./game/adjacency";
import DigitalDisplay from "./components/DigitalDisplay.vue";

export type GameState = "IDLE" | "PLAYING" | "LOST" | "WON";

export type Grid = CellType[][];

const gameState = ref<GameState>("IDLE");
const grid = ref<Grid>(
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ state: "HIDDEN", isMine: false })),
  ),
);
const timer = ref<number>(0);

watch(gameState, (state, _, onCleanup) => {
  if (state !== "PLAYING") return;

  const interval = setInterval(() => {
    timer.value++;
  }, 1000);

  onCleanup(() => clearInterval(interval));
});

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

const flagTracker = computed(() => {
  return (
    10 - grid.value.flat().filter((cell) => cell.state === "FLAGGED").length
  );
});

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
              .forEach((mine) => (mine.state = "FLAGGED")),
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
  if (gameState.value === "LOST" || gameState.value === "WON") return;

  const currentRow = grid.value[rowIndex];
  if (!currentRow) return;

  const currentCell = currentRow[columnIndex];
  if (!currentCell) return;

  if (currentCell.state === "REVEALED") return;

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
  <div class="screen">
    <div class="grid-container">
      <div class="displays-container">
        <DigitalDisplay :data-test="'flag-tracker'" :digits="flagTracker" />
        <DigitalDisplay :data-test="'timer'" :digits="timer" />
      </div>
      <div class="grid">
        <div class="row" v-for="(row, rowIndex) in grid" :key="rowIndex">
          <Cell
            v-for="(column, columnIndex) in row"
            :key="columnIndex"
            :state="column.state"
            :is-mine="column.isMine"
            :is-won="gameState === 'WON'"
            :adjacent-mines-count="column.adjacentMinesCount"
            v-on:reveal="reveal(rowIndex, columnIndex)"
            v-on:flag="flag(rowIndex, columnIndex)"
            :data-test="`cell-${rowIndex}-${columnIndex}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: start;
  justify-content: center;
  padding-top: 100px;
}

.grid-container {
  padding: 10px;
  background-image: linear-gradient(to bottom, #f8bc48, #fcdc6e);
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  box-shadow: #00000040 0px 4px 4px 0px;
}

.displays-container {
  width: 100%;
  display: flex;
  flex-direction: "row";
  justify-content: space-between;
  padding-inline: 21px;
}

.grid {
  width: fit-content;
  border-color: #0e0e0e;
  border-width: 1px;
  border-style: solid;
}
.row {
  display: flex;
  flex-direction: row;
}
</style>
