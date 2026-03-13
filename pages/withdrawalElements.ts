import { Page, expect } from '@playwright/test';

export class WithdrawalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get withdrawalTabButton() {
    return this.page.locator('button[ng-click="withdrawl()"]');
  }

  get withdrawalForm() {
    // Form that contains the withdraw amount label and the Withdraw submit button.
    return this.page.locator('form').filter({ hasText: 'Amount to be Withdrawn' });
  }

  get amountInput() {
    return this.withdrawalForm.locator('input[ng-model="amount"]');
  }

  get withdrawSubmitButton() {
    return this.withdrawalForm.locator('button[type="submit"].btn-default', { hasText: 'Withdraw' });
  }

  async openWithdrawalTab() {
    await this.withdrawalTabButton.click();
    await expect(this.withdrawalForm).toBeVisible();
  }

  async fillAmount(amount: number | string) {
    await this.amountInput.fill(String(amount));
  }

  async submitWithdraw() {
    await this.page.waitForTimeout(1000);
    await this.withdrawSubmitButton.click();
  }
}