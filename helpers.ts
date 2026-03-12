import * as fs from 'fs';
import { Page } from '@playwright/test';
import { PlaywrightHomePage } from './pages/loginElements';

const SCREENSHOTS_DIR = 'screenshots';

export async function takeScreenshot(page: Page, name: string): Promise<void> {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}.png` });
}

export const LOGIN_PAGE_URL =
  'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

/** Default deposit amount used in deposit/transaction tests. Change here to use a different amount. */
export const DEPOSIT_AMOUNT = 100;
export const WITHDRAWAL_AMOUNT = 30;

/**
 * Logs in as a customer and waits until the account page is loaded.
 * Use in specs that need an authenticated session before testing deposit/transactions.
 */
export async function loginAsCustomer(
  page: Page,
  customerName: string = 'Harry Potter'
): Promise<void> {
  const loginPage = new PlaywrightHomePage(page);
  await page.goto(LOGIN_PAGE_URL);
  await loginPage.clickCustomerLogin();
  await loginPage.selectCustomerByName(customerName);
  await loginPage.clickLogin();
  await page.waitForURL(/account/);
}
