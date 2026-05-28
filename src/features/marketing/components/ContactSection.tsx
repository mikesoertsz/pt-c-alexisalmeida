import { TitleBlock } from "@/components/molecules/TitleBlock/TitleBlock";
import { studioMapsEmbedUrl, studioMapsOpenUrl } from "@/config/studio";
import type { ContentSchema } from "@/content/schema";

interface ContactSectionProps {
  slice: ContentSchema["contact"];
}

export function ContactSection({ slice }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="w-full scroll-mt-16 bg-brand-cotton border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
        <div className="max-w-xl lg:shrink-0">
          <TitleBlock
            theme="light"
            orientation="left"
            preheading={`[ ${slice.preheading} ]`}
            heading={slice.heading}
            body={slice.lead}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8 font-body text-sm text-brand-black/70">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-black">
              {slice.addressLabel}
            </p>
            <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-brand-black bg-brand-linen">
              <iframe
                title={slice.mapsPreviewTitle}
                src={studioMapsEmbedUrl()}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={studioMapsOpenUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs uppercase tracking-[0.12em] text-brand-black underline-offset-4 hover:text-brand-tangerine hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
            >
              {slice.openInGoogleMaps}
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-black">{slice.hoursLabel}</p>
            <ul className="mt-2 flex flex-col gap-1 leading-relaxed text-brand-black/80">
              {slice.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
