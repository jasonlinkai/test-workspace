var headerF = require("@test-workspace/header")
var footerF = require("@test-workspace/footer")
var f = function() {
  var v = "app2";
  headerF();
  footerF();
  console.log(v);
  return v;
}

module.exports = f;