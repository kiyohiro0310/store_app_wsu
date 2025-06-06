import { test, expect } from '@playwright/test';


test.beforeEach("Loading page should be visible", async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId("loading")).toBeVisible();
  await page.waitForTimeout(500);
});

test('Home content should be visible', async ({ page }) => {
  await expect(page.getByText("Why Shop With Us?")).toBeVisible();
  await expect(page.getByText("Stay Updated")).toBeVisible();
  await expect(page.getByText("Ready to Upgrade Your Tech?")).toBeVisible();
});

test("4 products of home should be visible", async ({page}) => {
  const products = page.locator('[data-testid^="product"]');
  await expect(products).toHaveCount(4);
});