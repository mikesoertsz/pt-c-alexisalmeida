/**
 * Identificação fiscal e de contacto do responsável pelo tratamento / contratante.
 * Override via NEXT_PUBLIC_LEGAL_* env vars when registered details are confirmed.
 */

export interface LegalEntity {
  legalName: string;
  tradingName: string;
  addressLines: string[];
  /** Portuguese tax ID — empty until NEXT_PUBLIC_LEGAL_NIF is set */
  nif: string;
  email: string;
  /** Texto completo para cláusula de foro (PT) */
  jurisdictionPt: string;
  jurisdictionEn: string;
  jurisdictionDe: string;
  studioLocation: string;
}

const DEFAULT_LEGAL_NAME = "Aléxis Almeida Tattoo";
const DEFAULT_TRADING_NAME = "Aléxis Lex Almeida Tattoo";
const DEFAULT_EMAIL = "alexis.almeida.cc@gmail.com";
const DEFAULT_STUDIO_LOCATION = "Porto, Portugal";
const DEFAULT_ADDRESS_LINES = [
  "Rua do Paraíso 82",
  "4000-374 Porto",
  "Portugal",
];

function env(key: string): string | undefined {
  const v = process.env[key];
  return v !== undefined && v.trim() !== "" ? v.trim() : undefined;
}

function parseAddress(raw: string | undefined): string[] {
  if (!raw) {
    return DEFAULT_ADDRESS_LINES;
  }
  return raw
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getLegalEntity(): LegalEntity {
  const legalName = env("NEXT_PUBLIC_LEGAL_ENTITY_NAME") ?? DEFAULT_LEGAL_NAME;
  const tradingName = env("NEXT_PUBLIC_LEGAL_TRADING_NAME") ?? DEFAULT_TRADING_NAME;
  const nif = env("NEXT_PUBLIC_LEGAL_NIF") ?? "";
  const email = env("NEXT_PUBLIC_LEGAL_EMAIL") ?? DEFAULT_EMAIL;
  const studioLocation = env("NEXT_PUBLIC_LEGAL_STUDIO_LOCATION") ?? DEFAULT_STUDIO_LOCATION;

  return {
    legalName,
    tradingName,
    addressLines: parseAddress(env("NEXT_PUBLIC_LEGAL_ADDRESS")),
    nif,
    email,
    studioLocation,
    jurisdictionPt:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_PT") ??
      "Portuguesa. Fica eleito o foro da comarca do Porto, com renúncia a qualquer outro, salvo disposição legal imperativa em contrário.",
    jurisdictionEn:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_EN") ??
      "Portuguese law. The parties elect the courts of Porto district, waiving any other venue unless mandatory law requires otherwise.",
    jurisdictionDe:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_DE") ??
      "Portugiesisches Recht. Ausschließlicher Gerichtsstand ist der Bezirk Porto, soweit zwingendes Recht nichts anderes vorschreibt.",
  };
}

export function formatAddressInline(entity: LegalEntity): string {
  return entity.addressLines.join(", ");
}

export function formatEntityIntroPt(entity: LegalEntity): string {
  const nif = entity.nif ? `, NIF ${entity.nif}` : "";
  return `${entity.legalName} (${entity.tradingName}), com sede em ${formatAddressInline(entity)}${nif}, email ${entity.email}.`;
}

export function formatEntityIntroEn(entity: LegalEntity): string {
  const nif = entity.nif ? `, tax ID (NIF) ${entity.nif}` : "";
  return `${entity.legalName} (trading as ${entity.tradingName}), with registered address at ${formatAddressInline(entity)}${nif}, email ${entity.email}.`;
}

export function formatEntityIntroDe(entity: LegalEntity): string {
  const nif = entity.nif ? `, Steuernummer (NIF) ${entity.nif}` : "";
  return `${entity.legalName} (${entity.tradingName}), Anschrift: ${formatAddressInline(entity)}${nif}, E‑Mail: ${entity.email}.`;
}
