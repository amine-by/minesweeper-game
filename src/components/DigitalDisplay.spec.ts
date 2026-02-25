import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DigitalDisplay from "./DigitalDisplay.vue";

describe("DigitalDisplay", () => {
  it("should display '001' when digits value is equal to '1'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: 1,
      },
    });

    expect(display.text()).toBe("001");
  });
  it("should display '011' when digits value is equal to '11'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: 11,
      },
    });

    expect(display.text()).toBe("011");
  });
  it("should display '999' when digits value is bigger than '999'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: 1000,
      },
    });

    expect(display.text()).toBe("999");
  });
  it("should display '-01' when digits value is equal to '-1'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: -1,
      },
    });

    expect(display.text()).toBe("-01");
  });
  it("should display '-11' when digits value is equal to '-11'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: -11,
      },
    });

    expect(display.text()).toBe("-11");
  });
  it("should display '-99' when digits value is less than '-99'", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: -100,
      },
    });

    expect(display.text()).toBe("-99");
  });
  it("should display only the integral part of the number", () => {
    const display = mount(DigitalDisplay, {
      props: {
        digits: 50.123,
      },
    });

    expect(display.text()).toBe("050");
  });
});
