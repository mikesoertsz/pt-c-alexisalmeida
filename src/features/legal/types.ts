export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  level?: 2 | 3;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  meta: {
    lastUpdated: string;
    documentTitle: string;
    description?: string;
  };
  sections: LegalSection[];
};
