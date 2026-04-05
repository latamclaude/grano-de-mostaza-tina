import { defineConfig, type Template } from "tinacms";

// ---------------------------------------------------------------------------
// Block templates
// ---------------------------------------------------------------------------

const heroTemplate: Template = {
  name: "hero",
  label: "Hero Banner",
  ui: {
    previewSrc: "/images/yelp-17-sauces-arepas.jpg",
  },
  fields: [
    { name: "headlineEs", label: "Headline (ES)", type: "string", required: true },
    { name: "headlineEn", label: "Headline (EN)", type: "string", required: true },
    { name: "subheadlineEs", label: "Subheadline (ES)", type: "string" },
    { name: "subheadlineEn", label: "Subheadline (EN)", type: "string" },
    { name: "backgroundImage", label: "Background Image", type: "image" },
    { name: "ctaTextEs", label: "CTA Text (ES)", type: "string" },
    { name: "ctaTextEn", label: "CTA Text (EN)", type: "string" },
    { name: "ctaUrl", label: "CTA URL", type: "string" },
  ],
};

const menuCategoryTemplate: Template = {
  name: "menuCategory",
  label: "Menu Category",
  ui: {
    previewSrc: "/images/yelp-13-empanadas-plate.jpg",
    itemProps: (item: Record<string, unknown>) => ({
      label: (item?.nameEn as string) || (item?.nameEs as string) || "Menu Category",
    }),
  },
  fields: [
    { name: "nameEs", label: "Category Name (ES)", type: "string", required: true },
    { name: "nameEn", label: "Category Name (EN)", type: "string", required: true },
    { name: "descriptionEs", label: "Description (ES)", type: "string" },
    { name: "descriptionEn", label: "Description (EN)", type: "string" },
    { name: "hoursNoteEs", label: "Hours Note (ES)", type: "string" },
    { name: "hoursNoteEn", label: "Hours Note (EN)", type: "string" },
    { name: "photo", label: "Category Photo", type: "image" },
    {
      name: "items",
      label: "Menu Items",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: (item?.name as string) || "Menu Item",
        }),
      },
      fields: [
        { name: "name", label: "Item Name", type: "string", required: true },
        { name: "descriptionEs", label: "Description (ES)", type: "string" },
        { name: "descriptionEn", label: "Description (EN)", type: "string" },
        { name: "price", label: "Price", type: "string", required: true },
        { name: "photo", label: "Photo", type: "image" },
        {
          name: "badges",
          label: "Badges",
          type: "string",
          list: true,
        },
      ],
    },
  ],
};

const reviewsTemplate: Template = {
  name: "reviews",
  label: "Customer Reviews",
  ui: {
    previewSrc: "/images/yelp-10-exterior-building.jpg",
  },
  fields: [
    { name: "heading_es", label: "Heading (ES)", type: "string" },
    { name: "heading_en", label: "Heading (EN)", type: "string" },
    {
      name: "reviews",
      label: "Reviews",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: `${(item?.platform as string) || "Review"} — ${((item?.quote as string) || "").slice(0, 40)}…`,
        }),
      },
      fields: [
        { name: "quote", label: "Quote", type: "string", required: true },
        { name: "stars", label: "Stars (1-5)", type: "number", required: true },
        { name: "platform", label: "Platform", type: "string" },
      ],
    },
  ],
};

const aboutTemplate: Template = {
  name: "about",
  label: "About Section",
  ui: {
    previewSrc: "/images/gotowhere-10.jpg",
  },
  fields: [
    { name: "headingEs", label: "Heading (ES)", type: "string" },
    { name: "headingEn", label: "Heading (EN)", type: "string" },
    { name: "textEs", label: "Text (ES)", type: "string", ui: { component: "textarea" } },
    { name: "textEn", label: "Text (EN)", type: "string", ui: { component: "textarea" } },
    {
      name: "photos",
      label: "Photos",
      type: "image",
      list: true,
    },
  ],
};

const contactTemplate: Template = {
  name: "contact",
  label: "Contact Section",
  fields: [
    { name: "headingEs", label: "Heading (ES)", type: "string" },
    { name: "headingEn", label: "Heading (EN)", type: "string" },
    { name: "showMap", label: "Show Map", type: "boolean" },
    { name: "showForm", label: "Show Contact Form", type: "boolean" },
  ],
};

const faqTemplate: Template = {
  name: "faq",
  label: "FAQ Section",
  fields: [
    { name: "headingEs", label: "Heading (ES)", type: "string" },
    { name: "headingEn", label: "Heading (EN)", type: "string" },
    {
      name: "items",
      label: "FAQ Items",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: (item?.questionEn as string) || (item?.questionEs as string) || "FAQ Item",
        }),
      },
      fields: [
        { name: "questionEs", label: "Question (ES)", type: "string", required: true },
        { name: "questionEn", label: "Question (EN)", type: "string", required: true },
        { name: "answerEs", label: "Answer (ES)", type: "string", ui: { component: "textarea" } },
        { name: "answerEn", label: "Answer (EN)", type: "string", ui: { component: "textarea" } },
      ],
    },
  ],
};

const ctaTemplate: Template = {
  name: "cta",
  label: "Call to Action",
  ui: {
    previewSrc: "/images/yelp-07-huge-empanadas.jpg",
  },
  fields: [
    { name: "textEs", label: "Text (ES)", type: "string" },
    { name: "textEn", label: "Text (EN)", type: "string" },
    { name: "buttonTextEs", label: "Button Text (ES)", type: "string" },
    { name: "buttonTextEn", label: "Button Text (EN)", type: "string" },
    { name: "buttonUrl", label: "Button URL", type: "string" },
    { name: "backgroundDark", label: "Dark Background", type: "boolean" },
  ],
};

const cateringTemplate: Template = {
  name: "catering",
  label: "Catering Section",
  fields: [
    { name: "headingEs", label: "Heading (ES)", type: "string" },
    { name: "headingEn", label: "Heading (EN)", type: "string" },
    { name: "descriptionEs", label: "Description (ES)", type: "string" },
    { name: "descriptionEn", label: "Description (EN)", type: "string" },
    {
      name: "packages",
      label: "Catering Packages",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: (item?.nameEn as string) || (item?.nameEs as string) || "Package",
        }),
      },
      fields: [
        { name: "nameEs", label: "Name (ES)", type: "string", required: true },
        { name: "nameEn", label: "Name (EN)", type: "string", required: true },
        { name: "descriptionEs", label: "Description (ES)", type: "string" },
        { name: "descriptionEn", label: "Description (EN)", type: "string" },
        { name: "price", label: "Price", type: "string", required: true },
        { name: "servingSize", label: "Serving Size", type: "string" },
      ],
    },
  ],
};

const ratingBadgesTemplate: Template = {
  name: "ratingBadges",
  label: "Rating Badges",
  fields: [
    {
      name: "style",
      label: "Display Style",
      type: "string",
      options: [
        { value: "marquee", label: "Scrolling Marquee" },
        { value: "static", label: "Static Row" },
      ],
    },
  ],
};

const photoStripTemplate: Template = {
  name: "photoStrip",
  label: "Photo Strip",
  fields: [
    {
      name: "images",
      label: "Images",
      type: "image",
      list: true,
    },
    {
      name: "altTexts",
      label: "Alt Texts",
      type: "string",
      list: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",

  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => {
            if (document._sys.filename === "home") return "/";
            return `/${document._sys.filename}`;
          },
        },
        fields: [
          {
            name: "blocks",
            label: "Page Blocks",
            type: "object",
            list: true,
            ui: {
              visualSelector: true,
            },
            templates: [
              heroTemplate,
              menuCategoryTemplate,
              reviewsTemplate,
              aboutTemplate,
              contactTemplate,
              faqTemplate,
              ctaTemplate,
              cateringTemplate,
              ratingBadgesTemplate,
              photoStripTemplate,
            ],
          },
        ],
      },
      {
        name: "siteConfig",
        label: "Site Configuration",
        path: "content/config",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { name: "restaurantName", label: "Restaurant Name", type: "string", required: true },
          { name: "phone", label: "Phone", type: "string" },
          { name: "address", label: "Address", type: "string" },
          { name: "cloverOrderUrl", label: "Clover Order URL", type: "string" },
          { name: "googleMapsLat", label: "Google Maps Latitude", type: "number" },
          { name: "googleMapsLng", label: "Google Maps Longitude", type: "number" },
          { name: "instagram", label: "Instagram URL", type: "string" },
          { name: "facebook", label: "Facebook URL", type: "string" },
          {
            name: "hours",
            label: "Business Hours",
            type: "object",
            list: true,
            fields: [
              { name: "es", label: "Hours (ES)", type: "string" },
              { name: "en", label: "Hours (EN)", type: "string" },
            ],
          },
          {
            name: "ratings",
            label: "Ratings",
            type: "object",
            fields: [
              {
                name: "google",
                label: "Google",
                type: "object",
                fields: [
                  { name: "score", label: "Score", type: "number" },
                  { name: "count", label: "Review Count", type: "number" },
                ],
              },
              {
                name: "yelp",
                label: "Yelp",
                type: "object",
                fields: [
                  { name: "score", label: "Score", type: "number" },
                  { name: "count", label: "Review Count", type: "number" },
                ],
              },
              {
                name: "menupix",
                label: "MenuPix",
                type: "object",
                fields: [
                  { name: "score", label: "Score", type: "number" },
                  { name: "count", label: "Review Count", type: "number" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
