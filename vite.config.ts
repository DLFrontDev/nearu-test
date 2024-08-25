import path from "path";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "./src/styles/variables"; @import "./src/styles/mixins";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
      providerOptions: {},
      screenshotFailures: false,
    },
  },
});
