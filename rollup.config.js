import {nodeResolve} from "@rollup/plugin-node-resolve"
export default {
  input: "./docs/js/app.js",
  output: {
    file: "./docs/js/app.bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve()]
}