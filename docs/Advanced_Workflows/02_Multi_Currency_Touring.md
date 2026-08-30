# Multi-Currency Touring

When your band embarks on an international tour, dealing with foreign currencies, fluctuating exchange rates, and cross-border payment processing can quickly become an accounting nightmare. 

BandMath simplifies this entirely: **You do not need to create a new workspace or change your base currency when touring abroad.**

Instead, keep logging all of your transactions in your primary Band Workspace exactly as you would at home. 

## In-Person Card Payments Abroad

Due to strict international banking regulations, **Tap to Pay on iPhone** and **Tap to Pay on Android** will **only function in your home country** (the country where your bank account is registered). The physical address associated with your payout bank account must match the geographical location where the payment is being taken.

If you attempt to use Tap to Pay while in a foreign country, the transactions will be blocked by Stripe.

### The Solution: Stripe QR Codes

To accept card payments seamlessly when touring internationally, BandMath uses the **Stripe QR Code Checkout** workflow. 

When a fan wants to pay with a card:
1. Select **Card** at checkout and choose **Show QR Code**.
2. The fan scans the QR code with their own smartphone camera.
3. They are taken to a secure, localized Stripe checkout page on their device, where they can pay using Apple Pay, Google Pay, or by manually entering their credit card details.

Because the fan is initiating the payment on their own device rather than your hardware, this bypasses the strict hardware location restrictions of Tap to Pay. 

### Automatic Currency Conversion

When using Stripe QR Codes abroad, you will continue to price your merchandise in your home currency inside the BandMath app. 

Stripe handles the complex foreign exchange (FX) conversion dynamically behind the scenes. The fan is charged the equivalent amount in their local currency, while the funds are deposited into your band's bank account in your home currency. This keeps your BandMath ledger perfectly unified and clean, completely shielding you from the headache of manual exchange rate calculations!

For full technical details, see the [Stripe QR Codes](../Accept_Payments/02_Stripe_QR_Codes.md) guide.

## The Merch Float & Foreign Cash Walkthrough

While card payments are converted automatically by Stripe, you will inevitably collect a pile of physical foreign cash at the merch table. To handle this, you need a "Merch Float" (a starting pool of local currency to make change). 

Here is the recommended workflow to handle foreign cash flawlessly using BandMath’s double-entry accounting. 

### 1. Create a "Cashbox"
First, create a [Shadow Profile](../Team_Management/02_Shadow_Profiles.md) in your band called **Merch Cashbox**. This acts as a virtual band member that "holds" your physical cash during the tour.

### 2. Fund the Float
When you arrive in the foreign country, one member (e.g., Alice) goes to an ATM, withdraws money from her personal checking account (e.g., $220 USD), and receives local currency (e.g., €200 EUR) to put in the physical lockbox.
* **In BandMath:** Alice logs a **Cash Transfer** from herself to the *Merch Cashbox* for $220. 
*(Alice is credited $220. The Cashbox now owes the band $220).*

### 3. Log Nightly Sales
Every night, log your cash sales normally in your home currency. Do not worry about exact daily exchange rates—just estimate! 
* **In BandMath:** Select *Merch Cashbox* as the person who "collected" the cash. If you sell $2,000 worth of merch, the Cashbox balance grows.
*(The Cashbox now owes the band $2,220 total).*

### 4. Exchange Before You Leave
Before you cross the border or board your flight home, take the massive pile of foreign cash to a currency exchange desk and convert it all back into your home currency. Suppose after exchange rates and fees, you are handed **$2,150 USD** in physical cash.

### 5. Assign Custody
Another band member (e.g., Bob) puts that $2,150 USD in his backpack to take home.
* **In BandMath:** Log a **Cash Transfer** from the *Merch Cashbox* to *Bob* for $2,150.
*(Bob now owes the band $2,150. The Cashbox is left owing the band $70).*

### 6. The True-Up
That missing $70 is the cost of doing business. It acts as a "catch-all" bucket that absorbs the bank fees, market fluctuations, and any mental math errors you made when logging sales over the tour!
* **In BandMath:** Log an **Expense** called "Foreign Exchange Fees" for $70, marked as Paid By: *Merch Cashbox*.
*(The Cashbox balance drops exactly to $0!)*

By doing this, the ledger balances perfectly without anyone having to do manual currency conversions on the road.

> [!TIP] FX Gains
> If the foreign currency *strengthens* during the tour, you might get back more than the Cashbox owes (e.g., $2,250 USD). In this edge case, the Cashbox would have a $30 surplus. Instead of an Expense, you would log a $30 **Income** (FX Gain) collected by the Cashbox to zero it out!
