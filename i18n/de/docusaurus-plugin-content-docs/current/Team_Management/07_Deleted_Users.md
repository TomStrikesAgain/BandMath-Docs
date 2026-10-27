# Deleted Users

Under privacy laws like GDPR and CCPA, users have the right to completely delete their accounts and all associated personal data. However, in a double-entry accounting system like BandMath, simply deleting a member from the database would mathematically destroy every historical transaction they were ever a part of, throwing the entire band's ledger out of balance.

BandMath handles this elegantly through a secure anonymization process:

## 1. Profile Anonymization

Instead of removing the member's profile from the band entirely, BandMath securely wipes all Personally Identifiable Information (PII):
* The member's name is permanently changed to **"Deleted User"**.
* Their underlying authentication `user_id` connection is completely severed.
* Their profile is marked as inactive, meaning they are automatically excluded from any future splits (like the Penny Catcher or venue settlements) and will no longer receive a cut of merch sales.

## 2. Preserving Mathematical Integrity

By preserving this anonymized "ghost" profile, all historical ledger math remains perfectly intact. If that user paid for gas or owed the band $50 before they left, the ledger will accurately reflect those past balances attributed to "Deleted User". 

This ensures that the rest of the band's finances and historical records are never compromised when someone decides to delete their account.

:::note Leaving One Band vs. Deleting Your Entire Account
If a bandmate is simply leaving your band (or wrapping up a tour as a hired session player) and does **not** want to erase their entire BandMath account, they should use **Leave Band** in Settings (or an Admin can deactivate them in **Band Settings**). Deactivating a member excludes them from future splits and merch cuts while keeping their name and historical ledger records intact. See [Admins vs. Members](./01_Admins_vs_Members.md#leaving-a-band-vs-removing-a-member) for details.
:::
