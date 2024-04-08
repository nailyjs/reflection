import "@nailyjs/babel-plugin-reflection/stage3";

function Test() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target, ctx) => void 0;
}

function test() {
  @Test()
  class TestN {
    a = 1;
  }

  console.log(TestN);
}
test();
