import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageLanding } from "@/features/marketing/components/ServicePageLanding";
import type { Locale } from "@/lib/locale";
import { DEFAULT_LOCALE, isValidLocale, localizedPath } from "@/lib/locale";
import { getContent } from "@/content/get-content";
import { getServicePages } from "@/content/pages/get-service-pages";
import { servicePageKeyFromSlug, servicePagePath } from "@/content/pages/types";
import { absoluteUrl } from "@/lib/site-url";
import { ogImagePath } from "@/config/branding";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function baseUrlNormalized(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const trimmed = raw.trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const key = servicePageKeyFromSlug(slug);
  if (key === undefined) return {};

  const page = getServicePages(locale).pages[key];
  const baseUrl = baseUrlNormalized();
  const path = servicePagePath(key);

  const rel = (loc: Locale) => localizedPath(loc, path);
  const href = (loc: Locale) => (baseUrl === "" ? rel(loc) : `${baseUrl}${rel(loc)}`);

  const ogPath = ogImagePath();
  const ogImageAbsolute = baseUrl !== "" ? absoluteUrl(ogPath) : undefined;

  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: {
      canonical: href(locale),
      languages: {
        en: href("en"),
        pt: href("pt"),
        de: href("de"),
        "x-default": href("en"),
      },
    },
    openGraph: {
      type: "article",
      title: page.metaTitle,
      description: page.metaDescription,
      locale: locale === "en" ? "en_GB" : locale === "pt" ? "pt_PT" : "de_DE",
      alternateLocale:
        locale === "en" ? ["pt_PT", "de_DE"] : locale === "pt" ? ["en_GB", "de_DE"] : ["en_GB", "pt_PT"],
      url: baseUrl === "" ? undefined : href(locale),
      images: ogImageAbsolute
        ? [{ url: ogImageAbsolute }]
        : [{ url: ogPath.startsWith("/") ? ogPath : `/${ogPath}` }],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const pageKey = servicePageKeyFromSlug(slug);

  if (pageKey === undefined) {
    notFound();
  }

  return (
    <ServicePageLanding
      locale={locale}
      content={getContent(locale)}
      bundle={getServicePages(locale)}
      pageKey={pageKey}
    />
  );
}
