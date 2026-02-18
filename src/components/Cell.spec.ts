import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Cell from "./Cell.vue";

describe("Cell", () => {
  describe("state", () => {
    it("should display hidden inner style when state is 'HIDDEN'", () => {
      const cell = mount(Cell, {
        props: {
          state: "HIDDEN",
          isMine: false,
          isWon: false,
        },
      });
      const inner = cell.find("div");
      expect(inner.classes()).toContain("cell--inner--hidden");
    });
    it("should display revealed inner style when state is 'FLAGGED' and isWon is false", () => {
      const cell = mount(Cell, {
        props: {
          state: "FLAGGED",
          isMine: false,
          isWon: false,
        },
      });
      const inner = cell.find("div");
      expect(inner.classes()).toContain("cell--inner--hidden");
    });
    it("should display won inner style when state is 'FLAGGED' and isWon is true", () => {
      const cell = mount(Cell, {
        props: {
          state: "FLAGGED",
          isMine: false,
          isWon: true,
        },
      });
      const inner = cell.find("div");
      expect(inner.classes()).toContain("cell--inner--won");
    });
    it("should display revealed inner style when state is 'REVEALED' and isMine is false", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: false,
          isWon: false,
        },
      });
      const inner = cell.find("div");
      expect(inner.classes()).toContain("cell--inner--revealed");
    });
    it("should display lost inner style when state is 'REVEALED' and isMine is true", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: true,
          isWon: false,
        },
      });
      const inner = cell.find("div");
      expect(inner.classes()).toContain("cell--inner--lost");
    });
  });

  describe("content", () => {
    it("should display empty content when state is 'HIDDEN'", () => {
      const cell = mount(Cell, {
        props: {
          state: "HIDDEN",
          isMine: false,
          isWon: false,
          adjacentMinesCount: 3,
        },
      });

      expect(cell.text()).toBe("");
    });

    it("should display a flag when state is 'FLAGGED'", () => {
      const cell = mount(Cell, {
        props: {
          state: "FLAGGED",
          isMine: false,
          isWon: false,
          adjacentMinesCount: 3,
        },
      });

      expect(cell.text()).toContain("🚩");
    });

    it("should display a mine when state is 'REVEALED' and isMine is true", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: true,
          isWon: false,
          adjacentMinesCount: 0,
        },
      });

      expect(cell.text()).toContain("💣");
    });

    it("should display empty content when state is 'REVEALED', isMine is false and adjacentMinesCount is 0", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: false,
          isWon: false,
          adjacentMinesCount: 0,
        },
      });

      expect(cell.text()).toBe("");
    });

    it("should display 1 when state is 'REVEALED', isMine is false and adjacentMinesCount is 1", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: false,
          isWon: false,
          adjacentMinesCount: 1,
        },
      });

      expect(cell.text()).toBe("1");
    });

    it("should display 8 when state is 'REVEALED', isMine is false and adjacentMinesCount is 8", () => {
      const cell = mount(Cell, {
        props: {
          state: "REVEALED",
          isMine: false,
          isWon: false,
          adjacentMinesCount: 8,
        },
      });

      expect(cell.text()).toBe("8");
    });
  });
});
