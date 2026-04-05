"use client";

interface CateringBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function CateringBlock({ data, locale }: CateringBlockProps) {
  const heading = (locale === "es" ? data.headingEs : data.headingEn) as string | undefined;
  const description = (locale === "es" ? data.descriptionEs : data.descriptionEn) as string | undefined;
  const packages = (data.packages as Record<string, unknown>[] | undefined) || [];

  return (
    <section className="catering-section section-pad">
      <div className="container">
        {heading && (
          <h2 className="section-title" style={{ color: "var(--cream)" }}>
            {heading}
          </h2>
        )}
        {description && (
          <p className="section-subtitle" style={{ color: "var(--venezuelan-gold)" }}>
            {description}
          </p>
        )}

        <div className="catering-grid">
          {packages.map((pkg, idx) => {
            const name = (locale === "es" ? pkg.nameEs : pkg.nameEn) as string | undefined;
            const desc = (locale === "es" ? pkg.descriptionEs : pkg.descriptionEn) as string | undefined;
            const price = pkg.price as string | undefined;
            const serving = pkg.servingSize as string | undefined;

            return (
              <div key={idx} className="combo-card">
                {name && <h3 className="combo-card-name">{name}</h3>}
                {desc && <p className="combo-card-desc">{desc}</p>}
                {price && <div className="combo-card-price">{price}</div>}
                {serving && <div className="combo-card-serving">{serving}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
