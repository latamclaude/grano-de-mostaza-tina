"use client";

/* eslint-disable @next/next/no-img-element */

interface AboutBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function AboutBlock({ data, locale }: AboutBlockProps) {
  const heading = (locale === "es" ? data.headingEs : data.headingEn) as string | undefined;
  const text = (locale === "es" ? data.textEs : data.textEn) as string | undefined;
  const photos = (data.photos as string[] | undefined) || [];
  const eyebrow = locale === "es" ? "Nuestra Historia" : "Our Story";
  const ctaLabel = locale === "es" ? "Conoce Nuestra Historia" : "Learn Our Story";
  const firstPhoto = photos[0] || "/images/placeholder-family-cooking.jpg";

  return (
    <section className="about-section section-pad">
      <div className="container">
        <div className="about-grid">
          <img
            className="about-img"
            src={firstPhoto}
            alt={heading || "About us"}
            loading="lazy"
          />
          <div>
            <p className="about-eyebrow">{eyebrow}</p>
            {heading && <h2 className="about-title">{heading}</h2>}
            {text && <p className="about-text">{text}</p>}
            <a href={`/${locale}/about`} className="btn btn-outline">
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
