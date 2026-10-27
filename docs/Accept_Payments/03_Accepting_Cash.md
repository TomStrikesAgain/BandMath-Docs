# Accepting Cash

BandMath's cash management system is built around the concept of **Cash Custody**. Because BandMath tracks every penny your band, venue, or tour package earns, it needs to know exactly who is holding the physical cash at the end of the night so the ledger stays perfectly balanced.

## How to Accept a Cash Payment

When a fan wants to pay with physical cash at the merch table or box office:

1. **Build the Cart:** Add merchandise items in the **Merch Stand** (or tap **`[ QUICK SELL DOOR TICKETS ]`** to add door admission tickets to your cart).
2. **Select Cash:** Choose **Cash** as the payment method.
3. **Assign Custody:** You will see a dropdown asking **"Who received it?"** Select your own name, the **Cashbox**, or the name of the band member physically taking the money.
4. **Pocket the Cash:** Take the physical cash from the fan and place it in your cash box, lockbox, or pocket.
5. **Complete the Sale:** Tap to finalize the order.

## How the Ledger Handles Cash

When you select your own name as the person who received the cash, you are taking "custody" of that money. 

Behind the scenes, BandMath automatically does the heavy lifting:
* It logs the total revenue for the band (and routes any applicable tax set-aside into the [VAT Bank](../Team_Management/06_The_VAT_Bank.md)).
* It deducts the items from your inventory (or increments the Door Ticket count on the event).
* It instantly calculates the profit splits for the rest of the group.
* It debits your personal account in the ledger, because you are now holding the band's money. 

At the end of the tour, you don't have to worry about counting up huge stacks of cash and dividing it manually. The **Standings** page will simply show that you owe the band money, which is perfectly offset by the cash already sitting in your pocket!

:::tip Multi-Custodian Door Cash & The Cashbox
When a **Venue**, **Tour Manager**, or **Band** rings up cash Door Tickets via `[ QUICK SELL DOOR TICKETS ]`, BandMath tracks those cash receipts under `Door Tickets by Custodian` in [The Closing Room](../Events_and_Closing_Room/04_Multi_Band_Closing_Room.md) and automatically nets that already-collected cash against your final settlement envelope. For foreign cash tours, see our [Multi-Currency Touring](../Advanced_Workflows/02_Multi_Currency_Touring.md#the-merch-float--foreign-cash-walkthrough) guide.
:::
