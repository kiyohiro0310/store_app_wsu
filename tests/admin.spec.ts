import { expect } from "playwright/test";
import { test } from "./fixtures";

test("Shows admin dashboard", async ({ page }) => {
  // Wait for admin page to load and check authorization
  await page.waitForLoadState('networkidle');
  
  // Verify admin dashboard elements
  await expect(page.getByText("Manage Products")).toBeVisible();
  await expect(page.getByText("View Orders")).toBeVisible();
});
