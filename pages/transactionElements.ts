import { Page, expect } from '@playwright/test';

export class TransactionPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get transactionsTabButton() {
    return this.page.locator('button[ng-click="transactions()"]');
  }

  get transactionsTable() {
    return this.page.locator('table');
  }

  get headerRow() {
    return this.page.getByRole('row', { name: /Date-Time\s+Amount\s+Transaction Type/ });
  }

  get rows() {
    // includes header + data rows
    return this.page.locator('table tr');
  }

  getRow(amount: number, type: 'Credit' | 'Debit') {
    return this.rows.filter({ hasText: String(amount) }).filter({ hasText: type });
  }

  async openTransactionsWithWait() {
    await this.page.waitForTimeout(1000);
    await expect(this.transactionsTabButton).toBeVisible();
    await expect(this.transactionsTabButton).toBeEnabled();
    await this.transactionsTabButton.click();
    await expect(this.transactionsTable).toBeVisible();
    await expect(this.headerRow).toBeVisible();
  }

  // Note: paging helpers were removed because the tests now only assert that
  // at least one matching row exists, without trying to walk all pages.
}