import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [
        {
          name: "chromium-tests",
          browser: "chromium",
          // Using headless by default in CI, non-headless in dev
          headless: process.env.CI !== undefined,
        },
      ],
    },
    exclude: ["**/node_modules/**", "**/dist/**", "playwright.config.ts"],
  },
  optimizeDeps: {
    exclude: ["playwright-core", "playwright", "chromium-bidi"],
  },
  build: {
    rollupOptions: {
      external: ["chromium-bidi", "fsevents", /\.node$/],
    },
  },
});
