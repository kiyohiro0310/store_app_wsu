import { expect } from "playwright/test";
import { test } from "./fixtures";

test("Shows admin dashboard", async ({ page }) => {
  // Navigate to admin page
  await page.goto("/admin");
  
  // Wait for admin page to load and check authorization
  await page.waitForLoadState('networkidle');
  
  // Verify admin dashboard elements
  await expect(page.getByText("Manage Products")).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("View Orders")).toBeVisible({ timeout: 15000 });
});

test.describe("Admin Products Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to products page
    await page.goto("/admin/products");
    // Wait for the table to be visible
    await page.waitForSelector("table", { timeout: 15000 });
    // Wait for DataTable to initialize
    await page.waitForTimeout(2000);
  });

  test("displays products table with correct columns", async ({ page }) => {
    // Verify table headers
    await expect(page.locator("th").filter({ hasText: "Product" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Details" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Currency" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Price" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Status" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Quantity" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator("th").filter({ hasText: "Actions" })).toBeVisible({ timeout: 15000 });
  });

  test("can add a new product", async ({ page }) => {
    // Navigate to create product page
    await page.goto("/admin/products/create");
    await page.waitForSelector("form", { timeout: 15000 });

    // Fill in the product form
    await page.getByLabel("Product Name").fill("Test Product");
    await page.getByLabel("Category").fill("Test Category");
    await page.getByLabel("Price").fill("99.99");
    await page.getByLabel("Currency").selectOption("USD");
    await page.getByLabel("Description").fill("This is a test product description");
    await page.getByLabel("Tags (comma separated)").fill("test, product");
    await page.getByLabel("Quantity").fill("10");
    await page.getByLabel("In Stock").check();

    // Submit the form
    await page.getByRole("button", { name: "Create Product" }).click();

    // Wait for success message
    await expect(page.getByText("Product created successfully")).toBeVisible({ timeout: 15000 });

    // Wait for table to update and verify new product
    await page.waitForSelector("table", { timeout: 15000 });
    await expect(page.getByText("Test Product")).toBeVisible({ timeout: 15000 });
  });

  test("can edit an existing product", async ({ page }) => {
    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 15000 });
    
    // Click edit button on first product
    await page.getByTestId("edit-button-Test Product").click();
    
    // Wait for form to be visible and params to be resolved
    await page.waitForSelector("form", { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Update product details
    await page.getByLabel("Product Name").fill("Updated Product Name");
    await page.getByLabel("Price").fill("149.99");

    // Submit the form
    await page.getByRole("button", { name: "Update Product" }).click();

    // Wait for success message
    await expect(page.getByText("Product updated successfully")).toBeVisible({ timeout: 15000 });

    // Wait for table to update and verify changes
    await page.waitForSelector("table", { timeout: 15000 });
    await expect(page.getByText("Updated Product Name")).toBeVisible({ timeout: 15000 });
  });

  test("can delete a product", async ({ page }) => {
    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 15000 });
    
    // Get the first product name
    const firstRow = page.locator("table tbody tr").first();
    const productName = await firstRow.locator("td").first().textContent();
    
    // Set up dialog handler before clicking delete
    page.on("dialog", dialog => dialog.accept());
    
    // Click delete button
    await firstRow.locator("button").filter({ hasText: "Delete" }).click();
    
    // Wait for success message
    await expect(page.getByText("Product deleted successfully")).toBeVisible({ timeout: 15000 });
  });

  test("can search products", async ({ page }) => {
    // Wait for DataTable search input to be ready
    await page.waitForSelector("input[type='search']", { timeout: 15000 });
    
    // Type in search box
    const searchInput = page.locator("input[type='search']");
    await searchInput.fill("Test Product");
    await searchInput.press("Enter");
    
    // Wait for table to update
    await page.waitForTimeout(2000);
    
    // Verify filtered results
    await expect(page.getByText("Test Product")).toBeVisible({ timeout: 15000 });
  });

  test("can filter products by status", async ({ page }) => {
    // Wait for table to be ready
    await page.waitForSelector("table", { timeout: 15000 });
    
    // Click on status column header to sort
    await page.locator("th").filter({ hasText: "Status" }).click();
    
    // Wait for sorting to complete
    await page.waitForTimeout(2000);
    
    // Get all status cells
    const statusCells = page.locator("td:nth-child(5)");
    const firstStatus = await statusCells.first().textContent();
    
    // Verify sorting (assuming "In Stock" comes before "Out of Stock")
    expect(firstStatus?.includes("In Stock")).toBeTruthy();
  });
});
