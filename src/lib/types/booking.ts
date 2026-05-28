/** Request body for `/api/cal/book` (custom UI path alongside Cal embed). */
export interface CalBookRequestBody {
  eventTypeSlug: string;
  /** ISO UTC start time from `/api/cal/slots`. */
  start: string;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
    language?: string;
  };
  metadata?: Record<string, string>;
}

/** Normalized slot chip for UI (optional consumption). */
export interface CalSlotRange {
  start: string;
  end: string;
}
