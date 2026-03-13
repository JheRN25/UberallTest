import { Page } from '@playwright/test';

export class DepositPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get depositTabButton() {
    return this.page.locator('button[ng-click="deposit()"]');
  }

  get amountInput() {
    return this.page.getByPlaceholder('amount');
  }

  get depositSubmitButton() {
    return this.page.locator('button[type="submit"].btn-default', { hasText: 'Deposit' });
  }

  get depositSuccessMessage() {
    return this.page.locator('span.error.ng-binding', { hasText: 'Deposit Successful' });
  }

  get balanceDisplay() {
    // Account block contains: Account Number strong, Balance strong, Currency strong.
    return this.page.getByText('Balance :').locator('strong.ng-binding').nth(1);
  }

  async openDepositTab() {
    await this.depositTabButton.click();
  }

  async fillAmount(amount: number | string) {
    await this.amountInput.fill(String(amount));
  }

  async submitDeposit() {
    await this.page.waitForTimeout(1000);
    await this.depositSubmitButton.click();
  }
}
//end