# Working with Hired Merch Sellers

If your band frequently hires local hourly workers to sell merchandise at shows, it might seem complicated to track their cash tills and credit card sales. However, you can perfectly track their cash custody without needing to invite temporary workers to your BandMath workspace using their personal phone numbers or emails.

Instead, we recommend setting up dedicated, generic "Merch Station" accounts.

## 1. Creating Generic Accounts

Rather than inviting the individual, an Admin can create a generic **Active Profile** for the merch table.

1. Create a dummy email address or use a band alias (e.g., `merch1@yourband.com`).
2. Generate an invite code from the **Band Settings** page for a new member named "Merch Station 1".
3. Download the BandMath app on your dedicated merch iPad or mobile device.
4. Use the dummy email to create an account and join the band using the invite code.
5. The device can now remain permanently logged into this generic account.

> [!TIP]
> If you run multiple merch tables at large venues, you can create "Merch Station 2", "Merch Station 3", etc., each with its own device.

## 2. Working the Table (POS)

During the show, the hired seller uses the POS on their dedicated device just like any other band member.

* **Cash Sales:** When the seller logs a cash sale, BandMath automatically attributes that cash to the "Merch Station 1" profile. In the ledger, Merch Station 1 now "owes" the band that cash because they are physically holding it in their cash box.
* **Credit Card Sales:** When they log a card sale, the money goes straight to your Band Bank (or the connected Stripe/bank account). Credit card transactions do not affect the seller's physical cash balance in BandMath.

## 3. End-of-Night Cash Handoff

At the end of the night, it's time to reconcile the till and collect the cash. The BandMath ledger will show exactly how much cash "Merch Station 1" is supposed to be holding based on their cash sales.

1. The hired seller counts their cash box and physically hands the cash over to a bandmate or the Tour Manager.
2. In BandMath, log a **Transfer** transaction:
   * **Who Paid:** Merch Station 1
   * **Who Owes:** Tour Manager (or whoever took the cash)
   * **Amount:** The total cash handed over (e.g., $500)
3. **The Magic:** This instantly zeroes out the Merch Station's balance (they no longer owe the band anything) and transfers that cash custody to the Tour Manager, who is now responsible for depositing it or keeping it safe!

> [!NOTE]
> Since the hired sellers are paid separately (e.g. hourly via an eventual paycheck), their pay is completely decoupled from the nightly merch till reconciliation. When you eventually pay them, you can just log that as a standard Expense paid for by the Band Bank!
