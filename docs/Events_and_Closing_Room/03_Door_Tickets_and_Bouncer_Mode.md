---
sidebar_position: 3
sidebar_label: Door Tickets & Bouncer Mode
---
# Multi-Custodian Door Ticket POS & Bouncer Mode

Once doors open at the venue, two things happen simultaneously at the entrance: walk-up fans are buying **Door Tickets**, and pre-sale ticket holders are getting their **QR Tickets** scanned. BandMath gives your door team dedicated tools for both—without ever exposing your band's private financial ledger.

---

## 1. Multi-Custodian Door Ticket POS (`[ QUICK SELL DOOR TICKETS ]`)

At a live show, the person who ran online pre-sales isn't always the person sitting at the door with a cash box or phone terminal. Sometimes the **Venue** rings up door tickets, sometimes the **Tour Manager** runs the door, and sometimes a **Band** member sells walk-up tickets next to the merch table.

BandMath supports **Multi-Custodian Door Ticket POS**:
1. Any authorized participant on the show (**Venue**, **Tour Manager**, or **Band**) can tap **`[ QUICK SELL DOOR TICKETS ]`** (or use the **Cart** tab in the 3-icon Venue/TM bar).
2. Select the ticket tier and ring up the fan via **[Tap to Pay](../Accept_Payments/01_Tap_to_Pay.md)** or **[Cash](../Accept_Payments/03_Accepting_Cash.md)**.
3. **Zero Cross-Merchant Bleed:** Whoever rings up the Door Ticket collects those funds directly into **their own Merchant Account or Cashbox**.
4. **Automatic Closing Table Netting:** In [The Closing Room](./04_Multi_Band_Closing_Room.md), BandMath breaks down `Door Tickets by Custodian` and automatically deducts whatever cash or card funds each party already collected at the door from their final **Net Closing Envelope** (while keeping the agreed [Event Ticket Tax Set-Aside](../Advanced_Workflows/04_Touring_Tax_and_Nightly_Settlements.md#tier-1-standardized-event-ticket-tax-rate) with the custodian who processed the sale).

---

## 2. Bouncer Mode & The "Hand-Off" Safety Lock

### The Real-World Door Problem
On tour or at an independent venue, you rarely have an extra company iPad just for the door. Usually, a Band Admin, Tour Manager, or Venue Operator needs to hand their own smartphone to a hired door person, local volunteer, or sound tech at the entrance to scan tickets for two hours—**without** letting that person snoop through the band's bank balances, member standings, or settlement numbers.

### How the Bouncer Lock Solves It
1. Open the **Bouncer** tab (from the Event page or the 3-icon Venue/TM navigation bar).
2. Toggle on the **Bouncer Safety Lock** and hand your phone to your door staff.
3. While locked in **Bouncer Mode**, the screen is strictly restricted to:
   * **Live Camera QR Ticket Scanner:** Instant validation of fan QR tickets with clear visual/haptic feedback for valid check-ins, duplicate scans, or invalid codes.
   * **Live Guest List & Manual Check-In:** Searchable guest list and ticket holder roster for fans whose phone battery died.
   * **Headcount Progress Bar:** Real-time `Checked In / Total Sold` counter.
4. **Authentication Required to Exit:** If the door person taps to exit Bouncer Mode or tries to switch back to `Standings`, `Home`, or `Settings`, BandMath requires **biometric / device authentication (Face ID, Touch ID, or Passcode)** before unlocking the rest of the app.

:::note Mobile Camera Requirement for Live QR Scanning
Live camera QR ticket scanning in **Bouncer Mode** is a native mobile app feature available on **iOS and Android**. On web browsers, you can view and search the live Guest List and check in attendees manually.
:::
