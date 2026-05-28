/** Safe defaults merged into transactional templates (always override with webhook payload where possible). */
export function baselineEmailVars(): Record<string, string> {
  const whatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ??
    process.env.WHATSAPP_LINK_FALLBACK?.trim() ??
    "https://wa.me/351934613635";

  const studioAddress =
    process.env.EMAIL_STUDIO_ADDRESS?.trim() ??
    "Lex Almeida · Rua do Paraíso 82, 4000-374 Porto, Portugal";

  const reviewLink =
    process.env.EMAIL_GOOGLE_REVIEW_URL?.trim() ??
    process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ??
    "https://www.instagram.com/alexis.tattoo.art/";

  const bookSessionLink =
    process.env.NEXT_PUBLIC_BOOK_SESSION_CAL_URL?.trim() ?? "https://cal.com/lextattoo/tattoo-session";

  return {
    client_first_name: "",
    service_type: "Consultation",
    date: "",
    time: "",
    booking_reference: "",
    studio_address: studioAddress,
    whatsapp_link: whatsapp,
    cancel_link: "https://cal.com",
    reschedule_link: "https://cal.com",
    review_link: reviewLink,
    book_session_link: bookSessionLink,
  };
}
