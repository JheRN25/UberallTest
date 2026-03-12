import { Page } from '@playwright/test';

export class PlaywrightHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get customerLoginButton() {
    return this.page.locator('button[ng-click="customer()"]');
  }

  get customerSelect() {
    return this.page.locator('#userSelect');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  async clickCustomerLogin() {
    await this.customerLoginButton.click();
  }

  async selectCustomerByName(customerName: string) {
    await this.customerSelect.selectOption({ label: customerName });
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
