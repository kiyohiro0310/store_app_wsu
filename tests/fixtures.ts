import { test as baseTest, expect } from "playwright/test";

const authTest = baseTest.extend({
  page: async ({ page }, use) => {
    try {
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
      
      // Navigate to admin page and wait for authorization
      await page.goto("/admin");
      
      // Wait for the admin page to load and authorization check to complete
      await page.waitForLoadState('networkidle');
      await expect(page.getByText("Manage Products")).toBeVisible({ timeout: 10000 });
      
      // Use signed-in page in the test.
      await use(page);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  },
});

export const test = authTest;
