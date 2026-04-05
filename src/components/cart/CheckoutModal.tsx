"use client";

import { useEffect, useRef, useState } from "react";
import CloverSDK from "./CloverSDK";

export interface CheckoutModalProps {
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
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

export default function CheckoutModal({
  items,
  total,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const cloverRef = useRef<CloverInstance | null>(null);
  const mountedRef = useRef(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sdkReady, setSdkReady] = useState(false);

  const totalCents = Math.round(total);

  // Initialize Clover SDK and mount iframe elements once SDK script loads
  useEffect(() => {
    if (!sdkReady || mountedRef.current) return;

    const publicKey = process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY;
    const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID;

    if (!publicKey || !merchantId || !window.Clover) return;

    mountedRef.current = true;
    const clover = new window.Clover(publicKey, { merchantId });
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
  }, [sdkReady]);

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
    } catch (err: unknown) {
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
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setPaymentState("error");
    }
  }

  return (
    <>
      <CloverSDK />
      {/* Inject a global handler so we know when the SDK script is ready */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function poll() {
              if (window.Clover) {
                document.dispatchEvent(new Event('clover-sdk-ready'));
              } else {
                setTimeout(poll, 100);
              }
            })();
          `,
        }}
      />
      {/* Listen for SDK ready event */}
      <SdkReadyListener onReady={() => setSdkReady(true)} />

      <div className="checkout-overlay" role="dialog" aria-modal="true" aria-label="Checkout">
        <div className="checkout-card">
          {/* Demo banner */}
          <div className="checkout-demo-banner">
            DEMO MODE — No real charges
          </div>

          {/* Header */}
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

          {/* Order summary */}
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

          {/* Payment form */}
          {paymentState !== "success" && (
            <div className="checkout-form">
              <h3 className="checkout-form-heading">Payment Details</h3>

              <div className="clover-field-group">
                <label className="clover-label" htmlFor="card-number">
                  Card Number
                </label>
                <div id="card-number" className="clover-field" />
              </div>

              <div className="clover-field-row">
                <div className="clover-field-group">
                  <label className="clover-label" htmlFor="card-date">
                    Expiry Date
                  </label>
                  <div id="card-date" className="clover-field" />
                </div>
                <div className="clover-field-group">
                  <label className="clover-label" htmlFor="card-cvv">
                    CVV
                  </label>
                  <div id="card-cvv" className="clover-field" />
                </div>
              </div>

              <div className="clover-field-group">
                <label className="clover-label" htmlFor="card-postal-code">
                  ZIP Code
                </label>
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

          {/* Success state */}
          {paymentState === "success" && (
            <div className="checkout-success" role="status">
              <div className="checkout-success-icon" aria-hidden="true">
                &#10003;
              </div>
              <p className="checkout-success-message">Order placed!</p>
              <p className="checkout-success-sub">
                Thank you — we&apos;ll have it ready for you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Small helper to listen for SDK ready event without adding state to the parent
function SdkReadyListener({ onReady }: { readonly onReady: () => void }) {
  useEffect(() => {
    function handler() {
      onReady();
    }
    document.addEventListener("clover-sdk-ready", handler, { once: true });
    return () => {
      document.removeEventListener("clover-sdk-ready", handler);
    };
  }, [onReady]);

  return null;
}
