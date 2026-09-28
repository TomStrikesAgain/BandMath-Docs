---
sidebar_position: 1.5
sidebar_label: FAQ
---

# Frequently Asked Questions

<details name="faq_accordion">
<summary>How do I upgrade my subscription?</summary>


All subscriptions are managed securely via our web portal. To upgrade, simply log in at [account.itsbandmath.com](https://account.itsbandmath.com) using your Admin credentials and select the tier that fits your band's needs. For more details, see [Upgrading and Downgrading](./Billing_and_Account/01_Upgrading_and_Downgrading.md).

</details>

<details name="faq_accordion">
<summary>Can I be in multiple bands on BandMath?</summary>


Yes! BandMath supports multiple bands for each user. You can be a member of an unlimited number of bands and an Admin for up to 5 bands. You can easily switch between your bands at any time from the Band Dropdown on the User Settings page.

</details>

<details name="faq_accordion">
<summary>Does BandMath handle multiple currencies for international tours?</summary>


Yes! You do not need to create a new workspace or change your base currency when touring abroad. For in-person card payments, you can seamlessly accept foreign currencies using our [Stripe QR Codes](./Accept_Payments/02_Stripe_QR_Codes.md) workflow. Stripe handles the foreign exchange conversion dynamically, and deposits the funds into your home bank account. For physical cash, see our guide on the [Merch Float](./Advanced_Workflows/02_Multi_Currency_Touring.md#the-merch-float--foreign-cash-walkthrough).

</details>

<details name="faq_accordion">
<summary>What is the "Band Bank"?</summary>


The Band Bank is a permanent member profile created automatically for your band. It acts as a proxy for your shared business checking account. Unlike traditional spreadsheets that only compute a flat percentage of overall ownership, BandMath continuously tracks exactly how much of that communal money belongs to each individual member on an ongoing basis. Learn more about entity-based accounting in [The Band Bank](./Team_Management/04_The_Band_Bank.md) article.

</details>

<details name="faq_accordion">
<summary>Can I use BandMath if some of my band members don't want to download the app?</summary>


Yes! You can create a "Shadow Profile" for them. An Admin can log transactions on their behalf, allowing you to track their balances perfectly without them ever needing to open the app. Learn more in our [Shadow Profiles guide](./Team_Management/02_Shadow_Profiles.md).

</details>

<details name="faq_accordion">
<summary>How does Automated Debt Settlement work?</summary>


Instead of tracking a tangled web of "who owes who" for every individual receipt, BandMath analyzes the net balances of everyone in the band. It then calculates the absolute simplest way to settle all debts with the fewest number of cash transfers. For a deep dive into the math behind this, see [The Ledger](./Features/01_The_Ledger.md).

</details>

<details name="faq_accordion">
<summary>How do we handle taxes on merch sales?</summary>


BandMath features a "VAT Bank" – a special, automated profile that holds Value-Added Tax (or sales tax). When you sell merch, the tax portion is automatically transferred to the VAT Bank, ensuring you don't accidentally spend money you owe to the government. Learn exactly how this proxy account works in our [VAT Bank Guide](./Team_Management/06_The_VAT_Bank.md). If you ever need to apply taxes to past transactions, check out our guide on [Retroactive VAT](./Troubleshooting/01_Retroactive_VAT.md).

</details>

<details name="faq_accordion">
<summary>What is a Groovatar?</summary>


A Groovy Avatar! These are funky, musically-themed characters that pop up on loading screens throughout the app. They are also used as default placeholder images when transaction receipts or merch inventory photos are not available.

</details>

<details name="faq_accordion">
<summary>Can we export our data for tax season?</summary>


Absolutely. You can export your entire ledger to a detailed CSV file at any time, which includes every transaction, date, payer, and calculated balance. For more details on what's included and how to run the report, read about [Data Exports](./Features/07_Data_Exports.md).

</details>

<details name="faq_accordion">
<summary>What happens if I make a mistake on a transaction?</summary>


Anyone in the band can edit or delete any transaction at any time, regardless of who created it. For a walk-through on how to handle refunds or incorrect logs, see [Incorrect Merch Transactions](./Troubleshooting/03_Incorrect_Merch_Transaction.md) or [Issuing a Refund](./Troubleshooting/04_Issuing_a_Refund.md).

</details>

<details name="faq_accordion">
<summary>Can we sell items at-cost to band members?</summary>


Yes! When logging a sale in the Point-of-Sale (POS) system, you can toggle the "At Cost" switch for any band member, which allows them to take an item at its exact unit cost rather than the retail markup. Read the full walkthrough on [At Cost Member Purchases](./Advanced_Workflows/01_At_Cost_Member_Purchase.md).

</details>

<details name="faq_accordion">
<summary>How does BandMath handle fractions of a cent?</summary>


Our "Penny Catcher" algorithm ensures that when an expense is split unevenly (e.g. $10.00 split 3 ways), fractions of a cent are never lost or infinitely rounded. The ledger will always balance perfectly to the penny. For a deep dive into how we handle fractional remainders, read about [The Penny Catcher](./Features/06_The_Penny_Catcher.md).

</details>

<details name="faq_accordion">
<summary>How can I get help or contact support?</summary>


To get help, simply log into the BandMath app, open the end drawer (the menu on the right side of the screen), and tap **Support** at the bottom of the list. From there, you can send a message directly to our team, and you'll receive a response straight to your email inbox. 

Alternatively, you can always reach out to us directly by emailing <span onClick={(e) => { e.preventDefault(); if (typeof navigator !== 'undefined') { navigator.clipboard.writeText('support@itsbandmath.com'); const originalText = e.target.innerText; e.target.innerText = 'Copied!'; setTimeout(() => e.target.innerText = originalText, 2000); } }} style={{cursor: 'pointer', color: 'var(--ifm-color-primary)', fontWeight: 'bold', textDecoration: 'underline'}} title="Click to copy email">support{'@'}itsbandmath.com</span>.

</details>

<details name="faq_accordion">
<summary>What are the processing fees for card payments?</summary>


When you accept an in-person card payment using Tap to Pay on iPhone or Android, the transaction is processed through Stripe Terminal. The standard processing rate is **1.4% + €0.10** per transaction. 

Additionally, Stripe charges a **€0.10** "Tap on Mobile" fee for every physical tap. Instead of taking this out of each transaction, Stripe batches them together and bills your account once at the end of the day. For a full breakdown of fees (including Radar fraud protection for manually entered cards), see the [Tap to Pay Guide](./Accept_Payments/01_Tap_to_Pay.md#processing-fees).

</details>

<details name="faq_accordion">
<summary>How do I send receipts to my fans?</summary>


Immediately after completing a transaction in the Merch Manager, you will be prompted with an option to email a receipt to the customer on the success screen. 

If you accidentally close that screen, or if the customer typed their email address wrong, don't panic! Simply go to your **Transaction Feed**, tap on that specific transaction to open the detail page, and scroll to the bottom. From there, you can see where the receipt was sent, update the email address, and resend it.

**For Automated & Refund Receipts:** Because BandMath uses Stripe Connect, your band owns its own merchant account. To automatically email your fans a receipt for refunds or successful payments without doing it manually, be sure to enable **Customer Emails** in your Stripe Dashboard. (Settings > Business Settings > Customer Emails).

</details>

<details name="faq_accordion">
<summary>What is the Cash Box?</summary>

The Cash Box is a special account that represents the physical cash currently sitting at your merch table. It acts as a temporary holding area for unclaimed cash that needs to be distributed or deposited before the end of the night. Learn more in our [Cash Box](./Team_Management/05_The_Cash_Box.md) guide.

</details>
