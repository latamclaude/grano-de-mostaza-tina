"use client";

interface ReviewsBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

function renderStars(count: number): string {
  const full = "\u2605";
  const empty = "\u2606";
  return full.repeat(Math.min(count, 5)) + empty.repeat(Math.max(0, 5 - count));
}

export function ReviewsBlock({ data, locale }: ReviewsBlockProps) {
  const heading = (locale === "es" ? data.heading_es : data.heading_en) as string | undefined;
  const reviews = (data.reviews as Record<string, unknown>[] | undefined) || [];
  const eyebrow = locale === "es" ? "Lo Que Dicen Nuestros Clientes" : "What Our Customers Say";
  const title = locale === "es" ? "Resenas" : "Reviews";

  return (
    <section className="reviews-section section-pad">
      <div className="container">
        <p className="section-eyebrow section-eyebrow--light">{heading || eyebrow}</p>
        <h2 className="reviews-title">{title}</h2>
        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">
                {renderStars((review.stars as number) || 5)}
              </div>
              <p className="review-text">
                {review.quote as string}
              </p>
              <span className="review-source">{review.platform as string}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
