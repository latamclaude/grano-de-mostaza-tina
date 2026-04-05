"use client";

import { useState } from "react";

interface FAQBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function FAQBlock({ data, locale }: FAQBlockProps) {
  const heading = (locale === "es" ? data.headingEs : data.headingEn) as string | undefined;
  const items = (data.items as Record<string, unknown>[] | undefined) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section section-pad">
      <div className="container" style={{ maxWidth: "800px" }}>
        {heading && (
          <h2 className="section-title">{heading}</h2>
        )}

        <div style={{ marginTop: "48px" }}>
          {items.map((item, idx) => {
            const question = (locale === "es" ? item.questionEs : item.questionEn) as string | undefined;
            const answer = (locale === "es" ? item.answerEs : item.answerEn) as string | undefined;
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{question || ""}</span>
                  <svg
                    className={isOpen ? "open" : ""}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    {answer || ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
