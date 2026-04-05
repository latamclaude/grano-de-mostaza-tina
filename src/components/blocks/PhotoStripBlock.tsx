"use client";

/* eslint-disable @next/next/no-img-element */

interface PhotoStripBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function PhotoStripBlock({ data }: PhotoStripBlockProps) {
  const images = (data.images as string[] | undefined) || [];
  const altTexts = (data.altTexts as string[] | undefined) || [];

  if (images.length === 0) return null;

  return (
    <div className="photo-divider">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={altTexts[idx] || ""}
          loading="lazy"
        />
      ))}
    </div>
  );
}
