import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

import path from "path";

rules.push({
  test: /\.(scss|css)$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    { loader: "sass-loader" },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: { "@": path.resolve(__dirname, "src/react") },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"],
  },
};
