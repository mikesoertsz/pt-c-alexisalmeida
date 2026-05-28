import type { Locale } from "@/lib/locale";
import type { ContentSchema } from "./schema";
import { de } from "./de";
import { en } from "./en";
import { pt } from "./pt";

const CONTENT_MAP: Record<Locale, ContentSchema> = {
  en,
  pt: pt as unknown as ContentSchema,
  de: de as unknown as ContentSchema,
};

export function getContent(locale: Locale): ContentSchema {
  return CONTENT_MAP[locale];
}
