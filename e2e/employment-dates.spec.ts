import { expect, test } from "@playwright/test";

const origin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

test("public portfolio shows verified past employment dates", async ({ page }) => {
  // The Ledger is the accessible, server-rendered experience; reduced motion
  // keeps the 3D Ops Deck from obscuring this recruiter-facing evidence.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin, { waitUntil: "domcontentloaded" });

  const experience = page.locator("#experience");
  await expect(experience).toContainText("TheBridge ERP");
  await expect(experience).toContainText("Horecons");
  await expect(experience).toContainText("Oct 2025 – Feb 2026");
  await expect(experience).toContainText("Populus");
  await expect(experience).toContainText("Interphase");
  await expect(experience).toContainText("Mar 2024 – Sep 2025");

  // Prevent a future portfolio edit from incorrectly presenting Horecons
  // as Ahmad's current employer.
  await expect(experience).not.toContainText(/Horecons.{0,100}(?:2025\s*[–—-]\s*(?:now|present))/i);
});
