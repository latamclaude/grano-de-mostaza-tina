"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { CartIcon } from "./cart/CartIcon";
import { CartDrawer } from "./cart/CartDrawer";
import CheckoutModal from "./cart/CheckoutModal";
import { useCart } from "./cart/CartContext";

interface HeaderProps {
  readonly locale: "es" | "en";
}

const NAV_ITEMS = [
  { es: "Inicio", en: "Home", href: "" },
  { es: "Menu", en: "Menu", href: "menu" },
  { es: "Nosotros", en: "About", href: "about" },
  { es: "Catering", en: "Catering", href: "catering" },
  { es: "FAQ", en: "FAQ", href: "faq" },
  { es: "Contacto", en: "Contact", href: "contact" },
];

export function Header({ locale }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { items, getTotal, clearCart } = useCart();

  function handleCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function handleCheckoutSuccess() {
    clearCart();
    setCheckoutOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="nav-inner">
        <Link href={`/${locale}`} className="nav-logo">
          Grano <span>De</span> Mostaza
        </Link>

        <button
          className="mobile-toggle"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-links${mobileOpen ? " open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}/${item.href}`}
              onClick={() => setMobileOpen(false)}
            >
              {locale === "es" ? item.es : item.en}
            </Link>
          ))}
          <LanguageToggle locale={locale} />
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>
      </nav>
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
      {checkoutOpen && (
        <CheckoutModal
          items={items}
          total={getTotal()}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </header>
  );
}
