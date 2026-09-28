# The Band Bank

**The Band Bank** is a permanent profile in BandMath that acts as a proxy for your real-world checking account.

BandMath uses **Entity-Based Accounting**. This means it doesn't just calculate a flat percentage of your overall bank balance (e.g., "Alice owns 25% of the total revenue"). Instead, it tracks each member's individual share on a *per-transaction* basis. Because of this, when money goes into the Band Bank, the Bank now *owes* each individual member their respective share of that deposit.

## How it Tracks Ownership

Instead of waiting until the end of the year to slice up a massive pie, BandMath calculates this debt instantly. Every time a $100 merch sale hits the Band Bank, the ledger records that the Bank now owes the individual band members for their specific share of that $100 (using the [Penny Catcher](../Features/06_The_Penny_Catcher.md) algorithm to perfectly balance fractional cents).

The Band Bank isn't a savings account where money just sits indefinitely. That money always belongs to somebody. Because it acts purely as a container holding the cash, the exact dollar amount it owes to each member gets routed directly into BandMath's overall debt settlement algorithm. This means the Band Bank's balance simply becomes part of the final settle-up equation.

When it comes time to pay out the band at the end of a tour, you simply look at the standings and log a **Transfer** from the Band Bank to the individual members to settle those exact debts.

## Keeping it Synced

While the Band Bank is not digitally linked to your real bank account, its balance in the app should always stay perfectly synced with the actual amount of communal money you have. 

This happens in two ways:
1. **Automated Payouts:** When you accept a digital merch sale, the funds automatically flow into the Band Bank's balance as soon as Stripe processes the payout.
2. **Manual Income:** When a venue wires you a performance guarantee (or any other income that hits the bank account directly), you manually log it as an **Income** transaction. By setting the recipient to the Band Bank and selecting the active members in the "Split By" section, the app knows the bank is holding the money, but owes it back to those specific members.

By treating the band as its own profile, BandMath can elegantly handle scenarios that spreadsheets fail at, such as using the band's communal funds to pay a local sound engineer, or settling out the [Cash Box](./05_The_Cash_Box.md), all while keeping everyone's personal standings mathematically perfect.
