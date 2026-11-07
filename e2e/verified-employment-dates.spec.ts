import { expect, test } from "@playwright/test";

test("portfolio displays the verified employment date ranges", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");

  await expect(page.getByText("Oct 2025 – Feb 2026").first()).toBeVisible();
  await expect(page.getByText("Mar 2024 – Sep 2025").first()).toBeVisible();
  await expect(page.getByText("2025 — now")).toHaveCount(0);
  await expect(page.getByText(/3\+ years of web development experience/i)).toHaveCount(0);
});
