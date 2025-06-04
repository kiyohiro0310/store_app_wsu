import { test as baseTest, expect } from "playwright/test";

const authTest = baseTest.extend({
  page: async ({ page }, use) => {
    // Sign in with our account.
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("test");
    await page.getByRole("button", { name: "Login" }).click();
    
    // Wait for successful login and redirect
    await page.waitForURL("/");
    await expect(page.getByText("Discover", { exact: false })).toBeVisible();
    
    // Store auth state
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
    
    // Navigate to admin page
    await page.goto("/admin");
    
    // Use signed-in page in the test.
    await use(page);
  },
});

export const test = authTest;
