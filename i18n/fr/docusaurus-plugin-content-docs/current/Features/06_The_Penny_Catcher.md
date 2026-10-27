# The Penny Catcher Algorithm

Accounting software is only as good as its ability to balance a ledger. While most apps handle basic arithmetic fine, they often fall apart when dealing with uneven splits and fractions of a cent, leading to ledgers that are perpetually off by $0.01 or $0.02. 

BandMath solves this using our proprietary **Penny Catcher Algorithm**.

## The Problem with Percentages

Imagine your band has 3 members with an equal 33.33% profit split. 

You sell a CD for $10.00. 
* Member A gets $3.333333...
* Member B gets $3.333333...
* Member C gets $3.333333...

Because physical currency cannot be divided into thirds of a cent, traditional spreadsheet formulas will round these numbers down to $3.33 each. 

However, $3.33 + $3.33 + $3.33 = $9.99. 

Where did the remaining $0.01 go? In a standard spreadsheet, that penny is completely lost. Over the course of a 30-date tour with thousands of transactions, these lost pennies snowball, causing the digital ledger to drift away from the actual amount of physical cash in the bank account. 

## How the Penny Catcher Works

BandMath never drops remainders. When an uneven split occurs, the Penny Catcher algorithm intercepts the fractional remainder before it can be lost.

It then algorithmically assigns that stray penny to a band member to ensure the transaction balances perfectly to the exact cent.

1. **Transaction 1 ($10.00 split 3 ways):**
   * Member A receives: $3.34 (Penny Catcher awards the extra cent here)
   * Member B receives: $3.33
   * Member C receives: $3.33
   * *Total: $10.00*

2. **Transaction 2 ($10.00 split 3 ways):**
   * Member A receives: $3.33 
   * Member B receives: $3.34 (Penny Catcher awards the extra cent here)
   * Member C receives: $3.33
   * *Total: $10.00*

By acting in a round-robin fashion, the algorithm ensures that the ledger remains mathematically perfect, while ensuring that the distribution of those fractional pennies remains completely fair and balanced among the band members over time.
