import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  transpilePackages: ["@revuu/ui"],
  // The demo parts list is read from disk by these route handlers.
  outputFileTracingIncludes: {
    "/api/parts/import": ["./src/fixtures/parts/*.{csv,xlsx}"],
    "/api/parts/demo": ["./src/fixtures/parts/*.{csv,xlsx}"],
  },
  // Standalone output needs symlinks, which Windows only allows with Developer Mode,
  // so it is enabled in the Docker build only.
  ...(process.env.NEXT_STANDALONE === "1"
    ? { output: "standalone" as const, outputFileTracingRoot: path.join(__dirname, "../../") }
    : {}),
  turbopack: {
    root: path.join(__dirname, "../../"),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The artboard canvas embeds its own frames.
      { source: "/artboards/:path*", headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }] },
    ];
  },
};

export default nextConfig;
