# Clover eCommerce Integration Spec

> Sourced from official Clover docs (2026-04-04). North America / US region.

---

## 1. SDK Loading

The Clover iframe SDK is a JavaScript library loaded via `<script>` tag in `<head>`.

```html
<!-- Sandbox -->
<script src="https://checkout.sandbox.dev.clover.com/sdk.js"></script>

<!-- Production -->
<script src="https://checkout.clover.com/sdk.js"></script>
```

**Security note:** Do NOT load `cdn.polyfill.io` alongside this SDK (supply-chain compromise risk per Clover announcement).

---

## 2. Tokenization Flow (Client-Side)

Card data never touches your server. The iframe handles PCI-scoped card input and returns a `clv_` token.

### Step 1: Initialize the SDK

```javascript
// publicApiKey = CLOVER_ECOMM_PUBLIC_KEY env var
// merchantId   = CLOVER_MERCHANT_ID env var
const clover = new Clover(publicApiKey, {
  merchantId: merchantId
});
const elements = clover.elements();
```

### Step 2: Mount iframe card fields

```javascript
const styles = { input: { fontSize: '16px' } };

const cardNumber     = elements.create('CARD_NUMBER', styles);
const cardDate       = elements.create('CARD_DATE', styles);
const cardCvv        = elements.create('CARD_CVV', styles);
const cardPostalCode = elements.create('CARD_POSTAL_CODE', styles);

cardNumber.mount('#card-number');
cardDate.mount('#card-date');
cardCvv.mount('#card-cvv');
cardPostalCode.mount('#card-postal-code');
```

Supported element types: `CARD_NUMBER`, `CARD_DATE`, `CARD_CVV`, `CARD_POSTAL_CODE`, `CARD_NAME`, `CARD_STREET_ADDRESS`, `PAYMENT_REQUEST_BUTTON`

### Step 3: Tokenize on form submit

```javascript
form.addEventListener('submit', function(event) {
  event.preventDefault();
  clover.createToken().then(function(result) {
    if (result.errors) {
      // Display validation errors to user
      Object.values(result.errors).forEach(msg => showError(msg));
    } else {
      // Send token to server — never log or store it
      submitTokenToServer(result.token); // token looks like: clv_1TST39I92...
    }
  });
});
```

Token response shape:
```json
{ "token": "clv_1TST39I92..." }
```

---

## 3. Charge Creation Flow (Server-Side)

The token is single-use. Send it to your Next.js API route, which calls Clover server-to-server.

### Endpoint

```
POST https://scl-sandbox.dev.clover.com/v1/charges    (sandbox)
POST https://scl.clover.com/v1/charges                (production)
```

### Required headers

```
Authorization: Bearer {CLOVER_ECOMM_PRIVATE_KEY}
Content-Type: application/json
idempotency-key: {uuid4}          ← prevents double charges on retry
x-forwarded-for: {client_ip}
```

### Required body fields

```json
{
  "amount": 1500,       // cents — $15.00
  "currency": "usd",
  "source": "clv_1TST39I92...",   // token from client
  "ecomind": "ecom"               // customer-entered card
}
```

### Optional but recommended

```json
{
  "description": "Grano de Mostaza order #123",
  "receipt_email": "customer@example.com"
}
```

### Successful response (200)

```json
{
  "id": "ABDFEFG1HIJK2",
  "amount": 1500,
  "currency": "usd",
  "paid": true,
  "status": "succeeded",
  "captured": true,
  "outcome": {
    "network_status": "approved_by_network",
    "type": "authorized"
  },
  "source": {
    "id": "clv_1ABCDefg...",
    "brand": "VISA",
    "last4": "1111"
  }
}
```

### Next.js App Router API route pattern

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token, amount, orderDescription } = await req.json();

  if (!token || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const idempotencyKey = crypto.randomUUID();
  const clientIp = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  const res = await fetch(`${process.env.CLOVER_SCL_BASE_URL}/v1/charges`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOVER_ECOMM_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
      'idempotency-key': idempotencyKey,
      'x-forwarded-for': clientIp,
    },
    body: JSON.stringify({
      amount,              // in cents
      currency: 'usd',
      source: token,
      ecomind: 'ecom',
      description: orderDescription,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? 'Charge failed' }, { status: res.status });
  }

  return NextResponse.json({ chargeId: data.id, status: data.status });
}
```

---

## 4. Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLOVER_PUBLIC_KEY=<ecomm public token from Clover dashboard>
NEXT_PUBLIC_CLOVER_MERCHANT_ID=SCWWKY7WAPHF1

CLOVER_ECOMM_PRIVATE_KEY=<ecomm private token — NEVER expose to client>
CLOVER_SCL_BASE_URL=https://scl-sandbox.dev.clover.com   # swap to scl.clover.com in prod
```

**Important:** `NEXT_PUBLIC_*` vars are embedded in the client bundle at build time. Only the public key should have the `NEXT_PUBLIC_` prefix. The private key must be server-only (no `NEXT_PUBLIC_` prefix).

---

## 5. API Base URLs Summary

| Service              | Sandbox                               | Production              |
|----------------------|---------------------------------------|-------------------------|
| REST API             | `https://apisandbox.dev.clover.com`   | `https://api.clover.com` |
| Tokenization (token) | `https://token-sandbox.dev.clover.com`| `https://token.clover.com` |
| Ecommerce / Charges  | `https://scl-sandbox.dev.clover.com`  | `https://scl.clover.com` |
| iframe SDK           | `https://checkout.sandbox.dev.clover.com/sdk.js` | `https://checkout.clover.com/sdk.js` |

---

## 6. Sandbox Test Card Numbers

From [Clover test cards doc](https://docs.clover.com/dev/docs/test-card-numbers):

| Card Type | Number           | CVV | Expiry    | Result   |
|-----------|------------------|-----|-----------|----------|
| Visa      | 4005 5717 0222 2222 | 123 | Any future | Approved |
| Visa      | 4005 5717 0222 2230 | 123 | Any future | Declined |
| Mastercard| 5445 3200 0000 0007 | 123 | Any future | Approved |
| Discover  | 6011 3600 0000 0006 | 123 | Any future | Approved |
| Amex      | 3714 4963 5398 431  | 1234| Any future | Approved |

> Note: These card numbers are for sandbox only. The card tokenization flow (via the iframe) still applies — you still mount the iframe, enter these numbers in the iframe fields, call `clover.createToken()`, then POST the token to `/v1/charges`.

---

## 7. Validation Error Shape (from iframe)

```json
{
  "CARD_NUMBER":     { "error": "Card number is invalid.", "touched": true },
  "CARD_DATE":       { "error": "Card expiry is invalid.", "touched": true },
  "CARD_CVV":        { "touched": true },
  "CARD_POSTAL_CODE":{ "touched": false }
}
```

`error` is only present when there is a validation failure. `touched` indicates the field was interacted with.

---

## 8. Integration Architecture for Next.js (App Router)

```
Browser (Client Component)
  └── loads sdk.js from checkout.sandbox.dev.clover.com
  └── mounts <CloverPaymentForm> with NEXT_PUBLIC_CLOVER_PUBLIC_KEY
  └── on submit: clover.createToken() → receives clv_ token
  └── POST /api/checkout { token, amount, orderDescription }

Server (API Route — app/api/checkout/route.ts)
  └── reads CLOVER_ECOMM_PRIVATE_KEY (server-only)
  └── POST scl-sandbox.dev.clover.com/v1/charges
  └── returns { chargeId, status } to client
```

Key constraint: the `<script src="sdk.js">` must load in the browser, not in a Server Component. The payment form component must be a Client Component (`'use client'`).

---

## 9. Idempotency Key

An `idempotency-key` UUID is **required** on the `/v1/charges` request to prevent duplicate charges on network retries. Generate a new UUID per checkout attempt using `crypto.randomUUID()` (available in Node 18+).

---

*Researched from official Clover developer docs. Sandbox credentials: Merchant ID = SCWWKY7WAPHF1.*
