export function generateMinesCoordinates(
  revealedRowIndex: number,
  revealedColumnIndex: number,
) {
  const revealedIndex = revealedRowIndex * 8 + revealedColumnIndex;
  return Array.from({ length: 64 }, (_, i) => i)
    .filter((index) => index !== revealedIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((mineIndex) => ({
      rowIndex: Math.floor(mineIndex / 8),
      columnIndex: mineIndex % 8,
    }));
}
