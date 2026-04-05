"use client";

import siteConfig from "../../../content/config/site.json";

interface HeroBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function HeroBlock({ data, locale }: HeroBlockProps) {
  const headline = (locale === "es" ? data.headlineEs : data.headlineEn) as string | undefined;
  const subheadline = (locale === "es" ? data.subheadlineEs : data.subheadlineEn) as string | undefined;
  const ctaText = (locale === "es" ? data.ctaTextEs : data.ctaTextEn) as string | undefined;
  const rawCtaUrl = (data.ctaUrl as string | undefined) || siteConfig.cloverOrderUrl;
  // Prefix locale for internal links (starting with /)
  const ctaUrl = rawCtaUrl.startsWith("/") ? `/${locale}${rawCtaUrl}` : rawCtaUrl;
  const bgImage = data.backgroundImage as string | undefined;
  const eyebrow = "Fort Lauderdale, Florida";
  const menuLabel = locale === "es" ? "Ver Menu" : "View Menu";

  return (
    <section className="hero">
      {bgImage && (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow">{eyebrow}</p>
        {headline && <h1 className="hero-title">{headline}</h1>}
        {subheadline && <p className="hero-subtitle">{subheadline}</p>}
        <div className="hero-cta">
          {ctaText && ctaUrl && (
            <a
              href={ctaUrl}
              className="btn btn-primary"
            >
              {ctaText}
            </a>
          )}
          <a
            href={`/${locale}/menu`}
            className="btn btn-outline"
            style={{ borderColor: "var(--cream)", color: "var(--cream)" }}
          >
            {menuLabel}
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
