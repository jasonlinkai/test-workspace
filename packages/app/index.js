import headerF from "@test-workspace/header";
import footerF from "@test-workspace/footer";

const f = () => {
  const v = "app";
  headerF();
  footerF();
  console.log(v);
  return v;
};

export default f;
