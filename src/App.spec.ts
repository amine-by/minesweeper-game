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
        expect(cell.props("isHidden")).toBe(true);
      });
    });
    it("should reveal a hidden cell when left clicked", async () => {
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      expect(cell.props("isHidden")).toBe(false);
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
      const app = mount(App);
      const cell = app.findComponent("[data-test='cell-5-5']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      const mines = app
        .findAllComponents(Cell)
        .filter((cell) => cell.props("isMine"));
      await mines[4]?.trigger("click.left");
      mines.forEach((mine) => {
        expect(mine.props("isHidden")).toBe(false);
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
      const cell = app.findComponent("[data-test='cell-1-2']") as VueWrapper<
        InstanceType<typeof Cell>
      >;
      await cell.trigger("click.left");
      const mines = app
        .findAllComponents(Cell)
        .filter((cell) => cell.props("isMine"));
      mines.forEach((mine) => {
        expect(mine.props("isHidden")).toBe(true);
      });
      await mines[0]?.trigger("click.left");
      mines.forEach((mine) => {
        expect(mine.props("isHidden")).toBe(false);
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
    it("should recursively reveal all adjacent cells when a hidden cell having no adjacent mines is revealed", () => {
      throw new Error("");
    });
  });

  describe("game-state", () => {
    it("should set the game state to 'IDLE' on initial load", () => {
      const app = mount(App);
      expect(app.vm.gameState).toBe("IDLE");
    });
    it("should set the game state to 'PLAYING' after the first cell is revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      expect(app.vm.gameState).toBe("PLAYING");
    });
    it("should set the game state to 'LOST' after a mine is revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      const mine = cells.find((cell) => cell.props("isMine"));
      mine?.trigger("click.left");
      expect(app.vm.gameState).toBe("LOST");
    });
    it("should set the game state to 'WON' after all non mine cells are revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      await Promise.all(
        cells
          .filter((cell, index) => index !== 36 && !cell.props("isMine"))
          .map((safeCell) => safeCell.trigger("click.left")),
      );
      expect(app.vm.gameState).toBe("WON");
    });
  });

  describe("flags", () => {
    it("should mark a hidden cell by a flag when right clicked", () => {
      throw new Error("");
    });
    it("should unmark a flagged cell when right clicked", () => {
      throw new Error("");
    });
    it("should not reveal a flagged cell when left clicked", () => {
      throw new Error("");
    });
  });
});
