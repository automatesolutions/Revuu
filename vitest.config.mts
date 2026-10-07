import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    include: ["packages/**/*.test.{ts,tsx}", "apps/web/src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "apps/web/e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
