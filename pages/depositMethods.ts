import { expect, type Page } from '@playwright/test';
import { DepositPage } from './depositElements';

export async function makeDeposit(page: Page, amount: number) {
  const depositPage = new DepositPage(page);
  await depositPage.openDepositTab();
  const balanceBefore = parseInt((await depositPage.balanceDisplay.textContent()) ?? '0', 10);
  await depositPage.fillAmount(amount);
  await expect(depositPage.amountInput).toHaveValue(String(amount));
  await depositPage.submitDeposit();
  await expect(depositPage.depositSuccessMessage).toBeVisible();
  await expect(depositPage.balanceDisplay).toHaveText(String(balanceBefore + amount));
  return { balanceBefore, balanceAfter: balanceBefore + amount };
}