# Multi-Currency Touring

When your band crosses an international border—whether a French band (`€ EUR`) heading into the UK (`£ GBP`), Switzerland (`CHF`), or Poland (`PLN`), or a US band (`$ USD`) touring Canada (`CA$`) and Europe—dealing with foreign cash, fluctuating exchange rates, and cross-border card terminals can quickly turn into an accounting headache.

BandMath solves international touring through one foundational rule: **The One Home Currency Law**.

You **never** need to create a second band workspace, change your base currency symbol, or maintain multi-currency sub-ledgers. Once your workspace has recorded any transactions, orders, or events, your **Home Currency is permanently locked (`🔒 HOME CURRENCY LOCKED`)** to guarantee ledger integrity. Because your band's checking account, merch printing bills, and member debt settlements all happen in your **Home Currency**, every foreign transaction on tour enters your BandMath ledger in your Home Currency through **4 simple channels**.

---

## Channel 1: Digital Money (Cards, Stripe QR & Bank Wires)

Roughly 90% of modern touring transactions are digital—and **Stripe and your bank already convert every single one of them into exact Home Currency cents for you**. You never need to calculate an exchange rate for digital money.

### 1. Selling Merch by Card Abroad (`Stripe QR Codes`)

Due to international banking and anti-money-laundering regulations, hardware-based **Tap to Pay on iPhone** and **Tap to Pay on Android** are strictly geofenced to the country where your Stripe payout bank account is registered. If you attempt to use Tap to Pay in a foreign country, Stripe will block the hardware tap.

To accept card, Apple Pay, and Google Pay seamlessly abroad, switch to **[Stripe QR Codes](../Accept_Payments/02_Stripe_QR_Codes.md)**:

1. Build the fan's cart in the **Merch Stand** as usual.
2. Select **Card** and tap **`Show QR Code`**.
3. The fan scans the QR code with their own smartphone camera and pays via **Apple Pay**, **Google Pay**, or card on a localized Stripe Checkout page.
4. Because the transaction originates on the fan's device rather than your NFC hardware, it bypasses Tap to Pay's physical location lock.
5. **Automatic FX to Your Home Currency:** Your Merch Stand prices remain in your Home Currency (`€`, `£`, or `$`). The fan's card network (or **Stripe Adaptive Pricing**, if enabled in your Stripe Dashboard) converts the charge automatically, and Stripe deposits the exact **Home Currency** proceeds into your **[Band Bank](../Team_Management/04_The_Band_Bank.md)**.

:::tip Basement Venue Wi-Fi Tip
Unlike offline cash logging, **Stripe QR Codes require both your phone and the fan's phone to have internet access** (mobile data or Wi-Fi). When playing underground basement clubs abroad where international roaming drops, write the venue's guest Wi-Fi network and password right on your merch sign!
:::

### 2. Paying Tour Expenses by Card (Fuel, Hotels, Ferries & Tolls)

When a bandmate pays for fuel, a ferry, or a hotel in a foreign currency using a personal or band debit/credit card, **never type the foreign number printed on the paper receipt into BandMath**.

Because BandMath's ledger operates `1:1` in your Home Currency, typing a `1,200 SEK` Swedish fuel receipt as `1200` inside a `€ EUR` workspace would tell the ledger you spent `€1,200.00` on a single tank of gas!

**The Bank Statement Rule:**
1. Open your mobile banking app (Wise, Revolut, or your bank's push notification) right after tapping your card.
2. Read the **exact pending or settled Home Currency charge** (e.g., `€105.42`).
3. Log the **Expense** in BandMath for **`€105.42`**, snap a photo of the `1,200 SEK` paper receipt, and type `"1,200 SEK"` in the description note.

### 3. Show Guarantees Paid by Bank Wire

When a foreign promoter or festival wires your show payout (`£500 GBP` or `2,000 PLN`) to your band's IBAN or checking account, wait for the transfer to land (or check the incoming conversion notification) and log the **exact Home Currency amount deposited** (`€588.40`) into your **Band Bank**.

---

## Channel 2: The Foreign Merch Table & Cross-Border Tax

When fifty fans rush the merch table after your set in a dark club, nobody wants to do live exchange-rate math or make change with foreign coins.

### 1. Check Your Merch Tax Rate Before Doors Open

Before opening your **Merch Stand** in a new country or state, check your **Merch Tax Rate** inside **Band Settings**:
* If your band is **VAT-exempt abroad** (for example, an EU band playing a non-EU export show in the UK or Switzerland, an indie band operating under the `0%` EU Cross-Border SME exemption, or a US band crossing into a `0%` sales-tax state like Oregon), set your **Merch Tax Rate to `0%`** before doors open so BandMath doesn't accidentally lock 20% domestic tax into your **[VAT Bank](../Team_Management/06_The_VAT_Bank.md)**.
* If you are registered and required to collect local tax in that jurisdiction, set the local rate for that night's show and flip it back when you return home. Changing your tax rate in Band Settings only applies to new sales going forward and never alters historical shows. For a full breakdown of EU & US rules, see **[Live Music Touring Tax & Nightly Settlements](./04_Touring_Tax_and_Nightly_Settlements.md)**.

### 2. Hang Clean Local Cash Prices on Your Physical Sign

Keep your digital **Merch Warehouse** catalog untouched in your Home Currency (e.g., `€25` T-Shirt, `€35` Vinyl).

On your physical cardboard sign at the merch table, write **clean, coin-free local banknote prices**:
* **In London (`£ GBP`):** Write **`£20`** (or **`£20 Cash / €25 Card`** so fans scanning your Stripe QR code know why their phone shows `€25`).
* **In Warsaw (`PLN`):** Write **`100 PLN`**.
* **In Zurich (`CHF`):** Write **`CHF 25`**.

### 3. Ring Every Cash Sale Normally into the Built-In `Cashbox`

:::danger Never Create a Shadow Profile for Your Cashbox
Every BandMath workspace already includes a built-in system **[Cash Box (`Cashbox`)](../Team_Management/05_The_Cash_Box.md)** that is automatically excluded from member expense and profit splits. **Never** create a Shadow Profile named *"Merch Cashbox"*—BandMath treats Shadow Profiles as human bandmates, which would charge your metal lockbox a `1/N` share of every tank of gas and give it a share of your merch profits!
:::

Whenever a fan hands you foreign banknotes (`£20` or `100 PLN`) for a shirt:
1. Tap the normal **`€25` T-Shirt** in the **Merch Stand**.
2. Select **`Cash` → Received by: `Cashbox`**.
3. Drop the physical foreign bills into your zipper pouch or lockbox.

By ringing the normal Home Currency SKU, your **Inventory Matrix** deducts the exact shirt size (`M`, `L`, `XL`), your unit production costs (COGS) stay accurate in `€ EUR`, and your **`Cashbox`** tracks a running **"expected book value"** in your Home Currency. You don't need to worry that `£20` (`~€23.80`) or `100 PLN` (`~€23.20`) isn't exactly `€25.00`—that gap is reconciled automatically in one tap at the end of the tour!

---

## Channel 3: The Merch Float & Spending Foreign Cash on the Road

During the foreign leg of your tour, treat your built-in **`Cashbox`** as a single self-contained envelope for all physical foreign banknotes—covering your starting change (**Merch Float**), cash merch sales, cash show guarantees, and on-the-road cash expenses.

### 1. Seeding Change (`The Merch Float`) & The Non-Negative Till Law
When you arrive in the foreign country, suppose **Alice** withdraws `£100 GBP` from a local ATM to use as change at the merch table (**Merch Float**). Her banking app shows her personal checking account was charged **`€120.00 EUR`**.
* **In BandMath:** Log a **Transfer** from **`Alice` → `Cashbox`** for **`€120.00`**.
* *Result:* Alice is immediately credited `+€120.00` in **Standings**, and the `Cashbox` now holds `€120.00` of book value.

:::note Physical Law: Your `Cashbox` Cannot Go Negative (`>= 0` Floor)
Because a physical cash pouch cannot hold negative paper bills, BandMath strictly prevents any **Expense** or **Transfer** (`Paid by: Cashbox`) from exceeding the current `Cashbox` balance. Always seed your starting **Merch Float** (`Transfer → Cashbox`) or log your cash sales before logging cash expenses out of the box—or, if a bandmate paid out of their own pocket, select that bandmate as the payer!
:::

### 2. Adding Cash Show Guarantees
If a foreign promoter hands you **`£300 GBP`** in physical bills at the end of the night and you put those bills into the `Cashbox` pouch:
* **In BandMath:** Check the rough Google rate (`£300 ≈ €355`) and log an **Income** (`"London Show Guarantee"`, **Paid to: `Cashbox`**) for **`€355.00`**.

### 3. Spending Foreign Cash on the Road (Why Rough Estimates Self-Cancel!)
Smart touring bands don't hoard foreign cash for two weeks just to lose 8–12% at an airport currency booth—they **spend their foreign cash locally** on fuel, highway tolls, venue parking, local sound engineers, and band per diems!

Whenever you pull foreign bills out of the pouch to pay a shared band expense (e.g., `£50 GBP` cash for the local sound engineer or venue parking):
* **In BandMath:** Log an **Expense** (`"Sound Engineer"`, **Paid by: `Cashbox`**) at a quick mental estimate in your Home Currency (e.g., **`€60.00`**) and snap a photo of the receipt. (BandMath displays your live `"Available in Cashbox"` balance right inside the Expense screen so you always know how much book value is in the pouch).

:::tip Why Mid-Tour Cash Estimates Mathematically Self-Cancel to `€0.00`
You never need to look up exact daily exchange rates when spending shared tour cash out of the `Cashbox`!

**Here is the mathematical proof:** Suppose that `£50` cash payment was really worth `€58.50`, and you roughly logged it as **`€60.00`**. Logging `€60.00` reduces your `Cashbox` book balance by `€1.50` extra today—which automatically shrinks your end-of-tour till reconciliation adjustment by the **exact same `€1.50`** on the last day of the tour (`€60.00 + €70.00 = €58.50 + €71.50 = €130.00`).

**Every mid-tour estimation error cancels out to `€0.00` automatically!**

*(The only exception: if an individual bandmate takes foreign bills out of the pouch for **personal** spending—like buying vinyl records or pub drinks—log a **Transfer** from **`Cashbox` → `Member`** using the 3-second Google rate so their bandmates don't subsidize personal cash).*
:::

---

## Channel 4: End-of-Tour Till Closeout & Foreign Shows

### A. 1-Tap `[ COUNT / RECONCILE TILL ]` (3 Real-World Exit Paths)

Suppose at the end of your UK tour leg, your BandMath **`Cashbox (Physical Till)`** card on the **Standings** page shows an expected book balance of **`€2,220.00`**, and you are holding physical `£ GBP` banknotes in your pouch. You have three ways to close out the pouch—powered by BandMath's 1-tap **`[ COUNT / RECONCILE TILL ]`** tool:

#### Path 1: Exchange or Deposit Back to Your Home Currency (1-Tap Reconcile)
1. **Convert the Cash:** You exchange the remaining foreign bills (at a currency desk or bank ATM deposit) and receive **`€2,150.00 EUR`** in actual Home Currency.
2. **Tap `[ COUNT / RECONCILE TILL ]` on Standings:** Open the **Standings** tab, locate the **`Cashbox (Physical Till)`** card, and tap **`[ COUNT / RECONCILE TILL ]`**:
   * **Counted Home Currency Value:** Enter **`€2,150.00`** (what the physical cash actually converted to).
   * **Optional Deposit / Payout (`[ DEPOSIT ALL ]`):** Tap **`[ DEPOSIT ALL ]`** and choose **`Band Bank`** (if deposited into your business account) or **`Bob`** (if Bob puts the `€2,150.00` cash in his backpack).
3. **Automatic Atomic True-Up:** BandMath compares the expected book balance (`€2,220.00`) against your actual counted cash (`€2,150.00`) and atomically logs **both** your `€2,150.00` transfer and a **`€70.00` `"FX & Till Reconciliation"`** adjustment (split across your band's merch-cut recipients, since tabletop price rounding like `£20 vs €25` and exchange spreads come from the merch table).
   * Your **`Cashbox` balance drops to exactly `€0.00`** in one tap with zero mental subtraction!
   * *(If the foreign currency strengthened and you received **more** than the book balance—say `€2,250.00`—`[ COUNT / RECONCILE TILL ]` automatically records the `+€30.00` FX surplus as Income before transferring the full `€2,250.00` out!)*

#### Path 2: The "Bandmate Buyout" Pro Hack (`0%` Exchange Booth Fees!)
Before handing 10% of your hard-earned merch cash to an airport exchange booth, ask if anyone in the band is traveling back to that country soon (or wants foreign cash):
1. Check Google's mid-market rate for the physical foreign bills left in the pouch (say `£500 GBP = €590.00 EUR`).
2. Tap **`[ COUNT / RECONCILE TILL ]`** on the **`Cashbox (Physical Till)`** card, enter **`€590.00`** as the counted value, and select **`[ DEPOSIT ALL ]` → `Alice`** (who takes the physical `£500` bills).
3. Neither Alice nor the band pays a single cent in bank or airport exchange fees, and BandMath reconciles the remaining tabletop-rounding difference automatically!

#### Path 3: Roll Forward to Next Tour
If you tour that country regularly and keep a dedicated envelope of `£ GBP` or `CHF` bills in your band safe for next season's run, simply leave the balance in **`Cashbox`** (or tap **`[ COUNT / RECONCILE TILL ]`** with `Deposit: €0` to true-up the book value to the current Google exchange rate while keeping the bills inside the pouch for next tour's **Merch Float**).

---

### B. Foreign Venue Closing Rooms vs. DIY Headline Shows Abroad

What happens with the **Events** tab and **[The Multi-Band Closing Room](../Events_and_Closing_Room/04_Multi_Band_Closing_Room.md)** when you play a show in a foreign currency zone?

#### 1. Playing a Foreign Venue or Promoter's Show (`Stay as an Unlinked Slot`)
To prevent cross-currency math from corrupting either party's ledger, **every linked workspace inside a Multi-Band Closing Room must share the same Home Currency**. If your `€ EUR` band (or `€ EUR` tour manager) attempts to enter a 6-character Show Code for a Warsaw venue (`PLN`) or a London venue (`£ GBP`), BandMath blocks account linking and guides you to the clean workflow:

1. **Stay as an Unlinked Band Slot on the Venue's Deal Sheet:** The foreign Venue or Promoter adds your band to their event lineup as a standard **offline/unlinked slot** along with your email address (`contact_email`).
2. **Receive Your Official Itemized Closing Statement by Email:** At the end of the night, the Venue runs the full Deal Sheet math in `PLN` or `£ GBP` and taps **`[ EMAIL FINAL CLOSING RECEIPTS ]`**. You receive an official, itemized **Event Closing Statement** straight to your inbox showing the full box office breakdown, shared expenses, and your band's final payout in the local currency.
3. **Log the Payout in Your Home Currency:**
   * **If Paid by Bank Wire:** Wait for the wire to land and log the **exact Home Currency deposit** (`Income → Band Bank`).
   * **If Paid in Physical Foreign Cash:** Drop the bills into your pouch and log an **Income** (`Paid to: Cashbox`, or the bandmate holding the cash) at the rough Google rate—which reconciles automatically the next time you tap **`[ COUNT / RECONCILE TILL ]`**!

#### 2. Hosting Your Own DIY Headline Show Abroad (`Online & QR Door Tickets`)
What if your `€ EUR` band rents a basement room in London or Zurich and you are **self-promoting your own standalone show** (with no foreign-currency venue account linked)?

* **Create the Event in Your Own Workspace:** Tap **`[ + CREATE EVENT ]`** in your own Band Workspace as normal and set your ticket tiers in your Home Currency (e.g., `€15.00`).
* **Sell Pre-Sale & QR Door Tickets Seamlessly:** When local fans open your public ticket link or scan your Door Ticket QR code, Stripe displays your `€15.00` ticket price, their card network automatically converts `€15.00` from their local currency (`£ GBP` or `CHF`) at checkout, and Stripe deposits exact `€ EUR` proceeds into your **Band Bank**.
* **Two Pro Reminders for DIY Foreign Shows:**
  1. **Flyer Clarity:** Write **`"€15 Online / £15 Cash at Door"`** on your show poster and social links so local fans aren't surprised to see `€ EUR` on the web checkout page.
  2. **Local Admission Tax Rules:** Remember that admission tickets are generally taxed where the venue is physically located. For small DIY club shows below local registration thresholds this is typically `0%`, but for larger commercial shows check **[Live Music Touring Tax & Nightly Settlements](./04_Touring_Tax_and_Nightly_Settlements.md)**.
