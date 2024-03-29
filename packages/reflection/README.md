<div align="center">

# Naily Reflection

The untimate reflection typings for TypeScript 5.x's stage 3 decorators.

基于 TypeScript 5.x 的 stage 3 装饰器的类型反射库

</div>

## Installation

Must have babel, typescript installed, and `@babel/preset-typescript` preset、`@babel/plugin-proposal-decorators` plugin, and install the following packages:

```bash
npm install @nailyjs/babel-plugin-reflection babel-plugin-transform-typescript-metadata
```

> `babel-plugin-transform-typescript-metadata` will emit the typescript original metadata.

## How to use

Configure your babel options:

```json
{
  "presets": ["@babel/preset-typescript"],
  "plugins": [
    "@nailyjs/babel-plugin-reflection",
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "version": "2023-11" }]
  ]
}
```

## License

MIT
