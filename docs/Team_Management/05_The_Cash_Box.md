# The Cash Box

When you set up a band in BandMath, you are automatically provisioned a permanent system account known as the **Cash Box (`Cashbox`)**.

While the **[Band Bank](./04_The_Band_Bank.md)** represents the digital money sitting in your band's shared business checking account, the **Cash Box** serves a specific physical purpose: it represents the **actual physical paper bills and coins** sitting inside your merch table lockbox or tour cash pouch (`Cashbox (Physical Till)`).

:::danger Never Create a Shadow Profile for Your Cash Box
Your built-in **`Cashbox`** is a system account (`is_system_account = true`) that is automatically excluded from member expense and profit splits. **Never** create a [Shadow Profile](./03_Shadow_Profiles.md) named *"Merch Cashbox"*—BandMath treats Shadow Profiles as human bandmates, which would charge your metal lockbox a `1/N` share of every tank of gas and give it a share of your merch profits!
:::

---

## Why Do We Need a Cash Box?

When you sell merchandise or door tickets for cash, that money physically exists at the merch table. Until someone deposits that cash into the bank or takes it home, it belongs to the band but is sitting inside the physical pouch.

If you log a cash sale directly to a band member, BandMath assumes that member put the money straight into their personal pocket. By routing tabletop cash into the **Cash Box** instead, your ledger tracks the exact physical cash balance sitting in your lockbox at any given moment.

---

## How to Use the Cash Box

### 1. Seeding Your Starting Change (`The Merch Float`)
Before doors open, if a bandmate (**Alice**) puts `€100.00` of change into the merch box from her personal wallet (or an ATM withdrawal), log a **Transfer** from **`Alice` → `Cashbox`** for `€100.00`. Alice is immediately credited `+€100.00` in **Standings**, and the `Cashbox` now holds `€100.00`.

### 2. Accepting Cash Sales & Paying Tabletop Cash Expenses
* **Cash Merch & Ticket Sales:** In the **Merch Stand** (or Door POS), select **`Cash` → Received by: `Cashbox`**.
* **Paying Cash Expenses Out of the Box:** If you pull cash directly out of the lockbox to pay a local sound engineer, highway toll, or venue parking, log an **Expense** and select **`Paid by: Cashbox`**. BandMath shows your live `"Available in Cashbox"` balance right on the Expense screen.

:::note Physical Law: The Cash Box Cannot Go Negative (`>= 0` Floor)
Because a physical lockbox cannot hold negative paper bills, BandMath blocks any **Expense** or **Transfer** (`Paid by: Cashbox`) that exceeds the current `Cashbox` balance. If your `Cashbox` shows `€0.00` in the app even though you have physical bills in the pouch, log your starting float (`Transfer → Cashbox`) or your cash sales first—or select the band member who paid out of their own pocket!
:::

### 3. 1-Tap End-of-Night or End-of-Tour Till Closeout (`[ COUNT / RECONCILE TILL ]`)
At the end of the night (or the end of an international tour leg), open the **Standings** page and tap **`[ COUNT / RECONCILE TILL ]`** on the **`Cashbox (Physical Till)`** card:

1. **Enter Counted Cash Value:** Type the actual physical cash counted in the box (or the exact Home Currency amount you received after converting foreign tour cash at a bank or currency desk).
2. **Optional Deposit / Hand-Off (`[ DEPOSIT ALL ]`):** Choose whether to transfer the counted cash to **`Band Bank`** (if depositing into the band checking account), to a **Specific Band Member** (if someone is taking the cash home for safekeeping), or leave `Deposit: €0` to keep the float in the box.
3. **Automatic Till & FX Reconciliation:** If your physical cash count differs from the expected book balance—whether from dropping €2 into a tip jar, making change at a dark merch table, or converting foreign banknotes on an international tour—BandMath atomically logs an **`"FX & Till Reconciliation"`** adjustment (split across your band's merch-cut recipients) and updates your `Cashbox` balance in a single tap!

:::tip Touring Abroad with Foreign Cash?
Your built-in **`Cashbox`** doubles as your foreign currency envelope when touring across borders—letting you ring up normal Home Currency merch items while collecting `£ GBP`, `CHF`, or `PLN` banknotes at the table. Read the complete **[Multi-Currency Touring](../Advanced_Workflows/02_Multi_Currency_Touring.md)** guide for the full walkthrough!
:::
