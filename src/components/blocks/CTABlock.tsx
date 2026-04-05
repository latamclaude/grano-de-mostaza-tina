"use client";

interface CTABlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function CTABlock({ data, locale }: CTABlockProps) {
  const text = (locale === "es" ? data.textEs : data.textEn) as string | undefined;
  const buttonText = (locale === "es" ? data.buttonTextEs : data.buttonTextEn) as string | undefined;
  const rawButtonUrl = data.buttonUrl as string | undefined;
  const buttonUrl = rawButtonUrl?.startsWith("/") ? `/${locale}${rawButtonUrl}` : rawButtonUrl;
  const backgroundDark = data.backgroundDark as boolean | undefined;

  if (backgroundDark) {
    return (
      <section className="cta-banner">
        <div className="container">
          {text && <h2 className="cta-banner-title">{text}</h2>}
          {buttonText && buttonUrl && (
            <a
              href={buttonUrl}
              target={buttonUrl.startsWith("http") ? "_blank" : undefined}
              rel={buttonUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="btn btn-light"
            >
              {buttonText}
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="cta-banner" style={{ background: "var(--cream-dark)" }}>
      <div className="container">
        {text && (
          <h2 className="cta-banner-title" style={{ color: "var(--text-primary)" }}>
            {text}
          </h2>
        )}
        {buttonText && buttonUrl && (
          <a
            href={buttonUrl}
            target={buttonUrl.startsWith("http") ? "_blank" : undefined}
            rel={buttonUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="btn btn-primary"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
