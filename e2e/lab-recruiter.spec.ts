import { expect, test } from "@playwright/test";

const origin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

test("Lab gallery labels sample demos and supports keyboard-first mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${origin}/lab`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Builds");
  await expect(
    page.getByText(/interactive demos using sample or local data, not live customer systems/i),
  ).toBeVisible();

  const source = page.getByRole("link", { name: /Inspect Lab source/i });
  await expect(source).toHaveAttribute("href", /github\.com\/ahmadkassar1\/ahmad-portfolio/);
  await expect(source).toHaveAttribute("rel", /noopener noreferrer/);

  const cards = page.locator('main a[href^="/lab/"]');
  await expect(cards).toHaveCount(5);
  // Sample analytics and experimental privacy tooling must not imply verified production guarantees.
  await expect(cards.first()).toContainText(/sample deliveries table/i);
  await expect(cards.nth(3)).toContainText("Experimental");
  await expect(cards.nth(3)).not.toContainText("On-device");
  for (const slug of ["helm", "forge", "fixtura", "redacto", "margin-lab"]) {
    await expect(page.locator(`main a[href="/lab/${slug}"]`)).toBeVisible();
  }

  // Start at the preceding link and use a real Tab key to reach the first demo.
  await source.focus();
  await page.keyboard.press("Tab");
  await expect(cards.first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/lab\/helm\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
