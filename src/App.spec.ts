import { describe, it } from "vitest";

describe("App", () => {
  describe("core-gameplay", () => {
    it("should display an 8x8 grid", () => {
      throw new Error("");
    });
    it("should make all grid cells hidden on intial load", () => {
      throw new Error("");
    });
    it("should reveal a hidden cell when left clicked", () => {
      throw new Error("");
    });
    it("should place 10 mines after the first cell is revealed", () => {
      throw new Error("");
    });
    it("should reveal all cells when a mine is revealed", () => {
      throw new Error("");
    });
    it("should reveal all mines when all non mine cells are revealed", () => {
      throw new Error("");
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
      throw new Error("");
    });
    it("should set the game state to 'PLAYING' after the first cell is revealed", () => {
      throw new Error("");
    });
    it("should set the game state to 'LOST' after a mine is revealed", () => {
      throw new Error("");
    });
    it("should set the game state to 'WON' after all non mine cells are revealed", () => {
      throw new Error("");
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
