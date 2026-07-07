# The Incorrect Merch Transaction

**The Scenario:** 
A band member was rushing at the merch table and accidentally checked out the wrong item or size (e.g., ringing up a Medium shirt instead of a Large). They realize the mistake a few minutes later and need to fix it.

**The Solution: Manual Inventory Override**
Whether the customer paid with Cash or Credit Card, you **should not delete the transaction** if the total dollar amount charged was correct. Deleting a transaction that was paid via Credit Card in BandMath does not automatically refund your payment processor (like Stripe or Square), and you do not want to force the customer to swipe their card again or hand back cash for a simple inventory logging mistake.

To fix the error:
1. Leave the transaction alone in the Ledger. The financial amount perfectly matches the money deposited into your cash box or bank account. 
2. An Admin should navigate to the **Merch Inventory** page and long press the item. 
3. Manually adjust the stock counts to reflect reality (e.g., manually add +1 to the Medium shirt stock, and subtract -1 from the Large shirt stock). 

This instantly corrects your physical inventory counts for the rest of the tour without creating a messy trail of deleted transactions in your financial ledger.
