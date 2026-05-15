"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/lib/analytics";

export default function ThankYouBeacon() {
  useEffect(() => {
    trackEvent("thank_you_view", {});
  }, []);
  return null;
}
