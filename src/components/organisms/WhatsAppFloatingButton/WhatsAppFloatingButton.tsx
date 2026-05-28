"use client";

import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";
import { trackWhatsAppConversion } from "@/lib/google-ads";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { ContentSchema } from "@/content/schema";

interface WhatsAppFloatingButtonProps {
  whatsapp: ContentSchema["whatsapp"];
}

export default function WhatsAppFloatingButton({ whatsapp }: WhatsAppFloatingButtonProps) {
  const url = getWhatsAppUrl({ message: whatsapp.inquiryMessage });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.fabAriaLabel}
      onClick={() => {
        trackEvent("cta_click", { event_category: "engagement", event_label: "whatsapp_float" });
        trackWhatsAppConversion();
      }}
      className="fixed z-[60] flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] right-[max(1.5rem,env(safe-area-inset-right,1.5rem))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden />
    </a>
  );
}
