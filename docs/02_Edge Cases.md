# BandMath: Edge Cases & Workarounds
*Last Updated: 2026-06-27*

This document outlines complex, real-world edge cases that touring bands might encounter, and details the exact "BandMath Way" to resolve them using the app's existing architecture.

---

## 1. The Retroactive VAT Correction
**The Scenario:** 
A band records a full night's worth of merch transactions using the Point-of-Sale system. At the end of the night, they realize their band's tax rate was set incorrectly. As a result, the `VAT Bank` has collected either too much or too little of the profit pool across dozens of transactions. 

**The Nightmare:** 
In a traditional spreadsheet, the band would have to manually edit every single line item and recalculate the split for every band member.

**The BandMath Solution ("The Grand Adjustment"):**
Bands do not need to delete a single transaction or mess with their merch inventory. Because of the double-entry routing algorithm, they can fix the entire night in seconds with a single manual transaction.

First, calculate the total discrepancy (e.g., "We collected $100 for tax, but it should have been $150. We are short $50").

**Scenario A: The VAT was too LOW (Short $50)**
If the band is short $50 in tax, it means the band members accidentally pocketed $50 of profit that rightfully belongs to the government.
1. Go to the ledger and click **Add Transaction**.
2. Create a manual **Expense** for **$50** and title it "VAT Correction".
3. Set the "Paid By" field to the **VAT Bank**.
*Result:* The algorithm instantly registers that the VAT Bank covered a $50 expense for the group. It automatically deducts the respective split from each active member's standings and routes that money directly into the VAT Bank's balance.

**Scenario B: The VAT was too HIGH (Overpaid $50)**
If the VAT bank accidentally captured $50 too much, it means the VAT Bank is holding $50 of the band's rightful profit.
1. Go to the ledger and click **Add Transaction**.
2. Create a manual **Income** for **$50** and title it "VAT Refund".
3. Set the "Collected By" field to the **VAT Bank**.
*Result:* The algorithm sees that the VAT Bank just collected $50 of band income. It instantly forces the VAT Bank to surrender that money and evenly distributes it back into the band members' balances.

---

## 2. The "At-Cost" Member Purchase
**The Scenario:** 
A band member wants to buy one of the band's shirts for themselves, but they only want to pay the wholesale cost (e.g., the shirt costs $5 to print, but retails for $25). They want to take the shirt, ensure the inventory stays accurate, and properly reimburse the rest of the band for the wholesale cost.

**The Nightmare:** 
In a spreadsheet, you'd have to manually deduct the inventory, calculate the cost basis, and then somehow inject a $5 debt for that specific member without inflating your gross retail sales numbers.

**The BandMath Solution (The "At Cost" POS Checkout):**
Because BandMath handles inventory and double-entry routing seamlessly, this is processed exactly like a normal fan sale, but utilizing the built-in "At Cost" toggle.

1. Go to the **Point of Sale (POS)** and add the shirt to the cart.
2. Under the Merch Total, toggle the pricing selector from **Retail** to **At Cost**. This automatically reduces the cart total to match the exact wholesale cost of the items.
3. Tap **Cash**, ensure the active band member is set to the person taking the shirt, and tap **Go!** to checkout.
*Note: No physical cash actually needs to change hands.*

**Why this works flawlessly:**
* **Inventory & Analytics:** The POS system automatically deducts the shirt from inventory and logs the sale at $5. This ensures the Merch Analyzer's ROI and profit margins remain 100% accurate (it doesn't look like a shirt was "lost" or stolen).
* **The Settlement Routing:** The algorithm registers that the band member "collected" $5 in cash. Since no actual cash was put into a lockbox, that member is personally holding the $5. The algorithm will automatically split that $5 revenue among the band, meaning the member will effectively "owe" the rest of the band out of their share, perfectly reimbursing the group for the cost of the shirt!

---

## 3. The Incorrect Merch Transaction
**The Scenario:** 
A band member was rushing at the merch table and accidentally checked out the wrong size or applied the wrong discount. They realize the mistake a few minutes later and need to fix it.

**The Nightmare:** 
In most systems, deleting a sale destroys the financial record, but leaves the inventory permanently skewed. You would have to manually go back into the stock room, figure out exactly which items were logged in that specific cart, and manually add them back to your inventory counts one by one.

**The BandMath Solution (The Self-Healing Ledger):**
BandMath's database is deeply interconnected. To fix a bad merch sale, you simply delete it.

1. Go to the **Transaction Feed** (the Ledger).
2. Locate the incorrect Merch Sale and tap **Delete**.
3. Re-ring the customer correctly in the POS.

**Why this works flawlessly:**
When you hit "Delete" on a Merch Sale, the backend (`delete_merch_transaction` action) triggers a cascading self-heal:
* **The Math Realignment:** The primary transaction and all associated profit splits (`transaction_participants`) are instantly deleted, perfectly resetting every band member's standings back to where they were before the sale.
* **The Auto-Restock:** The backend opens up the associated order, looks at every single item and size that was in the cart, and automatically adds those exact quantities back into your active inventory.
* **The Analytics:** The `orders` and `order_items` records are purged, meaning your Merch Analyzer's ROI, velocity, and "Trophy" metrics remain completely uncontaminated by the mistake.

---
*(Add new edge cases below)*
