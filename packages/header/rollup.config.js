const babel = require("@rollup/plugin-babel");

module.exports = {
  input: "index.js",
  output: {
    dir: "dist",
    entryFileNames: "[name].js",
    format: "cjs",
    exports: "named",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
};
