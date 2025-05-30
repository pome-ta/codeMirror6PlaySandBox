import { nodeResolve } from '@rollup/plugin-node-resolve';


const codemirror = () => {
  return {
    input: './client/js/editor/codemirror/bundleSrc/codemirror.src.js',
    output: {
      file: './client/js/editor/codemirror/codemirror.bundle.js',
      format: 'es',
    },
    plugins: [nodeResolve()],
  };
};


export default [codemirror(),];

