// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  build: { outDir: "../dist", emptyOutDir: true },
  server: {
    proxy: {
      "/sample.arxml": "http://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
  test: { environment: "jsdom", include: ["../tests/**/*.test.ts"] },
});
