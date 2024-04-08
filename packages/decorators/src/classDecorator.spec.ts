import { ClassDecoratorBuilder } from "./classDecorator";

test("class decorator", () => {
  const Provide = new ClassDecoratorBuilder({
    build(target, ctx) {
      console.log("Provide", target, ctx);
    },
  }).build();

  @Provide
  class T {}
  new T();
});
