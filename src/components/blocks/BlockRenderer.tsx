"use client";

import { HeroBlock } from "./HeroBlock";
import { MenuCategoryBlock } from "./MenuCategoryBlock";
import { ReviewsBlock } from "./ReviewsBlock";
import { AboutBlock } from "./AboutBlock";
import { ContactBlock } from "./ContactBlock";
import { FAQBlock } from "./FAQBlock";
import { CTABlock } from "./CTABlock";
import { CateringBlock } from "./CateringBlock";
import { RatingBadgesBlock } from "./RatingBadgesBlock";
import { PhotoStripBlock } from "./PhotoStripBlock";

type Locale = "es" | "en";

interface BlockRendererProps {
  readonly blocks: readonly Record<string, unknown>[];
  readonly locale: Locale;
}

export function BlockRenderer({ blocks, locale }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <main>
      {blocks.map((block, index) => {
        // Support both TinaCMS GraphQL __typename and raw JSON _template
        const typename = (block.__typename as string | undefined) || "";
        const template = (block._template as string | undefined) || "";
        const key = `${typename || template}-${index}`;

        const match = (graphqlName: string, templateName: string) =>
          typename === graphqlName || template === templateName;

        if (match("PagesBlocksHero", "hero"))
          return <HeroBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksMenuCategory", "menuCategory"))
          return <MenuCategoryBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksReviews", "reviews"))
          return <ReviewsBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksAbout", "about"))
          return <AboutBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksContact", "contact"))
          return <ContactBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksFaq", "faq"))
          return <FAQBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksCta", "cta"))
          return <CTABlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksCatering", "catering"))
          return <CateringBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksRatingBadges", "ratingBadges"))
          return <RatingBadgesBlock key={key} data={block} locale={locale} />;
        if (match("PagesBlocksPhotoStrip", "photoStrip"))
          return <PhotoStripBlock key={key} data={block} locale={locale} />;

        return (
          <div key={key} className="p-4 text-center text-sm text-gray-400">
            Unknown block: {typename || template}
          </div>
        );
      })}
    </main>
  );
}
