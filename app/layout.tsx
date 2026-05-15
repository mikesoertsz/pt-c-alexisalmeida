import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { DEFAULT_LOCALE, isValidLocale, type Locale } from "@/app/lib/locale";
import {
  ARTIST_STYLE_COOKIE,
  ARTIST_STYLE_STORAGE_KEY,
} from "@/app/lib/artist-style";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aléxis Lex Almeida — Tattoo Artist",
    template: "%s · Lex Almeida",
  },
  description:
    "Fine art tattooing by Aléxis 'Lex' Almeida. Eleven years of precision work across Portugal and Germany. Premium custom tattoos for discerning clients.",
};

async function localeFromHeaders(): Promise<Locale> {
  const { headers } = await import("next/headers");
  const hdrs = await headers();
  const raw = hdrs.get("x-locale");
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

const artistStyleInitScript = `
(function(){
  try {
    var COOKIE=${JSON.stringify(ARTIST_STYLE_COOKIE)};
    var KEY=${JSON.stringify(ARTIST_STYLE_STORAGE_KEY)};
    var m=document.cookie.match(new RegExp('(?:^|; )'+COOKIE+'=([^;]*)'));
    var cookieVal=m?decodeURIComponent(m[1]):'';
    var stored=null;
    try{stored=localStorage.getItem(KEY);}catch(e){}
    var s='fine-line';
    if(cookieVal==='blackwork'||cookieVal==='fine-line') s=cookieVal;
    else if(stored==='blackwork'||stored==='fine-line') s=stored;
    document.documentElement.dataset.artistStyle=s;
    if(!cookieVal&&(stored==='blackwork'||stored==='fine-line')){
      document.cookie=COOKIE+'='+encodeURIComponent(s)+';path=/;samesite=lax;max-age=31536000'+(location.protocol==='https:'?';secure':'');
    }
  }catch(e){
    document.documentElement.dataset.artistStyle='fine-line';
  }
})();
`;

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
      className={`${dmSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mist text-ink">
        <Script
          id="artist-style-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: artistStyleInitScript }}
        />
        {children}
      </body>
    </html>
  );
}
