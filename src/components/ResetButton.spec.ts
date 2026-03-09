import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ResetButton from "./ResetButton.vue";

describe("ResetButton", () => {
  it('should display 🙂 when gameState is "IDLE"', () => {
    const resetButton = mount(ResetButton, {
      props: {
        gameState: "IDLE",
      },
    });
    expect(resetButton.text()).toContain("🙂");
  });
  it('should display 🙂 when gameState is "PLAYING"', () => {
    const resetButton = mount(ResetButton, {
      props: {
        gameState: "PLAYING",
      },
    });
    expect(resetButton.text()).toContain("🙂");
  });
  it('should display 😵 when gameState is "LOST"', () => {
    const resetButton = mount(ResetButton, {
      props: {
        gameState: "LOST",
      },
    });
    expect(resetButton.text()).toContain("😵");
  });
  it('should display 😎 when gameState is "WON"', () => {
    const resetButton = mount(ResetButton, {
      props: {
        gameState: "WON",
      },
    });
    expect(resetButton.text()).toContain("😎");
  });
});
