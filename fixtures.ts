import { test as base, expect, type Page } from '@playwright/test';
import { loginAsCustomer } from './helpers';

/**
 * Fixture that provides a page already logged in as a customer (default: Harry Potter).
 * Use for deposit/transaction specs so they don't repeat the login flow.
 */
export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await loginAsCustomer(page);
    await use(page);
  },
});

export { expect };
