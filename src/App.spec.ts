import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import App from "./App.vue";
import Cell from "./components/Cell.vue";

describe("App", () => {
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
        expect(cell.props("isHidden")).toBeTruthy();
      });
    });
    it("should reveal a hidden cell when left clicked", async () => {
      const app = mount(App);
      const cell = app.findAllComponents(Cell)[36];
      await cell?.trigger("click.left");
      expect(cell?.props("isHidden")).toBeFalsy();
    });
    it("should place 10 mines after the first cell is revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      const mineCount = cells.filter((c) => c.props("isMine")).length;
      expect(mineCount).toBe(10);
    });
    it("should reveal all mines when a mine is revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      const mines = cells.filter((cell) => cell.props("isMine"));
      await mines[4]?.trigger("click.left");
      mines.forEach((mine) => {
        expect(mine.props("isHidden")).toBeFalsy();
      });
    });
    it("should reveal all mines when all non mine cells are revealed", async () => {
      const app = mount(App);
      const cells = app.findAllComponents(Cell);
      await cells[36]?.trigger("click.left");
      await Promise.all(
        cells
          .filter((cell, index) => index !== 36 && !cell.props("isMine"))
          .map((safeCell) => safeCell.trigger("click.left")),
      );
      const mines = cells.filter((cell) => cell.props("isMine"));
      mines.forEach((mine) => {
        expect(mine.props("isHidden")).toBeFalsy();
      });
    });
    it("should reveal the count of mines existing in adjacent cells when a hidden cell is revealed", () => {
      throw new Error("");
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
