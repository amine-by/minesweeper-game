import type { Grid } from "@/App.vue";

type CellCoordinates = { rowIndex: number; columnIndex: number };
type CountAdjacentMinesParams = {
  grid: Grid;
  cellCoordinates: CellCoordinates;
};
export function getAdjacentCellCoordinates({
  rowIndex,
  columnIndex,
}: CellCoordinates) {
  const rowIndexes =
    rowIndex === 0
      ? [0, 1]
      : rowIndex === 7
        ? [6, 7]
        : [rowIndex - 1, rowIndex, rowIndex + 1];
  const columnIndexes =
    columnIndex === 0
      ? [0, 1]
      : columnIndex === 7
        ? [6, 7]
        : [columnIndex - 1, columnIndex, columnIndex + 1];

  return rowIndexes
    .reduce((result, rowIndex) => {
      const indexes = columnIndexes.map((columnIndex) => ({
        rowIndex,
        columnIndex,
      }));
      result.push(...indexes);
      return result;
    }, [] as CellCoordinates[])
    .filter(
      ({ rowIndex: currentRowIndex, columnIndex: currentColumnIndex }) =>
        currentRowIndex !== rowIndex || currentColumnIndex !== columnIndex,
    );
}

export function countAdjacentMines({
  grid,
  cellCoordinates,
}: CountAdjacentMinesParams) {
  return getAdjacentCellCoordinates(cellCoordinates).filter(
    ({ rowIndex, columnIndex }) => grid[rowIndex]![columnIndex]?.isMine,
  ).length;
}
