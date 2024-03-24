import { defineConfig } from "rollup";
import swc from "@rollup/plugin-swc";
import nodeResolve from "@rollup/plugin-node-resolve";
import { sync } from "glob";
import { dirname, extname, relative, resolve } from "path";
import { fileURLToPath } from "url";
import alias from "@rollup/plugin-alias";
import dts from "rollup-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paths = [];
const input = Object.fromEntries(
  sync("src/**/*.ts", { absolute: true })
    .map((file) => {
      paths.push(file);
      if (file.endsWith(".spec.ts")) return;
      return [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        relative("src", file.slice(0, file.length - extname(file).length)),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        file,
      ];
    })
    .filter((x) => x),
);

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
    input,
    external(id) {
      if (paths.includes(id)) return false;
      if (id.startsWith("@/")) return false;
      return true;
    },
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
    input,
    plugins: [commonAlias, dts()],
    output: {
      dir: "lib/types",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  },
]);
