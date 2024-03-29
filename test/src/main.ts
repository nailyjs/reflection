/* eslint-disable @typescript-eslint/no-unused-vars */

import "@nailyjs/babel-plugin-reflection/stage3";
import { Test } from "./exporter";

function Abs(ta, ct: DecoratorContext) {}

interface R {}

@Abs
export class Test2 extends Test<string | number> {
  constructor(test: Test) {
    super();
  }

  @Abs
  private app: Array<Test>;

  @Abs
  test() {
    return "test";
  }
}

@Abs
export class Test3 {}

console.log("===");
console.dir(Test2[Symbol.metadata], { depth: null });
console.log("===");
