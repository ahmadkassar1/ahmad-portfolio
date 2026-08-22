import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 1440, height: 960 },
  reducedMotion: "no-preference",
  headless: false,
  launchOptions: {
    args: [
      "--enable-webgl",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
      "--disable-dev-shm-usage",
    ],
  },
});

test("3D navigation, panels and walk mode stay responsive", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded" });

  const webgl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  });
  expect(webgl, "CI browser must expose WebGL for the real 3D smoke test").toBe(true);

  const enter = page.getByRole("button", { name: /Enter the Ops Deck/i });
  if (await enter.isVisible().catch(() => false)) await enter.click();

  await expect(page.getByText("Ops Deck", { exact: true })).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(3800);

  const walk = page.getByRole("button", { name: /^Walk$/ });
  await expect(walk).toBeVisible();
  await walk.click();
  await expect(page.getByRole("button", { name: /^Walking$/ })).toBeVisible();
  await expect(page.getByText(/WASD \/ arrows to move/i)).toBeVisible();

  // Keyboard movement must not wedge when focus leaves and returns.
  await page.keyboard.down("w");
  await page.waitForTimeout(250);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.keyboard.up("w");

  // Switching back to orbit should preserve the session and keep the HUD live.
  await page.getByRole("button", { name: /^Walking$/ }).click();
  await expect(page.getByRole("button", { name: /^Walk$/ })).toBeVisible();

  // Focus a project from the DOM HUD, verify its dialog, then return.
  await page.getByRole("button", { name: /AI Lead Generation/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: /Close .* panel/i }).click();
  await expect(page.getByRole("dialog")).toBeHidden({ timeout: 10000 });

  const about = page.getByRole("button", { name: "About" });
  await about.click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("heading", { name: "About Ahmad" })).toBeVisible();

  // Escape closes the panel and navigation remains usable afterwards.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /^Walk$/ })).toBeVisible();
});
