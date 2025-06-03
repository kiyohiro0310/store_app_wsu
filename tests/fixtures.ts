import { test as base, Page } from "playwright/test";

type MyFixtures = {
  // adminPage: Page;
  userPage: Page;
};

export const test = base.extend<MyFixtures>({
  // adminPage: async ({ browser }, use) => {
  //   const context = await browser.newContext({
  //     storageState: ".auth/admin.json",
  //   });
  //   const adminPage = await context.newPage(); //  new AdminPage(await context.newPage());
  //   await use(adminPage);
  //   await context.close();
  // },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });
    const userPage = await context.newPage(); //  new UserPage(await context.newPage());
    await use(userPage);
    await context.close();
  },
});