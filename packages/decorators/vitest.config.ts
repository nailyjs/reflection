import { defineProject } from "vitest/config";
import swc from "@rollup/plugin-swc";
import alias from "vite-tsconfig-paths";

// noinspection JSUnusedGlobalSymbols
export default defineProject({
  plugins: [
    swc({
      swc: {
        jsc: {
          transform: {
            decoratorVersion: "2022-03",
            decoratorMetadata: true,
          },
        },
      },
    }),
    alias(),
  ],
  test: {
    exclude: ["**/node_modules/**", "*.mjs", "*.cjs", "**/lib/**", "**/test/**", "**/.naily/**"],
    globals: true,
  },
});
