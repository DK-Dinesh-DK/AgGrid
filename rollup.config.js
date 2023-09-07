import { isAbsolute } from "node:path";
import linaria from "@linaria/rollup";
import postcss from "rollup-plugin-postcss";
import postcssNested from "postcss-nested";
import { babel } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import pkg from "./package.json" assert { type: "json" };
const extensions = [".ts", ".js", ".tsx", ".jsx"];

export default {
  input: "./src/components/datagrid/index.js",
  output: [
    {
      file: "./lib/bundle.js",
      format: "es",
      generatedCode: "es2015",
      sourcemap: true,
    },
    {
      file: "./lib/bundle.cjs",
      format: "cjs",
      generatedCode: "es2015",
      sourcemap: true,
    },
  ],

  external: (id) =>
    !(id.startsWith(".") || id.startsWith("@linaria:") || isAbsolute(id)),
  plugins: [
    linaria({
      preprocessor: "none",
      classNameSlug(hash) {
        return `${hash}${pkg.version.replaceAll(".", "-")}`;
      },
    }),
    postcss({
      plugins: [postcssNested],
      extract: "styles.css",
    }),
    babel({
      babelHelpers: "runtime",
      extensions,
      shouldPrintComment: (comment) => /^[@#]__.+__$/.test(comment),
    }),
    nodeResolve({ extensions }),
    svgr({ icon: true }),
  ],
};
