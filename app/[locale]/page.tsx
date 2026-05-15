import type { Metadata } from "next";
import ComingSoon from "@/app/components/landing/ComingSoon";
import HomeLanding from "@/app/components/landing/HomeLanding";
import type { Locale } from "@/app/lib/locale";
import { DEFAULT_LOCALE, isValidLocale } from "@/app/lib/locale";
import { shouldShowHomepageComingSoon } from "@/app/lib/vercel-env";
import { getContent } from "@/app/content";

export const revalidate = 3600;

function baseUrlNormalized(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const trimmed = raw.trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const content = getContent(locale);
  const baseUrl = baseUrlNormalized();
  const comingSoonActive = shouldShowHomepageComingSoon();

  const metaTitle = comingSoonActive ? content.comingSoon.title : content.meta.title;
  const metaDescription = comingSoonActive ? content.comingSoon.description : content.meta.description;

  const canonicalPath = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
  const abs = baseUrl === "" ? undefined : `${baseUrl}${canonicalPath === "/" ? "" : canonicalPath}`;

  const href = (suffix: string) =>
    suffix === "/" ? `${baseUrl}/` : `${baseUrl}${suffix}`;
  const rel = (suffix: string) => (suffix === "/" ? "/" : suffix);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates:
      baseUrl !== ""
        ? {
            canonical: abs,
            languages: {
              en: href("/"),
              pt: href("/pt"),
              de: href("/de"),
              "x-default": href("/"),
            },
          }
        : {
            canonical: canonicalPath,
            languages: {
              en: rel("/"),
              pt: rel("/pt"),
              de: rel("/de"),
              "x-default": rel("/"),
            },
          },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      locale: locale === "en" ? "en_GB" : locale === "pt" ? "pt_PT" : "de_DE",
      alternateLocale:
        locale === "en" ? ["pt_PT", "de_DE"] : locale === "pt" ? ["en_GB", "de_DE"] : ["en_GB", "pt_PT"],
      url:
        baseUrl === ""
          ? undefined
          : `${baseUrl}${locale === DEFAULT_LOCALE ? "/" : `/${locale}`}`,
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const content = getContent(locale);

  if (shouldShowHomepageComingSoon()) {
    return <ComingSoon locale={locale} content={content} />;
  }

  return <HomeLanding locale={locale} content={content} />;
}
