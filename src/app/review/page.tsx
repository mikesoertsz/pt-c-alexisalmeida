import { redirect } from "next/navigation";

// Superseded by /qr (the "Studio tools" QR page, matching the shared
// Portugal Tattoo pattern). Kept as a redirect in case this path was
// already printed/bookmarked anywhere.
export default function ReviewRedirect() {
  redirect("/qr");
}
