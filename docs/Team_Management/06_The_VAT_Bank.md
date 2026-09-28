# The VAT Bank

If the [Band Bank](./04_The_Band_Bank.md) is a proxy for your shared checking account, the **VAT Bank** is a proxy for the government. 

It is an invisible, provisioned shadow profile designed to hold tax liabilities. It doesn't represent a physical bank account or a physical cash box—it represents the reality that at the end of the touring season, somebody is going to have to write a check to the tax authority.

## The Inverse of the Band Bank

The VAT Bank operates as the exact inverse of the Band Bank within our Entity-Based Accounting system:

* **Band Bank:** The *Bank* holds the physical cash, which means the Bank **owes** money back out to the individual band members for their respective shares. 
* **VAT Bank:** The *Members* hold the physical cash (collected at the merch table), but a percentage of that cash doesn't actually belong to them. Therefore, the Members **owe** money back out to the VAT Bank.

## How It Works in Practice

When you play shows in regions that require you to remit VAT (Value Added Tax) or sales tax, you are collecting that tax from the fans on behalf of the government. 

1. **Collecting Tax:** As you log transactions or settle up nightly merch sales, any tax collected is assigned to the VAT Bank profile. 
2. **Accruing Debt:** Because the physical cash from the show was handed to the band members (or deposited into the checking account), the ledger records that the members now *owe* the VAT Bank for that collected tax. 
3. **Writing the Check:** Over the course of the tour, the VAT Bank will accumulate a positive balance in the Standings (because everyone owes it money). At the end of the quarter or tour, when you file your taxes, whoever physically writes the check to the government simply logs a **Transfer** for the tax amount and assigns the VAT Bank as the **payee**. 

If the money to pay the tax comes out of the shared checking account, the Band Bank is logged as the **payer**. If a member (like Charlie) pays the tax out of his own pocket, Charlie is logged as the **payer**. This instantly zeroes out the VAT Bank's balance, and whoever wrote the check is properly credited for covering the band's tax liability through the standard automated debt settlement system.

## Configuring Your Tax Rate

You can update your band's active tax rate at any time by navigating to the **Band Settings** page and looking under **Financial Settings**.

* If you leave your tax rate set to **0%**, you won't ever have to deal with the VAT Bank, and it will remain dormant. 
* If you want to use the VAT Bank to track your tax liabilities, simply plug your local tax rate in there and BandMath will automatically calculate and route the appropriate funds.

## The Stripe Tax Alternative

If you rely heavily on digital transactions, you have the option to use Stripe's built-in tax services. [Stripe Tax](https://stripe.com/docs/tax) automatically calculates, collects, and reports sales tax and VAT based on your customer's location. 

However, before enabling Stripe Tax, you must consider the following:

* **Cash Transactions:** Stripe Tax only monitors digital transactions processed through the Stripe terminal. It cannot calculate or track tax liability for cash sales logged at the merch table.
* **Double-Taxing the Ledger:** If you enable Stripe Tax on your merchant account *and* plug a tax rate into BandMath, your books will essentially get "double-taxed." BandMath will deduct tax for the VAT Bank, while Stripe will separately deduct tax for its own compliance system.
* **Debt Settlement Disconnect:** Tax liabilities calculated entirely on Stripe's end will not natively flow back into BandMath's internal debt settlement algorithm.

**Our Advice:** Choose one system. If you need to track tax liability for cash sales or want everything cleanly tied into your band's internal debt settlement, use the **VAT Bank** (by setting your rate in Band Settings). If you want Stripe to handle complex multi-region compliance and don't care about cash taxes, you can use **Stripe Tax**—but you must set your BandMath tax rate to **0%** to prevent double-counting.
