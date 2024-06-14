var t = require("@test-workspace/footer");
var a = "app";

var af = function () {
  t();
  console.log(a);
};

af();

module.exports = af;
