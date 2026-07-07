# Issuing a Refund (Merch Returns)

**The Scenario:** 
You sell a customer a shirt, but they immediately realize it's the wrong size. You don't have their correct size in stock, so they ask for their money back.

**The Best Practice:**
When a customer needs a full refund, you need to return their money and take the physical item back. BandMath handles the accounting for this beautifully through our "Self-Healing Ledger."

1. **Refund the Money:** Hand the cash back to the customer, or issue a refund through your credit card processor's app (Stripe, Square, etc.).
2. **Delete the Transaction in BandMath:** Go to the **Transaction Feed** (the Ledger), locate the original Merch Sale, and tap **Delete**.

**Why this works flawlessly:**
When you hit "Delete" on a Merch Sale to process a return, the backend triggers a cascading self-heal:
* **The Math Realignment:** The primary transaction and all associated profit splits are instantly removed, perfectly resetting every band member's standings back to where they were before the sale. You are no longer financially responsible for that income.
* **The Auto-Restock:** The backend opens up the associated order, looks at every single item and size that was in the cart, and automatically adds those exact quantities back into your active inventory (since you physically took the shirt back).
* **The Analytics:** The order records are purged, meaning your Merch Analyzer's ROI and velocity metrics remain completely uncontaminated by the refunded sale.
