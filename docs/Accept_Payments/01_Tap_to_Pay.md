# Merchant Education for Tap to Pay on iPhone and Android

![Apple Tap to Pay on iPhone Lifestyle](./assets/apple_tap_to_pay_goods.jpg)

Accepting in-person contactless payments is easier than ever with **Tap to Pay on iPhone** and **Tap to Pay on Android**. 

These technologies turn your standard smartphone into a secure contactless card reader. This allows you, the merchant, to accept physical contactless credit and debit cards, as well as digital wallets like **Apple Pay** and **Google Pay**, directly on your device—no extra terminals or dongles needed. 

> [!WARNING] International Touring Limitation
> Due to strict banking regulations, Tap to Pay on iPhone and Tap to Pay on Android will **only function in your home country** (the country where your bank account is registered). If you are embarking on an international tour, you must use the [Stripe QR Codes](./02_Stripe_QR_Codes.md) workflow to accept card payments.

## How to Accept a Payment (iPhone)

When you are ready to check out a fan at the merch table:
1. Complete your checkout flow in the BandMath **Merch Manager** as usual.
2. Select **Tap to Pay on iPhone** as the payment method.
3. Present your iPhone to the customer. The screen will clearly indicate the charge amount, your band's name, and an instruction for the customer on where to tap.
4. Ask the customer to hold their contactless card horizontally, or their device (like an iPhone or Apple Watch), at the **top edge of your iPhone**, over the contactless symbol.
5. When you see the "Done" checkmark, the transaction is complete!

## How to Accept a Payment (Android)

1. Complete your checkout flow in the BandMath **Merch Manager** as usual.
2. Select **Tap to Pay on Android** as the payment method.
3. Present your Android phone to the customer. 
4. Ask the customer to hold their contactless card or smart device against the **back of your phone**. 
5. When the payment is approved, the transaction is complete!

### PIN Collection (SCA)
If the customer's bank requires a PIN for security (common in Europe), the Android interface will automatically transform into a secure PIN pad, allowing the customer to type their PIN directly on your screen.

*Note: This requires the customer's physical card to support "Online PINs". Older cards that only support "Offline PINs" will be rejected because your smartphone does not have a physical microchip slot to read the offline PIN data.*

## Processing Fees

When you accept a payment via Tap to Pay on iPhone or Android, the transaction is processed securely through Stripe Terminal. It can be confusing because Stripe batches some of these fees together at the end of the day. Here is exactly how the fees break down for European cards:

1. **Standard Transaction Fee (1.4% + €0.10)**: This is Stripe's standard payment processing fee, taken out of every single transaction individually at the time of the sale. (e.g., on a €15 charge, the fee is €0.21 + €0.10 = €0.31).
2. **Terminal "Tap on Mobile" Fee (€0.10)**: Stripe charges an additional flat fee of €0.10 per physical tap/authorization. Instead of taking this out of each transaction, Stripe batches them up and bills you once at the end of the day (e.g., 9 taps = €0.90 billed for that day).
3. **Radar Fraud Fee (€0.05)**: Normally, in-person Tap to Pay transactions do not incur this fee because the physical card is present. However, if a tap fails and you manually type the card number in, or you send the fan a payment link to pay on their own phone, Stripe treats it as an "online" transaction. This triggers their machine-learning fraud protection tool, Radar, which charges a single €0.05 fee per screened transaction.
## Security and Privacy

Tap to Pay uses the built-in features of your smartphone to keep your business and your customers' data private and secure. 
* **Encrypted Transactions:** All transactions are encrypted and processed securely.
* **No Stored Data:** Card numbers are not stored on your device or on merchant servers.

## Accessibility Features

The Tap to Pay PIN entry screen includes built-in accessibility options. This ensures that customers who are blind or have low vision can securely and independently enter their PIN with audio assistance if required. 

## Requirements

**For iPhone:**
* You must have an iPhone XS or later.
* Your device must be running the latest version of iOS.

**For Android:**
* Your device must have NFC enabled.
* **Developer Options must be turned OFF** in your Android Settings. If Developer Options are enabled, Stripe's security protocols will block PIN collection and fail the transaction.

<br />
<small>

[Terms apply.](../98_Terms_of_Service.md#10-apple-disclaimers)

</small>
