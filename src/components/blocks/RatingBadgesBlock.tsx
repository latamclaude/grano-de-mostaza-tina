"use client";

import siteConfig from "../../../content/config/site.json";

interface RatingBadgesBlockProps {
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

function renderStars(score: number): string {
  const full = "\u2605";
  const empty = "\u2606";
  const rounded = Math.round(score);
  return full.repeat(Math.min(rounded, 5)) + empty.repeat(Math.max(0, 5 - rounded));
}

export function RatingBadgesBlock({ data }: RatingBadgesBlockProps) {
  const ratings = siteConfig.ratings;
  void data;

  const badges = [
    { platform: "Google", score: ratings.google.score, count: ratings.google.count },
    { platform: "Yelp", score: ratings.yelp.score, count: ratings.yelp.count },
    { platform: "MenuPix", score: ratings.menupix.score, count: ratings.menupix.count },
  ];

  return (
    <div className="ratings-bar">
      <div className="ratings-inner container">
        {badges.map((badge) => (
          <div key={badge.platform} className="rating-badge">
            <div className="rating-source">{badge.platform}</div>
            <div className="rating-stars">{renderStars(badge.score)}</div>
            <div className="rating-score">{badge.score}</div>
            <div className="rating-count">({badge.count})</div>
          </div>
        ))}
      </div>
    </div>
  );
}
