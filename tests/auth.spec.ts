import { expect, test } from "playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForTimeout(500);
});

test("Can Login", async ({ page }) => {
  await page.getByLabel("Email ").click();
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("test");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/");
  await page.waitForTimeout(500);
  await expect(page.getByText("Discover", { exact: false })).toBeVisible();
});
