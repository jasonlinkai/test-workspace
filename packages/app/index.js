var headerF = require("@test-workspace/header")
var footerF = require("@test-workspace/footer")
var f = function() {
  var v = "app";
  headerF();
  footerF();
  console.log(v);
  return v;
}

module.exports = f;