import { describe, expect, it } from "vitest";
import { countAdjacentMines, getAdjacentCellCoordinates } from "./adjacency";
import type { Grid } from "@/App.vue";

describe("adjacency", () => {
  describe("getAdjacentCellsIndexes", () => {
    it("should return 0-1, 1-0, 1-1 indexes for 0-0 input", () => {
      const cellIndexes = getAdjacentCellCoordinates({
        rowIndex: 0,
        columnIndex: 0,
      });

      const expectedCellIndexes = [
        {
          rowIndex: 0,
          columnIndex: 1,
        },
        {
          rowIndex: 1,
          columnIndex: 0,
        },
        {
          rowIndex: 1,
          columnIndex: 1,
        },
      ];

      expect(cellIndexes.sort()).toEqual(expectedCellIndexes.sort());
    });

    it("should return 0-6, 0-7, 1-6, 2-6, 2-7 indexes for 1-7 input", () => {
      const cellIndexes = getAdjacentCellCoordinates({
        rowIndex: 1,
        columnIndex: 7,
      });

      const expectedCellIndexes = [
        {
          rowIndex: 0,
          columnIndex: 6,
        },
        {
          rowIndex: 0,
          columnIndex: 7,
        },
        {
          rowIndex: 1,
          columnIndex: 6,
        },
        {
          rowIndex: 2,
          columnIndex: 6,
        },
        {
          rowIndex: 2,
          columnIndex: 7,
        },
      ];

      expect(cellIndexes.sort()).toEqual(expectedCellIndexes.sort());
    });

    it("should return 1-1, 1-2, 1-3, 2-1, 2-3, 3-1, 3-2, 3-3 indexes for 2-2 input", () => {
      const cellIndexes = getAdjacentCellCoordinates({
        rowIndex: 2,
        columnIndex: 2,
      });

      const expectedCellIndexes = [
        {
          rowIndex: 1,
          columnIndex: 1,
        },
        {
          rowIndex: 1,
          columnIndex: 2,
        },
        {
          rowIndex: 1,
          columnIndex: 3,
        },
        {
          rowIndex: 2,
          columnIndex: 1,
        },
        {
          rowIndex: 2,
          columnIndex: 3,
        },
        {
          rowIndex: 3,
          columnIndex: 1,
        },
        {
          rowIndex: 3,
          columnIndex: 2,
        },
        {
          rowIndex: 3,
          columnIndex: 3,
        },
      ];

      expect(cellIndexes.sort()).toEqual(expectedCellIndexes.sort());
    });

    it("should return 6-3, 6-4, 6-5, 7-3, 7-5 indexes for 7-4 input", () => {
      const cellIndexes = getAdjacentCellCoordinates({
        rowIndex: 7,
        columnIndex: 4,
      });

      const expectedCellIndexes = [
        {
          rowIndex: 6,
          columnIndex: 3,
        },
        {
          rowIndex: 6,
          columnIndex: 4,
        },
        {
          rowIndex: 6,
          columnIndex: 5,
        },
        {
          rowIndex: 7,
          columnIndex: 3,
        },
        {
          rowIndex: 7,
          columnIndex: 5,
        },
      ];

      expect(cellIndexes.sort()).toEqual(expectedCellIndexes.sort());
    });
  });

  describe("countAdjacentMines", () => {
    it("should return 0 when no adjacent cell is a mine", () => {
      const grid: Grid = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => ({ state: "HIDDEN", isMine: false })),
      );

      expect(
        countAdjacentMines({
          grid,
          cellCoordinates: { rowIndex: 2, columnIndex: 2 },
        }),
      ).toBe(0);
    });

    it("should return 1 when only one of the adjacent cells is a mine", () => {
      const grid: Grid = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => ({ state: "HIDDEN", isMine: false })),
      );
      const cellCoordinates = { rowIndex: 2, columnIndex: 2 };
      const adjacentCellCoordinates =
        getAdjacentCellCoordinates(cellCoordinates);
      adjacentCellCoordinates
        .slice(0, 1)
        .forEach(({ rowIndex, columnIndex }) => {
          grid[rowIndex]![columnIndex]!.isMine = true;
        });
      expect(countAdjacentMines({ grid, cellCoordinates })).toBe(1);
    });

    it("should return 8 when all adjacent cells are mines", () => {
      const grid: Grid = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => ({ state: "HIDDEN", isMine: false })),
      );
      const cellCoordinates = { rowIndex: 2, columnIndex: 2 };
      const adjacentCellCoordinates =
        getAdjacentCellCoordinates(cellCoordinates);
      adjacentCellCoordinates.forEach(({ rowIndex, columnIndex }) => {
        grid[rowIndex]![columnIndex]!.isMine = true;
      });
      expect(countAdjacentMines({ grid, cellCoordinates })).toBe(8);
    });
  });
});
