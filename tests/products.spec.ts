import { test, expect } from "playwright/test";

const numberOfProducts = 4;
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
    await page.locator('div').filter({ hasText: /^All CategoriesElectronicsAudio$/ }).getByRole('combobox').selectOption('Electronics');
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfCategoryFilter);
});

test("Products should be filtered by Tag", async ({page}) => {
    await page.locator('div').filter({ hasText: /^All Tagselectronicsaccessorymonitor4kaudioheadphoneskeyboardmechanical$/ }).getByRole('combobox').selectOption('electronics');
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfTagFilter);
});

test("Products should be filtered by Search", async ({page}) => {
    await page.getByRole('textbox', { name: 'Search by name...' }).click();
    await page.getByRole('textbox', { name: 'Search by name...' }).fill('4k');
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfSearchFilter);
});

test("Clear filter", async ({page}) => {
    await page.getByRole('textbox', { name: 'Search by name...' }).click();
    await page.getByRole('textbox', { name: 'Search by name...' }).fill('4k');
    await page.getByRole('button', { name: 'Reset' }).nth(2).click();
    const filteredProducts = page.locator('[data-testid^="product"]');
    await expect(filteredProducts).toHaveCount(numberOfProducts);
});

