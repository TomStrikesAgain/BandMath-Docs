---
sidebar_position: 4
sidebar_label: Touring Tax & Nightly Settlements
---

# Live Music Touring Tax, Ticket VAT & Nightly Settlements (EU & US)

When the lights come up after an encore and everyone gathers in the back office to settle the show, the fastest way for a band, promoter, or venue to accidentally lose money is by splitting **Gross** receipts without backing out consumer tax first.

Whether you are dealing with **Value-Added Tax (VAT)** in the European Union and UK or **Sales Tax** across state lines in the United States, tax collected from fans at the door or the merch table is **not** show revenue—it is money held in trust for the government.

This guide breaks down how live music taxes work in the real world across Europe and North America, why ticket tax and merch tax are almost never the same rate, and how BandMath's **Two-Tier Tax Model** protects every band, tour manager, and venue at the closing table.

---

## 1. Why Tax Matters at the Night-of-Show Closing Table

Every ticket or T-shirt sold to a fan in a taxable jurisdiction includes a portion owed to the tax authority. To find the true **Net Revenue** from a tax-inclusive sale, you divide the gross price by `1 + Tax Rate`:

```text
Net Revenue = Gross Receipts / (1 + Tax Rate)
Tax Set-Aside = Gross Receipts - Net Revenue
```

### The "Gross Split" Trap

Imagine a venue processes **€5,350** in ticket sales in a country with **7% Ticket VAT** (`€5,000` Net Revenue + `€350` VAT):
* **If you split Gross (`80% / 20%` of €5,350):** The band walks out with €4,280 and the venue keeps €1,070. At the end of the quarter, the venue (as the merchant of record who processed those sales) still owes the government the full **€350** in VAT—leaving the venue with only €720 (`14.4%` instead of `20%`).
* **If you split Net (`80% / 20%` after backing out 7% VAT):** The **€350** tax set-aside stays with the merchant who processed the tickets so they can pay the government. The remaining **€5,000 Net Ticket Pool** is split cleanly: **€4,000** to the band and **€1,000** to the venue.

### Venue Merch Cuts (`15%–25%`)

The exact same rule applies when a venue takes a percentage of a band's merchandise sales (a "venue merch cut" or "hall fee"):
* Because the band is the merchant of record on their own **Merch Stand**, the band is legally responsible for remitting the VAT or sales tax on every shirt sold, plus absorbing any Stripe card processing fees.
* Standard industry practice calculates the venue's merch commission **Net of Tax and Card Processing Fees**. Otherwise, the band would be paying the venue a 20% commission on tax money that belongs to the government and processing fees already kept by Stripe!

:::tip
In BandMath, every settlement calculation—both for **Ticket Pools** and **Venue Merch Cuts**—automatically backs out the applicable tax set-aside and card processing fees first, ensuring neither the band nor the house ever pays commission on government tax money.
:::

---

## 2. How Touring Tax Works in the European Union (EU & UK)

Under EU VAT law, live concerts and in-person merchandise sales follow the **Place of Supply Rule**: both event admission (tickets) and physical goods sold to fans on-site (merch) are taxed at the rates of the country where the venue is physically located.

When touring Europe, two critical tax realities affect nearly every show settlement:

### Crucial EU Nuance #1: Ticket VAT ≠ Merch VAT

Almost every EU member state treats live concert admission as a protected cultural activity with a **reduced VAT rate**, while taxing physical merchandise (T-shirts, hoodies, vinyl, hats) at the **standard goods rate**:

| Country | Concert Ticket VAT (Reduced Cultural Rate) | Physical Merch VAT (Standard Goods Rate) |
| :--- | :--- | :--- |
| **Germany** | `7%` | `19%` |
| **France** | `5.5%` *(or `2.1%` for qualifying early runs)* | `20%` |
| **Netherlands** | `9%` | `21%` |
| **Belgium** | `6%` | `21%` |
| **Spain** | `10%` | `21%` |
| **Austria** | `13%` | `20%` |
| **Poland** | `8%` | `23%` |

Because of this gap, a single "Show Tax Rate" can never accurately settle both the box office and the merch table in Europe.

### Crucial EU Nuance #2: VAT-Registered Headliners vs. VAT-Exempt Openers (`0%` SME)

On a multi-band bill, different bands on the exact same stage often have completely different legal tax statuses:
* **VAT-Registered Touring Acts & Venues:** Established touring bands and venues registered for VAT must back out `19%–21%` VAT on their merch sales.
* **VAT-Exempt Indie & Support Bands (`0%`):** Emerging bands operating under their country's small-business exemption (such as Germany's *Kleinunternehmerregelung*, France's *Franchise en base de TVA*, or the **EU Cross-Border SME Scheme**) are legally **VAT-exempt (`0%`)**. They do not charge VAT on their merch and cannot deduct input VAT.

If a closing room forced a flat `20%` merch VAT rate onto a VAT-exempt opener, it would artificially shrink their net merch total before calculating a venue cut. Conversely, if it forced `0%` onto a VAT-registered headliner, the headliner would overpay the venue cut out of their VAT liability.

---

## 3. How Touring Sales Tax Works in the United States

In the United States, there is no federal VAT. Instead, retail sales are governed by state, county, and municipal **Sales Tax** (plus local **Admissions / Amusement Taxes** on tickets in certain cities and states).

### Physical Presence Nexus on Tour

When your band sets up a merch table inside a venue in another state, selling physical goods in person generally creates temporary **physical presence nexus** in that jurisdiction for the night of the show:
* **Local Rate Variations:** A Tuesday night show in Austin, Texas (`8.25%` combined state + city sales tax) has a completely different rate than a Thursday night show in Portland, Oregon (`0%` state sales tax).
* **Product-Specific Exemptions:** A few US states exempt everyday clothing (like T-shirts and hoodies) below a certain dollar threshold while still taxing vinyl, posters, and accessories (for example, Pennsylvania, New Jersey, Massachusetts, and New York below `$110`).

### Tax-Inclusive Flat Pricing at the Merch Table

No band wants to make change with coins in a dark club because a `$30` T-shirt rang up at `$32.48` with tax. Working bands across the US price their merch in clean, round, **tax-inclusive** numbers (`$30 T-Shirt`, `$40 Vinyl`).

During the show, fans pay flat round prices. At the end of the night, BandMath uses tax-inclusive math (`$30 / 1.0825 = $27.71 Net`, `$2.29 Tax Set-Aside`) to route the exact tax portion into your [VAT Bank](../Team_Management/06_The_VAT_Bank.md) and compute the venue's merch cut strictly on your `$27.71` net revenue.

---

## 4. How BandMath Models This Cleanly: Two-Tier Transparency

To support both EU reduced-ticket / standard-merch VAT rules and multi-band bills with mixed tax statuses, BandMath separates show taxation into two transparent, independent tiers:

### Tier 1: Standardized Event Ticket Tax Rate

Ticket tax applies to admission to a specific event in a specific venue, so it is standardized across the entire show:
1. **Set Upfront on the Event:** The Event Organizer (Venue, Tour Manager, or Originating Band) sets the **Event Ticket Tax Rate** when creating or editing the event.
2. **Visible in the Event Header:** Every participant on the bill can see the active ticket tax badge (e.g., **`[ TICKET TAX 7% ]`**) right in the Event Header, and the organizer can adjust it prior to locking the final settlement.
3. **Protects Every Ticket Collector:** Every ticket sold for that event—whether an online pre-sale or a Door Ticket rung up in cash or Tap to Pay by the Venue, Tour Manager, or any Band—uses that single agreed **Event Ticket Tax Rate**. Whoever processed the ticket sale retains the exact tax set-aside in their own account so they are never left short when filing taxes, while the **Net Ticket Pool** flows into the Closing Room for the split.

### Tier 2: Per-Band Merch Tax Rate with Deal Sheet Transparency

Because every band is the legal merchant of record for their own merchandise, each band controls their own **Merch Tax Rate** inside their Band Settings (or directly from their **Show Call Sheet** card):
1. **Automatic VAT Bank Routing:** Whenever a band sells merch in the **Merch Stand** at a show, their configured Merch Tax Rate automatically sets aside the tax liability into their band's [VAT Bank](../Team_Management/06_The_VAT_Bank.md) in **Standings**.
2. **Call Sheet & Deal Sheet Transparency:** In a multi-band closing room, a venue or promoter should never have to guess why two bands with similar gross merch sales have different net numbers. BandMath prints each band's declared Merch Tax Rate directly on:
   * Their **Show Call Sheet Info Card** (visible to the Closing Officer and band).
   * Every **Deal Sheet** merch cut line item—displaying the exact math in plain sight (for example, `15% of €228.77 (Net of 19% VAT & Stripe)` for a VAT-registered headliner, or `15% of €142.50 (0% VAT · Net of Stripe)` for a VAT-exempt opener).

:::note
Need to change your band's Merch Tax Rate when crossing a border on tour? Update your tax rate in **Band Settings** before opening your Merch Stand for the night, and BandMath will apply the new rate to that night's sales and Deal Sheet without altering any of your previous shows!
:::
