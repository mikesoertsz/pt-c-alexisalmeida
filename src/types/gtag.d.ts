declare global {
  interface Window {
    gtag: {
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
      (command: "config", targetId: string, params?: Record<string, unknown>): void;
      (command: "js", date: Date): void;
      (command: "set", params: Record<string, unknown>): void;
      (command: "set", fieldName: string, value: unknown): void;
      (
        command: "consent",
        type: "default" | "update",
        params: {
          ad_storage?: "granted" | "denied";
          analytics_storage?: "granted" | "denied";
          ad_user_data?: "granted" | "denied";
          ad_personalization?: "granted" | "denied";
          wait_for_update?: number;
          region?: string[];
        }
      ): void;
    };
    dataLayer: unknown[];
  }
}

export {};
