import { describe, expect, it } from "vitest";
import { generateMinesCoordinates } from "./mines";

describe("mines", () => {
  describe("generateMines", () => {
    it("should generate 10 mines", () => {
      const mines = generateMinesCoordinates(1, 2);
      expect(mines.length).toBe(10);
    });
  });
});
