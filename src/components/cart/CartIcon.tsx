"use client";

import { useCart } from "./CartContext";

interface CartIconProps {
  readonly onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <button className="cart-icon-btn" onClick={onClick} aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}>
      <svg
        className="cart-icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="cart-badge" aria-hidden="true">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
