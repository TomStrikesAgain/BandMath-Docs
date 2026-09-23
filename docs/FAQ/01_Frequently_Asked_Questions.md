# Frequently Asked Questions

### How do I upgrade my subscription?

All subscriptions are managed securely via our web portal. To upgrade, simply log in at `account.itsbandmath.com` using your Admin credentials and select the tier that fits your band's needs.

### Can I be in multiple bands on BandMath?

Yes! BandMath supports multiple bands for each user. You can be a member of an unlimited number of bands and an Admin for up to 5 bands. You can easily switch between your bands at any time from the Band Dropdown on the User Settings page.

### Does BandMath handle multiple currencies for international tours?

Yes! You do not need to create a new workspace or change your base currency when touring abroad. For in-person card payments, you can seamlessly accept foreign currencies using our [Stripe QR Codes](../Accept_Payments/02_Stripe_QR_Codes.md) workflow. Stripe handles the foreign exchange conversion dynamically, and deposits the funds into your home bank account. For physical cash, see our guide on the [Merch Float](../Advanced_Workflows/02_Multi_Currency_Touring.md#the-merch-float--foreign-cash-walkthrough).

### What is the "Band Bank"?

The Band Bank is a permanent member profile created automatically for your band. It represents the communal pool of money owned by the band as a business entity (like your shared business checking account or the physical cash box). Unlike traditional spreadsheets that only compute a flat percentage of overall ownership, BandMath continuously tracks exactly how much of that communal money belongs to each individual member on an ongoing basis.

### Can I use BandMath if some of my band members don't want to download the app?

Yes! You can create a "Shadow Profile" for them. An Admin can log transactions on their behalf, allowing you to track their balances perfectly without them ever needing to open the app.

### How does Automated Debt Settlement work?

Instead of tracking a tangled web of "who owes who" for every individual receipt, BandMath analyzes the net balances of everyone in the band. It then calculates the absolute simplest way to settle all debts with the fewest number of cash transfers.

### How do we handle taxes on merch sales?

BandMath features a "VAT Bank" – a special, automated profile that holds Value-Added Tax (or sales tax). When you sell merch, the tax portion is automatically transferred to the VAT Bank, ensuring you don't accidentally spend money you owe to the government.

### What is a Groovatar?

A Groovy Avatar! These are funky, musically-themed characters that pop up on loading screens throughout the app. They are also used as default placeholder images when transaction receipts or merch inventory photos are not available.

### Can we export our data for tax season?

Absolutely. You can export your entire ledger to a detailed CSV file at any time, which includes every transaction, date, payer, and calculated balance.

### What happens if I make a mistake on a transaction?

Anyone in the band can edit or delete any transaction at any time, regardless of who created it.

### Can we sell items at-cost to band members?

Yes! When logging a sale in the Point-of-Sale (POS) system, you can toggle the "At Cost" switch for any band member, which allows them to take an item at its exact unit cost rather than the retail markup.

### How does BandMath handle fractions of a cent?

Our "Penny Catcher" algorithm ensures that when an expense is split unevenly (e.g. $10.00 split 3 ways), fractions of a cent are never lost or infinitely rounded. The ledger will always balance perfectly to the penny.

### How can I get help or contact support?

We use Crisp as our customer support platform. You can reach out to our support team at any time using the chat widget located in the bottom corner of the web portal (`account.itsbandmath.com`), or by tapping the "Support" link directly in the app's menu.

### What are the processing fees for card payments?

When you accept an in-person card payment using Tap to Pay on iPhone or Android, the transaction is processed through Stripe Terminal. The standard processing rate is **1.4% + €0.10** per transaction. 

Additionally, Stripe charges a **€0.10** "Tap on Mobile" fee for every physical tap. Instead of taking this out of each transaction, Stripe batches them together and bills your account once at the end of the day. For a full breakdown of fees (including Radar fraud protection for manually entered cards), see the [Tap to Pay Guide](../Accept_Payments/01_Tap_to_Pay.md#processing-fees).

### How do I send receipts to my fans?

Immediately after completing a transaction in the Merch Manager, you will be prompted with an option to email a receipt to the customer on the success screen. 

If you accidentally close that screen, or if the customer typed their email address wrong, don't panic! Simply go to your **Transaction Feed**, tap on that specific transaction to open the detail page, and scroll to the bottom. From there, you can see where the receipt was sent, update the email address, and resend it.

**For Automated & Refund Receipts:** Because BandMath uses Stripe Connect, your band owns its own merchant account. To automatically email your fans a receipt for refunds or successful payments without doing it manually, be sure to enable **Customer Emails** in your Stripe Dashboard. (Settings > Business Settings > Customer Emails).
