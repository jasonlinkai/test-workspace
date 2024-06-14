import f from "./index";

describe("app", () => {
  test("test app func result is app", () => {
    // TODO: test something that should not log
    expect(f()).toBe("app");
  });
});
