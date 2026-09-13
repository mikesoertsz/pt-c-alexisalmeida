import type { MetadataRoute } from "next";

function base(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lextattoo.com";
  return raw.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/thank-you", "/pt/thank-you", "/de/thank-you"],
      },
    ],
    sitemap: `${base()}/sitemap.xml`,
  };
}
