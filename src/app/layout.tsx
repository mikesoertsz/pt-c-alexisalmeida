import type { Metadata } from "next";
import { Archivo_Black, Inter, IBM_Plex_Mono } from "next/font/google";
import { DEFAULT_LOCALE, isValidLocale, type Locale } from "@/lib/locale";
import { getSiteBaseUrl } from "@/lib/site-url";
import { GoogleConsentMode } from "@/components/consent/GoogleConsentMode";
import { GoogleTagsInit } from "@/components/google/GoogleTagsInit";
import "@/styles/globals.css";

const archivo = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteBaseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  metadataBase: siteBaseUrl !== "" ? new URL(siteBaseUrl) : undefined,
  title: {
    default: "Lex Almeida, Custom Tattoo Artist, Porto",
    template: "%s · Lex Almeida",
  },
  description:
    "Collector-grade fine line, blackwork and dark art. 11 years experience. Custom work only. Porto, Portugal.",
  verification: {
    google: "s5LqZOTwqJ_1cPQxXjDUPJ16zrMZWcIocUdJFHLro-k",
  },
};

async function localeFromHeaders(): Promise<Locale> {
  const { headers } = await import("next/headers");
  const hdrs = await headers();
  const raw = hdrs.get("x-locale");
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await localeFromHeaders();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${ibmPlexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-linen text-brand-black">
        <GoogleConsentMode />
        <GoogleTagsInit />
        {children}
      </body>
    </html>
  );
}
