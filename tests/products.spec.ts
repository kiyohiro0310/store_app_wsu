import { test, expect } from "playwright/test";
import { test as fixtureTest } from "./fixtures";

const numberOfProducts = 8;
const numberOfCategoryFilter = 3;
const numberOfTagFilter = 1;
const numberOfSearchFilter = 1;

test.beforeEach(async ({page}) => {
    await page.goto("/products");
    await page.waitForTimeout(1000);
});

test("Show products", async ({page}) => {
    const products = page.locator('[data-testid^="product"]');
    await expect(products).toHaveCount(numberOfProducts);
});

test("Products should be filtered by Category", async ({page}) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    // Click on the category filter
    await page.getByRole('button', { name: 'Category' }).click();
    
    // Select a category
    await page.getByRole('option', { name: 'Electronics' }).click();
    
    // Wait for the filter to be applied
    await page.waitForTimeout(1000);
    
    // Get the filtered products
    const filteredProducts = page.locator('[data-testid^="product"]');
    
    // Verify that we have fewer products after filtering
    const count = await filteredProducts.count();
    expect(count).toBeLessThan(numberOfProducts);
});

test("Products should be filtered by Tag", async ({page}) => {
    await page.getByTestId("tag-filter").click();
    await page.getByTestId("tag-filter").selectOption("electronics")
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfTagFilter);
});

test("Products should be filtered by Search", async ({page}) => {
    await page.getByTestId("search-filter").click();
    await page.getByTestId("search-filter").fill("4k");
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfSearchFilter);
});

test("Clear filter", async ({page}) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    // Apply a filter
    await page.getByRole('button', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Electronics' }).click();
    
    // Clear the filter
    await page.getByRole('button', { name: 'Reset' }).nth(2).click();
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfProducts);
});

