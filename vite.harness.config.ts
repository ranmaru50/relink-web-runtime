// vite.harness.config.ts
import { defineConfig } from "vite";

/** Testbed を別プロセスで起動する診断用 Harness の Vite 設定です。 */
export default defineConfig({
  root: "test-harness",
  build: { outDir: "../dist-harness", emptyOutDir: true },
  test: { environment: "jsdom", include: ["../tests/**/*.test.ts"] },
});
