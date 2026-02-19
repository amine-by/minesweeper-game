import { getAdjacentCellCoordinates } from "./adjacency";

export function generateMinesCoordinates(
  revealedRowIndex: number,
  revealedColumnIndex: number,
) {
  const adjacentCellIndexes = getAdjacentCellCoordinates({
    rowIndex: revealedRowIndex,
    columnIndex: revealedColumnIndex,
  }).map(({ rowIndex, columnIndex }) => rowIndex * 8 + columnIndex);

  const revealedIndex = revealedRowIndex * 8 + revealedColumnIndex;

  return Array.from({ length: 64 }, (_, i) => i)
    .filter(
      (index) =>
        index !== revealedIndex &&
        adjacentCellIndexes.every(
          (adjacentCellIndex) => index !== adjacentCellIndex,
        ),
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((mineIndex) => ({
      rowIndex: Math.floor(mineIndex / 8),
      columnIndex: mineIndex % 8,
    }));
}
