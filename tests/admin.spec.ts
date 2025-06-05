import { expect } from "playwright/test";
import { test } from "./fixtures";

test("Shows admin dashboard", async ({ page }) => {
  // Wait for admin page to load and check authorization
  await page.waitForLoadState('networkidle');
  
  // Verify admin dashboard elements
  await expect(page.getByText("Manage Products")).toBeVisible();
  await expect(page.getByText("View Orders")).toBeVisible();
});

test("Create and delete product", async ({ page }) => {
  // Navigate to products page
  await page.goto("/admin/products");
  
  // Wait for and click add product button
  const addButton = page.getByRole("button", { name: "Add New Product" });
  await addButton.waitFor({ state: 'visible' });
  await addButton.click();
  
  // Wait for modal to be visible
  await page.waitForSelector('form');
  
  // Fill in product details
  await page.locator('input[name="name"]').fill("Test123");
  await page.locator('input[name="category"]').fill("monitor");
  await page.locator('input[name="price"]').fill("1230");
  await page.locator('textarea[name="description"]').fill("124");
  await page.locator('input[name="tags"]').fill("test");
  await page.locator('input[name="quantity"]').fill("100");
  
  // Click the create button
  await page.getByRole("button", { name: "Create Product" }).click();
  
  // Wait for success message and product to be visible
  await page.waitForSelector('text=Product created successfully');
  await expect(page.getByText("Test123")).toBeVisible();

  // Find and click the delete button for the product
  const deleteButton = page.getByTestId("delete-button-Test123");
  await deleteButton.waitFor({ state: 'visible' });
  
  // Set up dialog handler before clicking delete
  page.on('dialog', dialog => dialog.accept());
  
  // Click delete and wait for confirmation
  await deleteButton.click();
  
  // Wait for success message and verify product is removed
  await page.waitForSelector('text=Product deleted successfully');
  await expect(page.getByText("Test123")).not.toBeVisible();
});