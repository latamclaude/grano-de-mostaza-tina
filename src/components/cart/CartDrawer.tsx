"use client";

import { useCart } from "./CartContext";

interface CartDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCheckout: () => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`cart-drawer${isOpen ? " cart-drawer--open" : ""}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            Your Order{itemCount > 0 ? ` (${itemCount})` : ""}
          </h2>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.name} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-unit-price">{formatPrice(item.price)} each</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-qty-row">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        -
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-total">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.name)}
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-amount">{formatPrice(getTotal())}</span>
            </div>
            <button className="btn btn-primary cart-checkout-btn" onClick={onCheckout}>
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
