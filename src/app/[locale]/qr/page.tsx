import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import QrCardActions from "@/features/marketing/components/QrCardActions";
import QrCopyField from "@/features/marketing/components/QrCopyField";
import { DEFAULT_LOCALE, isValidLocale, localizedPath, type Locale } from "@/lib/locale";
import { getSiteBaseUrl } from "@/lib/site-url";
import { studioReviewUrl } from "@/config/studio";

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "Studio QR codes",
  description: "QR codes for the studio: booking link and Google review link.",
  robots: { index: false, follow: false },
};

interface QrCard {
  slug: "website" | "reviews";
  title: string;
  description: string;
  url: string;
}

export default async function QrCodesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const siteBaseUrl = getSiteBaseUrl() || "https://www.lextattoo.com";

  const cards: QrCard[] = [
    {
      slug: "website",
      title: "Book your session",
      description: "Points to lextattoo.com so people can book online.",
      url: siteBaseUrl,
    },
    {
      slug: "reviews",
      title: "Leave us a review",
      description: "Opens the Google listing to leave a review in seconds.",
      url: studioReviewUrl(),
    },
  ];

  return (
    <LegalDocumentFrame locale={locale}>
      <div className="w-full max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <Link
            href={localizedPath(locale, "/")}
            className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em] hover:text-brand-black transition-colors w-fit"
          >
            ← Back to home
          </Link>
          <p className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em]">
            [ Studio tools ]
          </p>
          <h1 className="font-display font-black uppercase text-brand-black text-4xl md:text-5xl leading-[0.9] tracking-tighter">
            QR codes.
          </h1>
          <p className="font-body text-brand-black/70 text-sm max-w-md">
            Download for stickers, cards, or the front desk. PNG for digital and
            small prints, PDF for a ready-to-print A4 poster. Copy the link to
            share it anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="flex flex-col gap-4 border-2 border-brand-black p-6 bg-white"
            >
              <div className="flex flex-col gap-1">
                <h2 className="font-display font-black uppercase text-brand-black text-xl tracking-tight">
                  {card.title}
                </h2>
                <p className="font-body text-brand-black/60 text-xs">
                  {card.description}
                </p>
              </div>

              <div className="border-2 border-brand-black/10 p-4 w-full aspect-square flex items-center justify-center bg-brand-linen">
                <Image
                  src={`/qr/${card.slug}-qr.png`}
                  alt={`QR code: ${card.title}`}
                  width={384}
                  height={384}
                  className="w-full h-full object-contain"
                />
              </div>

              <QrCopyField url={card.url} />

              <QrCardActions
                pngHref={`/qr/${card.slug}-qr.png`}
                pdfHref={`/qr/${card.slug}-poster.pdf`}
              />
            </div>
          ))}
        </div>
      </div>
    </LegalDocumentFrame>
  );
}
