import { expect } from "playwright/test";
import { test } from "./fixtures";

test("Shows admin dashboard", async ({ page }) => {
  // Wait for admin page to load and check authorization
  await page.waitForLoadState('networkidle');
  
  // Verify admin dashboard elements
  await expect(page.getByText("Manage Products")).toBeVisible();
  await expect(page.getByText("View Orders")).toBeVisible();
});

test.describe("Admin Products Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to products page
    await page.goto("/admin/products");
    await page.waitForLoadState('networkidle');
  });

  test("displays products table with correct columns", async ({ page }) => {
    // Verify table headers
    await expect(page.getByText("Product")).toBeVisible();
    await expect(page.getByText("Details")).toBeVisible();
    await expect(page.getByText("Currency")).toBeVisible();
    await expect(page.getByText("Price")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
    await expect(page.getByText("Quantity")).toBeVisible();
    await expect(page.getByText("Actions")).toBeVisible();
  });

  test("can add a new product", async ({ page }) => {
    // Click add product button
    await page.getByTestId("add-product").click();

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

    // Verify success message
    await expect(page.getByText("Product created successfully")).toBeVisible();

    // Verify new product appears in table
    await expect(page.getByText("Test Product")).toBeVisible();
  });

  test("can edit an existing product", async ({ page }) => {
    // Click edit button on first product
    await page.locator("button").filter({ hasText: "Edit" }).first().click();

    // Update product details
    await page.getByLabel("Product Name").fill("Updated Product Name");
    await page.getByLabel("Price").fill("149.99");

    // Submit the form
    await page.getByRole("button", { name: "Update Product" }).click();

    // Verify success message
    await expect(page.getByText("Product updated successfully")).toBeVisible();

    // Verify updated product appears in table
    await expect(page.getByText("Updated Product Name")).toBeVisible();
  });

  test("can delete a product", async ({ page }) => {
    // Get the first product name
    const productName = await page.locator("td").first().textContent();
    
    // Click delete button on first product
    await page.getByTestId(`delete-button-${productName}`).click();

    // Confirm deletion in the dialog
    page.on("dialog", dialog => dialog.accept());
    
    // Verify success message
    await expect(page.getByText("Product deleted successfully")).toBeVisible();
  });

  test("can search products", async ({ page }) => {
    // Get the search input
    const searchInput = page.locator("input[type='search']");
    
    // Type in search box
    await searchInput.fill("Test Product");
    
    // Verify filtered results
    await expect(page.getByText("Test Product")).toBeVisible();
  });

  test("can filter products by status", async ({ page }) => {
    // Click on status column header to sort
    await page.getByText("Status").click();
    
    // Verify products are sorted by status
    const statusCells = page.locator("td:nth-child(5)");
    const firstStatus = await statusCells.first().textContent();
    const lastStatus = await statusCells.last().textContent();
    
    // Verify sorting (assuming "In Stock" comes before "Out of Stock")
    expect(firstStatus?.includes("In Stock")).toBeTruthy();
  });
});
