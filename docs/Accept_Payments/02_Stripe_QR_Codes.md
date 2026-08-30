# Stripe QR Codes

Stripe QR Code Checkout provides a secure, reliable way to accept card payments from fans without relying on physical Tap to Pay hardware. It is the required workflow for [Multi-Currency Touring](../Advanced_Workflows/02_Multi_Currency_Touring.md) when your band travels abroad, as Tap to Pay requires you to be in your home country.

## How It Works

When a fan makes a purchase at the merch table:
1. In the BandMath Merch Manager, complete the checkout flow as usual.
2. Select **Card** as the payment method, and then tap **Show QR Code**.
3. A unique, 30-minute expiring QR code is generated on your screen.
4. The fan scans the QR code with their own smartphone camera.
5. They are seamlessly redirected to a Stripe Hosted Checkout page on their device.
6. The fan pays securely using **Apple Pay**, **Google Pay**, or by manually entering their physical card details.

## Real-Time Sync & Fulfillment

The BandMath app automatically listens to your backend database via real-time websockets. 

As soon as the fan completes their payment on their device, Stripe alerts our servers. The BandMath app instantly detects this, automatically dismisses the QR code screen, and displays your success receipt. 

Behind the scenes, BandMath automatically deducts the inventory, creates the transaction ledger entry, and handles complex band member splits—all atomically and securely.

### Check Payment Status (Fallback)

If you are playing in a basement club or a venue with spotty Wi-Fi, the real-time websocket connection to your app might drop. If the fan has completed the payment but your app hasn't updated yet, simply tap the **Check Payment Status** button on the QR code screen. This forces the app to manually poll the database and fetch the updated order status immediately.

## Canceling an Order

If the merch line is moving fast and a fan changes their mind (or takes too long), you can simply dismiss the QR code modal in the app. 

When you dismiss the modal, BandMath automatically reaches out to the Stripe API and **explicitly invalidates the checkout session**. This ensures the fan cannot accidentally (or maliciously) complete the payment on their phone five minutes later after you've already moved on to the next customer. The order is safely marked as failed in your ledger.
