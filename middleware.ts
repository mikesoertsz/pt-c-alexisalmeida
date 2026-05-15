import { NextResponse, type NextRequest } from "next/server";
import {
  ARTIST_STYLE_COOKIE,
  ARTIST_STYLE_HEADER,
  parseArtistStyle,
} from "@/app/lib/artist-style";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isPrefixedLocaleSegment,
  isValidLocale,
  resolveLocaleFromHeader,
  type Locale,
} from "@/app/lib/locale";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_HEADER = "x-locale";

function localeCookieAttrs() {
  return {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

function extendRequestHeaders(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  const raw = request.cookies.get(ARTIST_STYLE_COOKIE)?.value;
  requestHeaders.set(ARTIST_STYLE_HEADER, parseArtistStyle(raw));
  return requestHeaders;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  /** Public /en/* bookmarks → unprefixed English URLs */
  if (firstSegment === "en") {
    const tail = segments.slice(1).join("/");
    const url = request.nextUrl.clone();
    url.pathname = tail ? `/${tail}` : "/";
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, "en", localeCookieAttrs());
    return res;
  }

  if (isPrefixedLocaleSegment(firstSegment)) {
    const locale = firstSegment;
    const requestHeaders = extendRequestHeaders(request, locale);
    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    res.cookies.set(LOCALE_COOKIE, locale, localeCookieAttrs());
    return res;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    cookieLocale !== undefined && isValidLocale(cookieLocale)
      ? cookieLocale
      : resolveLocaleFromHeader(request.headers.get("accept-language") ?? "");

  if (locale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    const suffix =
      pathname === "/" ? "" : pathname.startsWith("/") ? pathname.slice(1) : pathname;
    url.pathname = suffix ? `/${locale}/${suffix}` : `/${locale}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, localeCookieAttrs());
    return res;
  }

  const internalPath =
    pathname === "/" ? `/en` : pathname.startsWith("/") ? `/en${pathname}` : `/en/${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = internalPath;

  const requestHeaders = extendRequestHeaders(request, "en");
  const res = NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
  res.cookies.set(LOCALE_COOKIE, "en", localeCookieAttrs());
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
