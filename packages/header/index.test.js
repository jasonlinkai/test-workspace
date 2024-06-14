import f from "./index";

describe("header", () => {
  test("test header func result is header", () => {
    // TODO: test something that should not log
    expect(f()).toBe("header");
  });
});
