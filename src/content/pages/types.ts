export const SERVICE_PAGE_KEYS = [
  "fine-line",
  "blackwork",
  "dark-art",
  "small-tattoos",
  "prices",
  "studio",
] as const;

export type ServicePageKey = (typeof SERVICE_PAGE_KEYS)[number];

/**
 * Slugs are shared across locales on purpose.
 * The locale proxy redirects a non-English visitor from /{path} to /{locale}/{path},
 * so a translated slug would 404 on that redirect.
 */
export const SERVICE_PAGE_SLUGS: Record<ServicePageKey, string> = {
  "fine-line": "fine-line-tattoo-porto",
  blackwork: "blackwork-tattoo-porto",
  "dark-art": "dark-art-tattoo-porto",
  "small-tattoos": "small-tattoos-porto",
  prices: "tattoo-prices-porto",
  studio: "tattoo-studio-porto",
};

export function servicePagePath(key: ServicePageKey): string {
  return `/${SERVICE_PAGE_SLUGS[key]}`;
}

export function servicePageKeyFromSlug(slug: string): ServicePageKey | undefined {
  return SERVICE_PAGE_KEYS.find((key) => SERVICE_PAGE_SLUGS[key] === slug);
}

export interface ServicePageImage {
  src: string;
  alt: string;
}

export interface ServicePageSection {
  heading: string;
  body: readonly string[];
}

export interface ServicePageHighlight {
  label: string;
  value: string;
}

export interface ServicePageFaqItem {
  q: string;
  a: string;
}

export interface ServicePage {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  preheading: string;
  h1: string;
  lead: string;
  sections: readonly ServicePageSection[];
  highlights: readonly ServicePageHighlight[];
  gallery: readonly ServicePageImage[];
  faq: readonly ServicePageFaqItem[];
  cta: { heading: string; body: string; button: string };
  related: readonly ServicePageKey[];
}

export interface ServicePagesChrome {
  breadcrumbLabel: string;
  breadcrumbHome: string;
  galleryHeading: string;
  faqHeading: string;
  relatedHeading: string;
  highlightsLabel: string;
  homeLinksLabel: string;
  homeLinksHeading: string;
}

export interface ServicePagesBundle {
  chrome: ServicePagesChrome;
  pages: Record<ServicePageKey, ServicePage>;
}

/** Real starting prices from the studio pricing tiers, identical in every locale. */
export const SERVICE_PAGE_PRICE_FROM: Partial<Record<ServicePageKey, number>> = {
  "fine-line": 120,
  blackwork: 250,
  "dark-art": 250,
  "small-tattoos": 120,
  prices: 120,
};
