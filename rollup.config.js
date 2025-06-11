import { nodeResolve } from '@rollup/plugin-node-resolve';

const codemirror = () => {
  return {
    input: './docs/js/editor/codemirror/bundleSrc/codemirror.src.js',
    output: {
      file: './docs/js/editor/codemirror/codemirror.bundle.js',
      format: 'es',
    },
    plugins: [nodeResolve()],
  };
};

export default [codemirror()];
