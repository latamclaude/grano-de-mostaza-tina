"use client";

interface OrderButtonProps {
  readonly locale: "es" | "en";
  readonly className?: string;
}

export function OrderButton({ locale, className = "" }: OrderButtonProps) {
  const text = locale === "es" ? "Ordena Ahora" : "Order Now";
  const menuUrl = `/${locale}/menu`;

  return (
    <a
      href={menuUrl}
      className={`inline-block rounded-lg bg-brand-primary px-5 py-2.5 font-semibold text-white shadow transition-colors hover:bg-brand-primary-light ${className}`}
    >
      {text}
    </a>
  );
}
