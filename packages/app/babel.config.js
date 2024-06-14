module.exports = (api) => {
  api.cache(true);
  var config = {
    presets: ["@babel/preset-env"],
  };
  if (process.env.NODE_ENV === "testing") {
    config.plugins = ["@babel/plugin-transform-modules-commonjs"];
  }
  return config;
};
