# The Merch Analyzer

Data is power. The Merch Analyzer is an advanced analytics suite available to Merch Manager subscribers. It provides deep insights into your inventory performance so you can make smarter decisions for the next tour.

## Profit & ROI Tracking

Stop guessing which designs are actually making you money. The Merch Analyzer breaks down:
* Total revenue generated per item.
* Exact profit margins (factoring in historical production costs).
* Return on Investment (ROI) for specific merchandise runs.

## Restock Warnings

Never run out of your best sellers mid-tour. The Merch Analyzer tracks your average sales velocity and visually flags items that are running dangerously low on stock.

While this might be giving away some of our "secret sauce", we believe in full transparency so you can decide if you want to make purchasing decisions based on this model. Here is exactly how the restock warning algorithm works under the hood:

1. **Calculate the Timebox Duration:** First, the analyzer looks at the date range you've selected for the report and calculates exactly how many days that spans (e.g., 14 days).
2. **Calculate Sales Velocity:** For every individual item and size, it takes the total quantity sold during that timebox and divides it by the number of days to get your **Daily Sales Velocity**. (e.g., If you sold 28 Large Tour Tees in 14 days, your velocity is `2.0 / day`).
3. **Project Days Remaining:** It then takes your current physical stock on hand for that item and divides it by the Daily Sales Velocity to predict exactly how many days of inventory you have left. (e.g., If you have 4 Large Tour Tees left, and you're selling 2.0 a day, you have `2.0 days` of stock remaining).
4. **The Trigger:** If the projection determines you have **less than 3 days of stock remaining** at your current sales velocity, it triggers an Actionable Warning in the UI, recommending that you restock.

## Trophy Awards

We've gamified merch sales! The Analyzer automatically awards trophies to your best-performing items (e.g., "Fastest Seller", "Highest Profit Margin"), so you can quickly identify the stars of your merch table at a glance.

![Merch Analyzer Dashboard](https://itsbandmath.com/automated-assets/11-merch-analyzer.png)
