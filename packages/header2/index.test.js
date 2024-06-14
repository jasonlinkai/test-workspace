import f from "./index";

describe("header2", () => {
  test("test header2-test func result is header2-test", () => {
    // TODO: test something that should not log
    expect(f()).toBe("header2-test");
  });
});
