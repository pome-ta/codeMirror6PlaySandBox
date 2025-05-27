import { nodeResolve } from '@rollup/plugin-node-resolve';


const codemirror = () => {
  return {
    input: './docs/js/codemirror/bundleSrc/codemirror.src.js',
    output: {
      file: './docs/js/codemirror/codemirror.js',
      format: 'es',
    },
    plugins: [nodeResolve()],
  };
};

export default [codemirror()];
