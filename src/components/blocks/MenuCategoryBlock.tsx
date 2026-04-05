"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

interface MenuCategoryBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

function AddToCartButton({ itemName, price }: { readonly itemName: string; readonly price: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(itemName, price);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <button
      className={`btn-add-to-cart${added ? " btn-add-to-cart--added" : ""}`}
      onClick={handleClick}
      aria-label={`Add ${itemName} to cart`}
    >
      {added ? "Added!" : "Add +"}
    </button>
  );
}

function parsePriceCents(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, "");
  const dollars = parseFloat(cleaned);
  return isNaN(dollars) ? 0 : Math.round(dollars * 100);
}

export function MenuCategoryBlock({ data, locale }: MenuCategoryBlockProps) {
  const name = (locale === "es" ? data.nameEs : data.nameEn) as string | undefined;
  const description = (locale === "es" ? data.descriptionEs : data.descriptionEn) as string | undefined;
  const items = (data.items as Record<string, unknown>[] | undefined) || [];

  return (
    <section className="featured-section section-pad">
      <div className="container">
        {name && (
          <h2 className="section-title">{name}</h2>
        )}
        {description && (
          <p className="section-subtitle">{description}</p>
        )}

        <div className="featured-grid">
          {items.map((item, idx) => {
            const itemName = item.name as string | undefined;
            const itemDesc = (locale === "es" ? item.descriptionEs : item.descriptionEn) as string | undefined;
            const price = item.price as string | undefined;
            const photo = item.photo as string | undefined;
            const badges = (item.badges as string[] | undefined) || [];

            return (
              <div key={idx} className="menu-card">
                {photo && (
                  <img
                    className="menu-card-img"
                    src={photo}
                    alt={itemName || ""}
                    loading="lazy"
                  />
                )}
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    {itemName && <span className="menu-card-name">{itemName}</span>}
                    {price && <span className="menu-card-price">{price}</span>}
                  </div>
                  {itemDesc && <p className="menu-card-desc">{itemDesc}</p>}
                  {badges.map((badge) => (
                    <span key={badge} className="menu-card-badge">{badge}</span>
                  ))}
                  {itemName && price && (
                    <AddToCartButton
                      itemName={itemName}
                      price={parsePriceCents(price)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="view-menu-link">
          <a href={`/${locale}/menu`} className="btn btn-outline">
            {locale === "es" ? "Ver Menu Completo" : "See Full Menu"}
          </a>
        </div>
      </div>
    </section>
  );
}
