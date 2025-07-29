import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    component: 'src/component/index.ts',
    util: 'src/util/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.build.json'
});
