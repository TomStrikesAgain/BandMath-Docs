# The Incorrect Merch Transaction

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
When you hit "Delete" on a Merch Sale, the backend triggers a cascading self-heal:
* **The Math Realignment:** The primary transaction and all associated profit splits are instantly deleted, perfectly resetting every band member's standings back to where they were before the sale.
* **The Auto-Restock:** The backend opens up the associated order, looks at every single item and size that was in the cart, and automatically adds those exact quantities back into your active inventory.
* **The Analytics:** The order records are purged, meaning your Merch Analyzer's ROI, velocity, and "Trophy" metrics remain completely uncontaminated by the mistake.
