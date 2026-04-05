import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import siteConfig from "../../../content/config/site.json";
import "../globals.css";

export const metadata: Metadata = {
  title: "Grano De Mostaza — Venezuelan Restaurant, Fort Lauderdale",
  description:
    "Authentic Venezuelan food in Fort Lauderdale. Arepas, empanadas, cachapas, tequenos and more. Order online for pickup.",
};

interface LayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "es";
  const orderLabel = validLocale === "es" ? "Ordena" : "Order";

  return (
    <html lang={validLocale}>
      <body>
        <CartProvider>
          <Header locale={validLocale} />
          {children}
          <Footer locale={validLocale} />
          <a
            href={`/${validLocale}${siteConfig.cloverOrderUrl}`}
            className="order-float"
          >
            {orderLabel}
          </a>
        </CartProvider>
      </body>
    </html>
  );
}
