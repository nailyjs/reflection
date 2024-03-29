const rspack = require("@rspack/core");

/**
 * @type {import("webpack-cli").WebpackConfiguration[]}
 */
module.exports = [
  {
    context: __dirname,
    entry: {
      index: "./src/main.ts",
    },
    output: {
      path: "./.naily",
    },
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    resolve: {
      extensions: ["...", ".ts", ".tsx", ".jsx"],
    },
    devtool: "source-map",
    externalsType: "commonjs",
    externalsPresets: {
      node: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["source-map-loader"],
          enforce: "pre",
        },
        {
          test: /\.(jsx?|tsx?)$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-typescript"],
                plugins: [
                  "@nailyjs/babel-plugin-reflection",
                  "babel-plugin-transform-typescript-metadata",
                  ["@babel/plugin-proposal-decorators", { version: "2023-11" }],
                ],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }),
      new rspack.BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
      new rspack.ProgressPlugin({
        prefix: "Naily",
      }),
    ].filter(Boolean),
  },
];
