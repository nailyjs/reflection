import { defineConfig } from "rollup";
import swc from "@rollup/plugin-swc";
import nodeResolve from "@rollup/plugin-node-resolve";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import alias from "@rollup/plugin-alias";
import dts from "rollup-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commonAlias = alias({
  entries: [{ find: "@", replacement: resolve(__dirname, "src") }],
});
const commonResolve = nodeResolve({
  extensions: [".js", ".ts", ".mjs", ".mts", ".cjs", ".cts"],
});
const commonSwc = swc({
  swc: {
    jsc: { target: "es6" },
    swcrc: true,
  },
});

/** @type {import("rollup").InputPluginOption} */
const commonPlugins = [commonAlias, commonResolve, commonSwc];

export default defineConfig([
  // 生成ESM和CJS格式
  {
    input: {
      index: "src/index.ts",
      stage3: "src/stage3.ts",
      legacy: "src/legacy.ts",
    },
    external: [/node_modules/],
    plugins: commonPlugins,
    output: [
      // 生成ESM格式
      {
        format: "esm",
        dir: "lib/esm",
        sourcemap: "inline",
        entryFileNames: "[name].mjs",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      // 生成CJS格式
      {
        format: "cjs",
        dir: "lib/cjs",
        sourcemap: "inline",
        entryFileNames: "[name].js",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    ],
  },
  // 生成类型定义文件
  {
    input: {
      index: "src/index.ts",
      stage3: "src/stage3.ts",
      legacy: "src/legacy.ts",
    },
    plugins: [commonAlias, dts()],
    output: {
      dir: "lib/types",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  },
]);
