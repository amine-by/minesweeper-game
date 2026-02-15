import { afterEach, describe, expect, it, vi } from "vitest";

import { mount, VueWrapper } from "@vue/test-utils";
import App from "./App.vue";
import Cell from "./components/Cell.vue";

import * as minesModule from "./game/mines";

describe("App", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("core-gameplay", () => {
    it("should display an 8x8 grid", () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      expect(cells).toHaveLength(64);
    });
    it("should make all grid cells hidden on intial load", () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      cells.forEach((cell) => {
        expect(cell.props("state")).toBe("HIDDEN");
      });
    });
    it("should reveal a hidden cell when left clicked", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      expect(cell.props("state")).toBe("REVEALED");
    });
    it("should place 10 mines after the first cell is revealed", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      const mineCount = app
        .findAllComponents(Cell)
        .filter((cell) => cell.props("isMine")).length;
      expect(mineCount).toBe(10);
    });
    it("should reveal all mines when a mine is revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 2 },
      ]);
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-0-0']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      const mine = app.findComponent("[data-test='cell-0-1']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await mine?.trigger("click.left");
      const mines = app
        .findAllComponents(Cell)
        .filter((cell) => cell.props("isMine"));
      mines.forEach((mine) => {
        expect(mine.props("state")).toBe("REVEALED");
      });
    });
    it("should reveal all mines when all non mine cells are revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ]);

      const app = mount(App);

      const firstSafeCell = app.findComponent("[data-test='cell-5-5']");
      await firstSafeCell.trigger("click.left");

      const mines = app
        .findAllComponents(Cell)
        .filter((c) => c.props("isMine"));

      mines.forEach((mine) => {
        expect(mine.props("state")).toBe("REVEALED");
      });
    });
    it("should reveal the count of mines existing in adjacent cells when a hidden cell is revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ]);
      const app = mount(App);
      const cell1 = app.findComponent("[data-test='cell-1-2']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell1.trigger("click.left");
      expect(cell1.props("adjacentMinesCount")).toBe(4);

      const cell2 = app.findComponent("[data-test='cell-1-3']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell2.trigger("click.left");
      expect(cell2.props("adjacentMinesCount")).toBe(3);
    });
    it("should recursively reveal all adjacent cells when a hidden cell having no adjacent mines is revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 1, columnIndex: 2 },
        { rowIndex: 2, columnIndex: 0 },
        { rowIndex: 2, columnIndex: 1 },
        { rowIndex: 2, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 1, columnIndex: 5 },
        { rowIndex: 2, columnIndex: 5 },
        { rowIndex: 2, columnIndex: 6 },
        { rowIndex: 2, columnIndex: 7 },
      ]);

      const app = mount(App);

      const cell1 = app.findComponent("[data-test='cell-0-0']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell1.trigger("click.left");

      for (let r1 = 0; r1 < 2; r1++) {
        for (let c1 = 0; c1 < 2; c1++) {
          const currentCell = app.findComponent(
            `[data-test='cell-${r1}-${c1}']`,
          ) as VueWrapper<InstanceType<typeof Cell>>;
          expect(currentCell.props("state")).toBe("REVEALED");
        }
      }

      const cell2 = app.findComponent("[data-test='cell-0-7']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell2.trigger("click.left");

      for (let r2 = 0; r2 < 2; r2++) {
        for (let c2 = 6; c2 < 8; c2++) {
          const currentCell = app.findComponent(
            `[data-test='cell-${r2}-${c2}']`,
          ) as VueWrapper<InstanceType<typeof Cell>>;
          expect(currentCell.props("state")).toBe("REVEALED");
        }
      }
    });
  });

  describe("game-state", () => {
    it("should set the game state to 'IDLE' on initial load", () => {
      const app = mount(App);
      expect(app.vm.gameState).toBe("IDLE");
    });
    it("should set the game state to 'PLAYING' after the first cell is revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 2 },
      ]);
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-0-0']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      expect(app.vm.gameState).toBe("PLAYING");
    });
    it("should set the game state to 'LOST' after a mine is revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
        { rowIndex: 1, columnIndex: 2 },
      ]);
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-0-0']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      const mine = app.findComponent("[data-test='cell-0-1']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await mine.trigger("click.left");
      expect(app.vm.gameState).toBe("LOST");
    });
    it("should set the game state to 'WON' after all non mine cells are revealed", async () => {
      vi.spyOn(minesModule, "generateMinesCoordinates").mockReturnValue([
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 },
        { rowIndex: 0, columnIndex: 2 },
        { rowIndex: 0, columnIndex: 3 },
        { rowIndex: 0, columnIndex: 4 },
        { rowIndex: 0, columnIndex: 5 },
        { rowIndex: 0, columnIndex: 6 },
        { rowIndex: 0, columnIndex: 7 },
        { rowIndex: 1, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ]);
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']");
      await cell.trigger("click.left");
      expect(app.vm.gameState).toBe("WON");
    });
  });

  describe("flags", () => {
    it("should mark a hidden cell by a flag when right clicked", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.right");
      expect(cell.props("state")).toBe("FLAGGED");
    });
    it("should unmark a flagged cell when right clicked", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.right");
      await cell.trigger("click.right");
      expect(cell.props("state")).toBe("HIDDEN");
    });
    it("should not reveal a flagged cell when left clicked", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.right");
      await cell.trigger("click.left");
      expect(cell.props("state")).toBe("FLAGGED");
    });
  });
});
