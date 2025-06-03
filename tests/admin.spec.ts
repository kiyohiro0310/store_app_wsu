import { expect } from "playwright/test";
import { test } from "./fixtures";

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

test("Shows home screen to authorised user", async ({ userPage }) => {
  await userPage.goto("/");
  await userPage.waitForURL("/");
  // shows title
  await expect(userPage.getByText("Discover")).toBeVisible();
});

test("Show admin dashboard", async ({ userPage }) => {
  await userPage.goto("/admin");
  await expect(userPage.getByText("Admin", { exact: false })).toBeVisible();
});

// TODO: Test admin can create product
test("Create product", async ({ userPage }) => {
  await userPage.goto("/admin/products");
  await userPage.getByRole("button", { name: "Add New Product" }).click();
  await userPage.locator('input[name="name"]').click();
  await userPage.locator('input[name="name"]').fill("Test123");
  await userPage.locator('input[name="category"]').click();
  await userPage.locator('input[name="category"]').fill("monitor");
  await userPage.locator('input[name="price"]').click();
  await userPage.locator('input[name="price"]').fill("1230");
  await userPage.getByRole("button", { name: "Upload Image" }).click();
  await userPage.getByRole("button", { name: "Upload Image" }).click();
  await userPage.locator('textarea[name="description"]').click();
  await userPage.locator('textarea[name="description"]').fill("124");
  await userPage.locator('input[name="tags"]').click();
  await userPage.locator('input[name="tags"]').fill("test");
  await userPage.locator('input[name="quantity"]').click();
  await userPage.locator('input[name="quantity"]').fill("100");
  await userPage.getByRole("button", { name: "Create Product" }).click();
});
