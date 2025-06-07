import { test, expect } from "playwright/test";

const numberOfProducts = 5;
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
    await page.getByTestId("category-filter").click();
    await page.getByTestId("category-filter").selectOption("Electronics")
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfCategoryFilter);
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

