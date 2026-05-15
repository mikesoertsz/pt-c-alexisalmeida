/**
 * Identificação fiscal e de contacto do responsável pelo tratamento / contratante.
 * Defina as variáveis NEXT_PUBLIC_LEGAL_* em produção antes do go-live.
 */

export interface LegalEntity {
  legalName: string;
  tradingName: string;
  addressLines: string[];
  nif: string;
  email: string;
  /** Texto completo para cláusula de foro (PT) */
  jurisdictionPt: string;
  jurisdictionEn: string;
  jurisdictionDe: string;
  /** Localização comercial (ex. Albufeira, Algarve) */
  studioLocation: string;
}

const PLACEHOLDER_PT = "[A preencher antes da publicação em produção]";

function env(key: string): string | undefined {
  const v = process.env[key];
  return v !== undefined && v.trim() !== "" ? v.trim() : undefined;
}

function parseAddress(raw: string | undefined, isProd: boolean): string[] {
  if (!raw) {
    return [isProd ? PLACEHOLDER_PT : "[Morada: NEXT_PUBLIC_LEGAL_ADDRESS]"];
  }
  return raw
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getLegalEntity(): LegalEntity {
  const isProd = process.env.NODE_ENV === "production";

  const legalName =
    env("NEXT_PUBLIC_LEGAL_ENTITY_NAME") ??
    (isProd ? PLACEHOLDER_PT : "Aléxis Almeida — a preencher com denominação legal completa");

  const tradingName =
    env("NEXT_PUBLIC_LEGAL_TRADING_NAME") ?? "Aléxis Lex Almeida Tattoo";

  const nif = env("NEXT_PUBLIC_LEGAL_NIF") ?? (isProd ? PLACEHOLDER_PT : "000 000 000");

  const email =
    env("NEXT_PUBLIC_LEGAL_EMAIL") ??
    (isProd ? PLACEHOLDER_PT : "alexis.almeida.cc@gmail.com");

  const studioLocation =
    env("NEXT_PUBLIC_LEGAL_STUDIO_LOCATION") ?? "Porto, Portugal";

  return {
    legalName,
    tradingName,
    addressLines: parseAddress(env("NEXT_PUBLIC_LEGAL_ADDRESS"), isProd),
    nif,
    email,
    studioLocation,
    jurisdictionPt:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_PT") ??
      "Portuguesa. Fica eleito o foro da comarca de Faro, com renúncia a qualquer outro, salvo disposição legal imperativa em contrário.",
    jurisdictionEn:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_EN") ??
      "Portuguese law. The parties elect the courts of Faro district, waiving any other venue unless mandatory law requires otherwise.",
    jurisdictionDe:
      env("NEXT_PUBLIC_LEGAL_JURISDICTION_DE") ??
      "Portugiesisches Recht. Ausschließlicher Gerichtsstand ist der Bezirk Faro — soweit zwingendes Recht nichts anderes vorschreibt.",
  };
}

export function formatAddressInline(entity: LegalEntity): string {
  return entity.addressLines.join(", ");
}
