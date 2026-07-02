# Multi-Currency Touring

Because BandMath uses a high-performance integer engine, it treats currency strictly as a display symbol (e.g., `$`, `€`, `£`) and **does not** perform automated currency exchange rate conversions.

While this ensures perfect mathematical accuracy without floating-point errors, it means you should never log transactions of mixed currencies in the same workspace.

So, how do you handle a tour in a foreign country?

## The Solution: A Dedicated Workspace

If your band (e.g., "Lynxhead") is based in Europe and uses Euros (`€`), but you are about to embark on a 3-week tour in the United States, you should create a secondary Band Workspace specifically for that tour.

### 1. Create the Tour Workspace
1. Create a new Band Workspace and name it something distinct, like **"Lynxhead US $"**.
2. During the setup, set the Base Currency for this specific workspace to USD (`$`).
3. Invite your touring members to this new workspace.

### 2. Log Tour Finances
For the duration of the US tour, log all of your merchandise sales, gas expenses, and per diems in the "Lynxhead US $" workspace. Everything will be calculated natively in USD.

### 3. Settlement and Exchange
At the end of the tour, your Standings page will show exactly who owes what in USD. 

When it comes time to pay out, the band settles the USD ledger natively (e.g. handing out physical USD cash, or transferring via a US bank account). From there, it is up to the individual band members to handle their own currency exchange conversions back to their home bank accounts.

By using dedicated workspaces for foreign tours, you ensure your main ledger's accounting remains perfectly clean, completely bypassing the nightmare of daily fluctuating exchange rates!
