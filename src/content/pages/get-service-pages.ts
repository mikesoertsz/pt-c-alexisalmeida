import type { Locale } from "@/lib/locale";
import type { ServicePage, ServicePageKey, ServicePagesBundle } from "./types";
import { servicePagesDe } from "./de";
import { servicePagesEn } from "./en";
import { servicePagesPt } from "./pt";

const BUNDLES: Record<Locale, ServicePagesBundle> = {
  en: servicePagesEn,
  pt: servicePagesPt,
  de: servicePagesDe,
};

export function getServicePages(locale: Locale): ServicePagesBundle {
  return BUNDLES[locale];
}

export function getServicePage(locale: Locale, key: ServicePageKey): ServicePage {
  return BUNDLES[locale].pages[key];
}
