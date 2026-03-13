import { test, expect } from '../fixtures';
import { DepositPage } from '../pages/depositElements';
import { WithdrawalPage } from '../pages/withdrawalElements';
import { TransactionPage } from '../pages/transactionElements';
import { DEPOSIT_AMOUNT, WITHDRAWAL_AMOUNT, takeScreenshot } from '../helpers';
import { makeDeposit } from '../pages/depositMethods';

test.describe.serial('Deposit and Withdrawal', () => {
  test.setTimeout(90_000);

  test('Should be able to deposit and check transactions', async ({ loggedInPage }) => {
    const transactionPage = new TransactionPage(loggedInPage);

    // Arrange + Act: perform a deposit and assert balance change inside makeDeposit.
    await makeDeposit(loggedInPage, DEPOSIT_AMOUNT);
    await takeScreenshot(loggedInPage, 'after-deposit');

    // Assert (transactions): at least one row exists showing this amount as a Credit.
    const depositRow = transactionPage.getRow(DEPOSIT_AMOUNT, 'Credit');
    await transactionPage.openTransactionsWithWait();
    await takeScreenshot(loggedInPage, 'transactions-view');
    await expect
      .poll(async () => depositRow.count(), { timeout: 60000 })
      .toBeGreaterThan(0);
  });

  test('Should be able to withdraw and check transactions', async ({ loggedInPage }) => {
    // Arrange: top up the account via deposit so we can safely withdraw.
    await makeDeposit(loggedInPage, DEPOSIT_AMOUNT);

    const depositPage = new DepositPage(loggedInPage);
    const withdrawalPage = new WithdrawalPage(loggedInPage);
    const transactionPage = new TransactionPage(loggedInPage);

    // Act: open Withdraw tab, enter amount, submit.
    await withdrawalPage.openWithdrawalTab();
    const balanceBeforeWithdrawal = parseInt(
      (await depositPage.balanceDisplay.textContent()) ?? '0',
      10,
    );
    await withdrawalPage.fillAmount(WITHDRAWAL_AMOUNT);
    await expect(withdrawalPage.amountInput).toHaveValue(String(WITHDRAWAL_AMOUNT));
    await withdrawalPage.submitWithdraw();

    // Assert (balance): final balance equals previous balance minus withdrawal.
    await expect(depositPage.balanceDisplay).toHaveText(
      String(balanceBeforeWithdrawal - WITHDRAWAL_AMOUNT),
      { timeout: 15000 },
    );
    await takeScreenshot(loggedInPage, 'after-withdraw');

    // Assert (transactions): at least one row exists showing this amount as a Debit.
    const withdrawalRow = transactionPage.getRow(WITHDRAWAL_AMOUNT, 'Debit');
    await transactionPage.openTransactionsWithWait();
    await takeScreenshot(loggedInPage, 'transactions-view-after-withdraw');
    await expect
      .poll(async () => withdrawalRow.count(), { timeout: 60000 })
      .toBeGreaterThan(0);
  });

  test('Should not accept letters in deposit amount input', async ({ loggedInPage }) => {
    const depositPage = new DepositPage(loggedInPage);

    await depositPage.openDepositTab();

    // First, enter a valid numeric value.
    await depositPage.fillAmount(100);
    await expect(depositPage.amountInput).toHaveValue('100');

    // Then try to type letters into the same input.
    await loggedInPage.keyboard.type('abc');

    // Expected behavior: input[type=number] ignores letters, value stays as "100".
    await expect(depositPage.amountInput).toHaveValue('100');
  });
});