import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./apps/web/src/", import.meta.url)) },
    ],
  },
  test: {
    include: ["packages/**/*.test.{ts,tsx}", "apps/web/src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "apps/web/e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
