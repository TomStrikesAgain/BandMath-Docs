# Shadow Profiles

BandMath's architecture is designed around a unique concept called **Shadow Profiles**. This feature exists because we understand the reality of touring bands: not everyone wants to download a finance app. 

Whether it's a stubborn drummer or a temporary hired musician, you still need to track their financial shares and debts accurately.

## What is a Shadow Profile?

When an Admin adds a new member to the band's roster, BandMath creates a "Shadow Profile" in the database. This profile has a name and a role, but it is not yet attached to a real user account.

Because the Shadow Profile exists in your band's ledger, you can immediately start assigning transactions to them. You can log that the Shadow Profile paid for gas, or that they owe a split of the hotel bill. BandMath will calculate their balances and settlements perfectly, just as it would for an active user.

## Active Profiles vs. Shadow Profiles

* **Active Profiles:** These are members who have downloaded the BandMath app, created an account, and joined the band using an invite code. They can log in and see their own balances on their phone.
* **Shadow Profiles:** These are placeholders in your ledger. The Admin tracks their finances on their behalf.

## Transitioning to an Active Profile

If a member with a Shadow Profile decides they *do* want to download the app, they can easily claim their profile and instantly access all their historical data. See [Claiming a Profile](./03_Claiming_a_Profile.md) for instructions on how this process works.
