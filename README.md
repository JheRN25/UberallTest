## Playwright Banking Demo Tests

This project contains Playwright end‑to‑end tests for the GlobalSQA AngularJS Banking demo.  
The main goal is to exercise a **Customer login → Deposit → Transactions → Withdrawal → Transactions** flow using the Page Object Model (POM).

### Project structure

- **`helpers.ts`**
  - `LOGIN_PAGE_URL`: URL for the banking demo.
  - `DEPOSIT_AMOUNT`, `WITHDRAWAL_AMOUNT`: shared test data (e.g. 100, 50).
  - `takeScreenshot(page, name)`: saves screenshots to `screenshots/<name>.png`.
  - `loginAsCustomer(page, customerName?)`: logs in as a customer (default: Harry Potter).

- **`fixtures.ts`**
  - `loggedInPage` fixture:
    - Calls `loginAsCustomer(page)` before each test that uses it.
    - Makes tests start on the **account** page instead of the login page.
  - Re‑exports Playwright’s `test` and `expect`.

- **`pages/LoginElements.ts`** (`PlaywrightHomePage`)
  - Encapsulates login page interactions:
    - `clickCustomerLogin()`
    - `selectCustomerByName(customerName)`
    - `clickLogin()`

- **`pages/depositElements.ts`** (`DepositPage`)
  - Deposit tab POM:
    - `openDepositTab()`
    - `fillAmount(amount)`
    - `submitDeposit()`
    - `depositSuccessMessage`
    - `balanceDisplay` (reads the **Balance** value next to “Balance :”)

- **`pages/depositMethods.ts`**
  - `makeDeposit(page, amount)`:
    - Opens Deposit tab.
    - Reads balance before.
    - Fills and submits deposit.
    - Asserts success message and updated balance.
    - Returns `{ balanceBefore, balanceAfter }`.

- **`pages/withdrawalElements.ts`** (`WithdrawalPage`)
  - Withdrawal tab POM:
    - `openWithdrawalTab()`
    - `fillAmount(amount)`
    - `submitWithdraw()`
  - All locators are scoped to the withdrawal form.

- **`pages/transactionElements.ts`** (`TransactionPage`)
  - Transactions view POM:
    - `openTransactionsWithWait()`:
      - Waits 1.5 seconds (to let UI settle),
      - Waits for the Transactions button to be visible/enabled,
      - Clicks it and waits for the table + header to render.
    - `getRow(amount, type)`: returns locator for rows containing the amount and transaction type (`Credit` or `Debit`).

- **`e2e/transactionFlow.spec.ts`**
  - Contains two serial tests sharing the same high‑level flow.

### Test flow

#### 1. Deposit test – `Should be able to deposit and check transactions`

1. **Login**  
   - Handled by the `loggedInPage` fixture (via `loginAsCustomer`).

2. **Deposit**  
   - Calls `makeDeposit(loggedInPage, DEPOSIT_AMOUNT)`:
     - Opens Deposit tab.
     - Fills the deposit amount.
     - Submits the form.
     - Asserts “Deposit Successful”.
     - Asserts that the Balance increased by `DEPOSIT_AMOUNT`.
   - Takes `screenshots/after-deposit.png`.

3. **Transactions – verify deposit row**
   - Builds a `depositRow` locator via `TransactionPage.getRow(DEPOSIT_AMOUNT, 'Credit')`.
   - Calls `openTransactionsWithWait()` (includes a 1.5s wait before clicking).
   - Takes `screenshots/transactions-view.png`.
   - Uses `expect.poll(async () => depositRow.count())` to assert:
     - **At least one `$DEPOSIT_AMOUNT Credit` row exists** (within 60s).

#### 2. Withdraw test – `Should be able to withdraw`

1. **Setup: ensure balance**
   - Calls `makeDeposit(loggedInPage, DEPOSIT_AMOUNT)` again so the test is independent of the deposit test.

2. **Withdraw**
   - Creates `DepositPage`, `WithdrawalPage`, `TransactionPage`.
   - `openWithdrawalTab()` to show the Withdraw form.
   - Captures `balanceBeforeWithdrawal` from `depositPage.balanceDisplay`.
   - `fillAmount(WITHDRAWAL_AMOUNT)` and assert the field value.
   - `submitWithdraw()` (includes a short internal wait before clicking).
   - Asserts that the Balance now equals `balanceBeforeWithdrawal - WITHDRAWAL_AMOUNT`.
   - Takes `screenshots/after-withdraw.png`.

3. **Transactions – verify withdrawal row**
   - Builds a `withdrawalRow` locator via `TransactionPage.getRow(WITHDRAWAL_AMOUNT, 'Debit')`.
   - Calls `openTransactionsWithWait()` (again with the 1.5s wait).
   - Takes `screenshots/transactions-view-after-withdraw.png`.
   - Uses `expect.poll(async () => withdrawalRow.count())` to assert:
     - **At least one `$WITHDRAWAL_AMOUNT Debit` row exists** (within 60s).

### How to run

From the `tests` folder:

- **Run all tests** (all browsers from `playwright.config.ts`):

  ```bash
  npx playwright test
  ```

- **Run the transaction flow tests in Chromium only**:

  ```bash
  npx playwright test e2e/transactionFlow.spec.ts --project=chromium
  ```

- **Headed mode**:

  ```bash
  npx playwright test e2e/transactionFlow.spec.ts --project=chromium --headed
  ```

### Screenshots

During runs, these screenshots are created in `screenshots/`:

- `after-login.png` – after the login fixture finishes.
- `after-deposit.png` – after a successful deposit and balance update.
- `transactions-view.png` – Transactions view after deposit.
- `after-withdraw.png` – after a successful withdrawal and balance update.
- `transactions-view-after-withdraw.png` – Transactions view after withdrawal.
