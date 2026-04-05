"use client";

import Script from "next/script";

export default function CloverSDK() {
  return (
    <Script
      src="https://checkout.sandbox.dev.clover.com/sdk.js"
      strategy="afterInteractive"
    />
  );
}
