// vite.library.config.ts
import { defineConfig } from "vite";

/** Runtimeを外部Webプロジェクトから直接読み込めるES Moduleへ束ねる設定です。 */
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      fileName: "relink-web-runtime",
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: false,
  },
});
