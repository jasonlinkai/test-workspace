var f = require("./index");

describe('footer', () => {
  test("test footer func result is footer", () => {
    // TODO: test something that should not log
    expect(f()).toBe("footer");
  });
})