---
sidebar_position: 2
sidebar_label: Online Ticketing & Promo Links
---
# Online Ticketing, First-Sale Lock & Promoter Attribution Links

On DIY and independent tours, the person who creates the event on the calendar isn't always the merchant who holds the Stripe account for online ticket pre-sales. Sometimes the **Venue** sells the pre-sale tickets, sometimes the **Tour Manager** runs the box office, and sometimes the **Headliner** handles ticketing for a local bill.

BandMath handles all three scenarios seamlessly with our **3-State Online Ticketing Claim** and automatic **Promoter Attribution Links**.

---

## 1. The 3-State Online Ticketing Claim & First-Sale Lock (`🔒`)

Every event with ticket tiers moves through three clear states:

### State 1: Unclaimed (Free Setup)
Any free `Band`, `Venue`, or `Tour Manager` account can create an event and configure ticket tiers, pricing, capacities, and the [Event Ticket Tax Rate](../Advanced_Workflows/04_Touring_Tax_and_Nightly_Settlements.md#tier-1-standardized-event-ticket-tax-rate) before a merchant is assigned.

### State 2: Claimed & Switchable (`0` Tickets Sold)
Any participant on the show with an active Pro subscription and connected Stripe account—whether the **Venue**, the **Tour Manager**, or **any Band on the bill**—can tap **`[ CLAIM ONLINE TICKETING ]`**.
* As long as **`0` tickets have been sold**, the designated ticketing merchant can still be switched if the promoter and bands decide a different party should run the online box office.

### State 3: Permanently Locked on Ticket #1 (`🔒`)
The exact instant the **first online ticket is sold** (`total_sold >= 1`), BandMath triggers a permanent database lock (`🔒`):
* The online ticketing merchant can **no longer be changed** for that event.
* This guarantees that all online pre-sale funds, Stripe processing fees, and ticket tax set-asides remain 100% unified inside a single Merchant of Record account for clean nightly settlement.

:::danger Why Locking on Ticket #1 Matters
Splitting online pre-sales across multiple Stripe merchants mid-campaign creates a nightmare of fractured payouts, duplicate tax liabilities, and confused fan refund paths. Locking on Ticket #1 guarantees a single authoritative pre-sale pool at the Closing Table.
:::

---

## 2. Automatic Per-Band Promoter Attribution Links (`?ref=`)

When four bands share a bill, the promoter and bands almost always want to know: **"How many pre-sale tickets did each band actually bring in?"**

BandMath tracks this automatically without requiring separate ticket tiers for every band:
1. Open the event inside the BandMath app and tap **`[ Share Link ]`**.
2. BandMath automatically appends your active band's attribution tag (`?ref=<yourBandId>`) to both your shareable checkout URL and your downloadable **Promoter QR Flyer**.
3. Whenever a fan buys tickets through your link or scans your poster QR code, the sale is credited to your band's **Promoter Attribution Counter** right on the **Closing Table**—making it effortless to settle promoter bonuses or draw-based splits.

---

## 3. Fan / Street-Team Share Pass & Referral Leaderboard

Word of mouth is what fills independent rooms. Alongside band-level attribution, BandMath empowers your fans and street-team promoters to share the show and climb the **Event Referral Leaderboard**:

* **The Fan Share Pass:** After purchasing a ticket on the BandMath WebCheckout portal (or grabbing a promoter share pass), fans receive a personalized referral link and QR pass they can post to their stories or send to friends in group chats.
* **Live Referral Leaderboard:** Every ticket purchased through a fan or street-team promoter's referral link automatically increments their tally on the event's **Referral Leaderboard**—letting bands and venues reward their top street-team advocates with guest list upgrades, free merch at the stand, or VIP perks at the door.
