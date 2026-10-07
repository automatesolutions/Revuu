import { expect, test } from "@playwright/test";

test("artboards are hidden in production builds", async ({ request }) => {
  test.skip(process.env.ENABLE_ARTBOARDS === "1", "Artboards are switched on for this run");
  const response = await request.get("/artboards");
  expect(response.status()).toBe(404);
});

test("dev tweak API is not reachable in production", async ({ request }) => {
  const response = await request.get("/api/dev/tweaks");
  expect(response.status()).toBe(404);
});

test("security headers are set", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-powered-by"]).toBeUndefined();
});
