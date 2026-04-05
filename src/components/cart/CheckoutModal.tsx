"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

export interface CheckoutModalProps {
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  locale: "es" | "en";
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Clover?: new (
      publicKey: string,
      options: { merchantId: string }
    ) => CloverInstance;
  }
}

interface CloverElement {
  mount: (selector: string) => void;
}

interface CloverElements {
  create: (type: string, styles?: Record<string, unknown>) => CloverElement;
}

interface CloverTokenResult {
  token?: string;
  errors?: Record<string, { error?: string; touched?: boolean }>;
}

interface CloverInstance {
  elements: () => CloverElements;
  createToken: () => Promise<CloverTokenResult>;
}

type PaymentState = "idle" | "processing" | "success" | "error";

const IFRAME_STYLES = { input: { fontSize: "16px", color: "#0F172A" } };

const PUBLIC_KEY = process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY || "";
const MERCHANT_ID = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID || "";

export default function CheckoutModal({
  items,
  total,
  locale,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const cloverRef = useRef<CloverInstance | null>(null);
  const mountedRef = useRef(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const totalCents = Math.round(total);

  const initClover = useCallback(() => {
    if (mountedRef.current) return;
    if (!PUBLIC_KEY || !MERCHANT_ID) {
      console.error("Clover env vars missing. PUBLIC_KEY:", !!PUBLIC_KEY, "MERCHANT_ID:", !!MERCHANT_ID);
      return;
    }
    if (!window.Clover) {
      console.error("window.Clover not available after SDK load");
      return;
    }

    mountedRef.current = true;
    console.log("Initializing Clover SDK...");
    const clover = new window.Clover(PUBLIC_KEY, { merchantId: MERCHANT_ID });
    cloverRef.current = clover;

    const elements = clover.elements();
    const cardNumber = elements.create("CARD_NUMBER", IFRAME_STYLES);
    const cardDate = elements.create("CARD_DATE", IFRAME_STYLES);
    const cardCvv = elements.create("CARD_CVV", IFRAME_STYLES);
    const cardPostalCode = elements.create("CARD_POSTAL_CODE", IFRAME_STYLES);

    cardNumber.mount("#card-number");
    cardDate.mount("#card-date");
    cardCvv.mount("#card-cvv");
    cardPostalCode.mount("#card-postal-code");
    console.log("Clover iframes mounted");
  }, []);

  // If SDK was already loaded (cached), init immediately
  useEffect(() => {
    if (window.Clover && !mountedRef.current) {
      initClover();
    }
  }, [initClover]);

  async function handlePay() {
    const clover = cloverRef.current;
    if (!clover) {
      setErrorMessage("Payment form not ready. Please wait and try again.");
      setPaymentState("error");
      return;
    }

    setPaymentState("processing");
    setErrorMessage("");

    let tokenResult: CloverTokenResult;
    try {
      tokenResult = await clover.createToken();
    } catch {
      setErrorMessage("Failed to read card details. Please try again.");
      setPaymentState("error");
      return;
    }

    if (tokenResult.errors) {
      const firstError = Object.values(tokenResult.errors).find(
        (e) => e.error
      );
      setErrorMessage(
        firstError?.error ?? "Please check your card details and try again."
      );
      setPaymentState("error");
      return;
    }

    if (!tokenResult.token) {
      setErrorMessage("Could not tokenize card. Please try again.");
      setPaymentState("error");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenResult.token,
          amount: totalCents,
          items: items.map((i) => ({ name: i.name, price: i.price, qty: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error ?? "Payment failed. Please try again.");
        setPaymentState("error");
        return;
      }

      setPaymentState("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setPaymentState("error");
    }
  }

  return (
    <>
      <Script
        src="https://checkout.sandbox.dev.clover.com/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Clover SDK script loaded");
          initClover();
        }}
        onError={() => {
          console.error("Failed to load Clover SDK script");
        }}
      />

      <div className="checkout-overlay" role="dialog" aria-modal="true" aria-label="Checkout">
        <div className="checkout-card">
          <div className="checkout-demo-banner">
            DEMO MODE — No real charges
          </div>

          <div className="checkout-header">
            <h2 className="checkout-title">Complete Your Order</h2>
            <button
              className="checkout-close"
              onClick={onClose}
              aria-label="Close checkout"
            >
              &#x2715;
            </button>
          </div>

          <div className="checkout-summary">
            <h3 className="checkout-summary-heading">Order Summary</h3>
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={item.name} className="checkout-item">
                  <span className="checkout-item-name">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="checkout-item-price">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>

          {paymentState !== "success" && (
            <div className="checkout-form">
              <h3 className="checkout-form-heading">Payment Details</h3>

              <div className="clover-field-group">
                <label className="clover-label">Card Number</label>
                <div id="card-number" className="clover-field" />
              </div>

              <div className="clover-field-row">
                <div className="clover-field-group">
                  <label className="clover-label">Expiry Date</label>
                  <div id="card-date" className="clover-field" />
                </div>
                <div className="clover-field-group">
                  <label className="clover-label">CVV</label>
                  <div id="card-cvv" className="clover-field" />
                </div>
              </div>

              <div className="clover-field-group">
                <label className="clover-label">ZIP Code</label>
                <div id="card-postal-code" className="clover-field" />
              </div>

              {paymentState === "error" && errorMessage && (
                <div className="checkout-error" role="alert">
                  {errorMessage}
                </div>
              )}

              <button
                className="checkout-pay-btn"
                onClick={handlePay}
                disabled={paymentState === "processing"}
              >
                {paymentState === "processing" ? (
                  <span className="checkout-spinner" aria-hidden="true" />
                ) : (
                  `Pay $${(total / 100).toFixed(2)}`
                )}
              </button>
            </div>
          )}

          {paymentState === "success" && (
            <div className="checkout-success" role="status">
              <div className="checkout-success-icon" aria-hidden="true">
                &#10003;
              </div>
              <p className="checkout-success-message">
                {locale === "es" ? "¡Pedido realizado!" : "Order placed!"}
              </p>
              <p className="checkout-success-sub">
                {locale === "es"
                  ? "Gracias — lo tendremos listo para ti pronto."
                  : "Thank you — we'll have it ready for you shortly."}
              </p>
              <button
                className="btn btn-primary checkout-thank-btn"
                onClick={onSuccess}
              >
                {locale === "es" ? "¡Gracias!" : "Thank You!"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
