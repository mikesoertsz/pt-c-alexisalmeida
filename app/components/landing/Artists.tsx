"use client";

import Image from "next/image";
import { Wrapper, InnerWrap } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

interface Props {
  slice: ContentSchema["artists"];
}

export function Artists({ slice }: Props) {
  const [featured, ...rest] = slice.items;
  const guests = rest;

  return (
    <Wrapper id="artists" className="bg-blush/20 scroll-mt-16 py-24 md:py-32">
      <InnerWrap className="items-stretch px-4 md:px-6 max-w-5xl">
        <TitleBlock
          orientation="left"
          preheading={slice.preheading}
          heading={slice.heading}
        />

        {guests.length > 0 ? (
          <div className="mt-14 md:mt-16 w-full grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
            <div className="lg:col-span-8">
              <FeaturedArtist artist={featured} />
            </div>
            <aside className="lg:col-span-4 lg:border-l lg:border-sage/35 lg:pl-10 flex flex-col gap-12">
              {guests.map((artist) => (
                <GuestArtistCompact key={artist.name} artist={artist} />
              ))}
            </aside>
          </div>
        ) : (
          <div className="mt-14 w-full">
            <FeaturedArtist artist={featured} />
          </div>
        )}
      </InnerWrap>
    </Wrapper>
  );
}

function FeaturedArtist({ artist }: { artist: ContentSchema["artists"]["items"][number] }) {
  const imageSrc = useStyleMedia(artist.image);
  return (
    <article className="flex flex-col md:flex-row gap-8 md:gap-10">
      <div className="relative aspect-[3/4] md:w-[62%] md:shrink-0 bg-mist overflow-hidden md:max-h-[min(32rem,70vh)]">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={artist.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 38vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0 md:flex-1 py-2">
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
          {artist.name}
        </h3>
        <p className="text-sm text-terracotta mt-1.5">{artist.role}</p>
        <p className="text-[0.65rem] text-ink/75 mt-2 uppercase tracking-[0.18em]">{artist.specialty}</p>
        <p className="text-sm text-ink/88 mt-5 leading-relaxed">{artist.bio}</p>
        {artist.instagram ? <InstagramLink handle={artist.instagram} className="mt-6" /> : null}
      </div>
    </article>
  );
}

function GuestArtistCompact({ artist }: { artist: ContentSchema["artists"]["items"][number] }) {
  const imageSrc = useStyleMedia(artist.image);
  return (
    <article className="flex flex-col gap-4">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/60">Guest</p>
      <div className="relative aspect-[4/5] w-full max-w-[14rem] bg-mist overflow-hidden">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={artist.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 200px, 50vw"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-ink">{artist.name}</h3>
        <p className="text-xs text-terracotta mt-0.5">{artist.role}</p>
        <p className="text-xs text-ink/80 mt-3 leading-relaxed line-clamp-4 md:line-clamp-none">{artist.bio}</p>
        {artist.instagram ? <InstagramLink handle={artist.instagram} className="mt-4 text-xs" /> : null}
      </div>
    </article>
  );
}

function InstagramLink({ handle, className = "" }: { handle: string; className?: string }) {
  return (
    <a
      href={`https://instagram.com/${handle.replace("@", "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-terracotta hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta/50 ${className}`}
    >
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      {handle}
    </a>
  );
}
