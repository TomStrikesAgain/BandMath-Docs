# The Retroactive VAT Correction

**The Scenario:** 
A band records a full night's worth of merch transactions using the Point-of-Sale system. At the end of the night, they realize their band's tax rate was set incorrectly. As a result, the `VAT Bank` has collected either too much or too little of the profit pool across dozens of transactions. 

**The Nightmare:** 
In a traditional spreadsheet, the band would have to manually edit every single line item and recalculate the split for every band member.

**The BandMath Solution ("The Grand Adjustment"):**
Bands do not need to delete a single transaction or mess with their merch inventory. Because of the double-entry routing algorithm, they can fix the entire night in seconds with a single manual transaction.

First, calculate the total discrepancy (e.g., "We collected $100 for tax, but it should have been $150. We are short $50").

### Scenario A: The VAT was too LOW (Short $50)
If the band is short $50 in tax, it means the band members accidentally pocketed $50 of profit that rightfully belongs to the government.
1. Go to the ledger and click **Add Transaction**.
2. Create a manual **Expense** for **$50** and title it "VAT Correction".
3. Set the "Paid By" field to the **VAT Bank**.

*Result:* The algorithm instantly registers that the VAT Bank covered a $50 expense for the group. It automatically deducts the respective split from each active member's standings and routes that money directly into the VAT Bank's balance.

### Scenario B: The VAT was too HIGH (Overpaid $50)
If the VAT bank accidentally captured $50 too much, it means the VAT Bank is holding $50 of the band's rightful profit.
1. Go to the ledger and click **Add Transaction**.
2. Create a manual **Income** for **$50** and title it "VAT Refund".
3. Set the "Collected By" field to the **VAT Bank**.

*Result:* The algorithm sees that the VAT Bank just collected $50 of band income. It instantly forces the VAT Bank to surrender that money and evenly distributes it back into the band members' balances.
