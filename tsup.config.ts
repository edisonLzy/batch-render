// https://tsup.egoist.dev/#es5-support
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  legacyOutput: true,
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
});
