import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
  input: './docs/js/cmEditor.js',
  output: {
    file: './docs/js/modules/cmEditor.bundle.js',
    format: 'esm',
  },
  plugins: [nodeResolve()],
};
