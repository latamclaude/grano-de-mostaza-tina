"use client";

import Image from "next/image";

interface MenuItem {
  readonly name?: string;
  readonly descriptionEs?: string;
  readonly descriptionEn?: string;
  readonly price?: string;
  readonly photo?: string;
  readonly badges?: readonly string[];
}

interface MenuItemCardProps {
  readonly item: MenuItem;
  readonly locale: "es" | "en";
}

export function MenuItemCard({ item, locale }: MenuItemCardProps) {
  const description = locale === "es" ? item.descriptionEs : item.descriptionEn;

  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {item.photo && (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
          <Image
            src={item.photo}
            alt={item.name || ""}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-heading text-lg font-semibold text-dark">
              {item.name}
            </h4>
            <span className="shrink-0 font-body text-lg font-bold text-brand-primary">
              {item.price}
            </span>
          </div>

          {description && (
            <p className="mt-1 text-sm leading-relaxed text-dark-light/70">
              {description}
            </p>
          )}
        </div>

        {item.badges && item.badges.length > 0 && (
          <div className="mt-2 flex gap-2">
            {item.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-gold-light/20 px-2.5 py-0.5 text-xs font-semibold text-gold"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
