<div align="center">

# Naily Reflection

The untimate reflection typings for TypeScript 5.x's stage 3 decorators.

基于 TypeScript 5.x 的 stage 3 装饰器的类型反射库

</div>

## Installation

```bash
npm install @nailyjs/reflection unplugin-ast
```

## How to use

For example in a `rollup` with `swc` project:

```ts
// rollup.config.ts
import AST from "unplugin-ast";
import swc from "@rollup/plugin-swc";
import { Reflection } from "@nailyjs/reflection";

export default {
  // ...
  plugins: [
    // Must be the first plugin
    AST.rollup({
      transformer: Reflection,
    }),
    // The swc plugin's decoratorVersion must be set to "2022-03", it mean the stage 3 decorators
    swc({
      swc: {
        jsc: {
          target: "es6",
          transform: {
            decoratorVersion: "2022-03",
          },
        },
        swcrc: true,
      },
    }),
  ],
  // ...
};
```

It is a example configuration for `rollup` with `swc`, you can see `test` folder for full example.

## License

MIT
