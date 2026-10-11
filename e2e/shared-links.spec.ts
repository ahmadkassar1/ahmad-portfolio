import { expect, test } from "@playwright/test";

const origin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const encode = (value: unknown) =>
  Buffer.from(encodeURIComponent(JSON.stringify(value))).toString("base64");

test("Fixtura loads shared data, keeps edits when sharing and handles hash navigation", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const schema = {
    name: "Shared fixture",
    seed: "shared-test",
    entities: [
      { id: "first", name: "items", count: 3, fields: [{ id: "number", name: "id", kind: "increment" }] },
      { id: "second", name: "labels", count: 2, fields: [{ id: "word", name: "name", kind: "word" }] },
    ],
  };
  await page.goto(`${origin}/lab/fixtura#s=${encode(schema)}`);
  await expect(page.getByRole("textbox", { name: "Schema name", exact: true })).toHaveValue("Shared fixture");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
  await page.getByRole("button", { name: "labels", exact: true }).click();
  await page.getByRole("textbox", { name: "Seed", exact: true }).fill("edited-seed");
  const rows = await page.getByRole("table").innerText();
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByText("Shareable link copied", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Entity name", exact: true })).toHaveValue("labels");
  await expect.poll(() => page.getByRole("table").innerText()).toBe(rows);

  await page.goto(`${origin}/lab/fixtura#s=invalid`);
  await expect(page.getByRole("textbox", { name: "Schema name", exact: true })).toHaveValue("store");
  await page.goto(`${origin}/lab/fixtura#s=${encode(schema)}`);
  await expect(page.getByRole("textbox", { name: "Seed", exact: true })).toHaveValue("shared-test");
  await page.getByRole("button", { name: "Delete entity", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Entity name", exact: true })).toHaveValue("labels");
  await expect(page.getByRole("button", { name: "Delete entity", exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Margin Lab loads a shared product and keeps a valid channel after deletion", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const product = {
    name: "Shared sample",
    components: [{ id: "material", name: "Sample material", qty: 1, unitCost: 10 }],
    laborMinutes: 0, laborRate: 0, overhead: 0, fixedCosts: 100, targetMargin: 25,
    channels: [
      { id: "first", name: "Direct", pctFee: 0, flatFee: 0, perTxnFee: 0 },
      { id: "second", name: "Marketplace", pctFee: 5, flatFee: 0, perTxnFee: 0 },
    ],
  };
  await page.goto(`${origin}/lab/margin-lab#p=${encode(product)}`);
  await expect(page.getByRole("textbox", { name: "Product name", exact: true })).toHaveValue("Shared sample");
  const selector = page.getByRole("combobox", { name: "Break-even channel", exact: true });
  await selector.selectOption("second");
  await page.getByRole("slider", { name: "Material cost change", exact: true }).fill("20");
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByText("Shareable link copied", { exact: true })).toBeVisible();
  await expect(selector).toHaveValue("second");
  await expect(page.getByRole("slider", { name: "Material cost change", exact: true })).toHaveValue("20");
  await page.getByRole("button", { name: "Remove channel", exact: true }).nth(1).click();
  await expect(selector).toHaveValue("first");
  await expect(page.getByRole("button", { name: "Remove channel", exact: true })).toHaveCount(0);
  await page.goto(`${origin}/lab/margin-lab#p=invalid`);
  await expect(page.getByRole("textbox", { name: "Product name", exact: true })).not.toHaveValue("Shared sample");
  expect(errors).toEqual([]);
});
