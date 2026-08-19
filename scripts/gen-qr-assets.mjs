/**
 * Generates the static QR code assets served from /qr on the site
 * (public/qr/*.png + *.pdf) — printable codes for the studio: booking
 * link and Google review link.
 *
 * Run after changing STUDIO_GOOGLE_PLACE_ID or the site domain:
 *   node scripts/gen-qr-assets.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "qr");

// Keep in sync with STUDIO_GOOGLE_REVIEW_LINK in src/config/studio.ts
// (plain Node script here, can't import the TS module directly).
// This is the official short link from Google Business Profile Manager
// ("Ask for reviews" → review link) — not a constructed maps/cid link.
const STUDIO_GOOGLE_REVIEW_LINK = "https://g.page/r/CeTZ9ry88yiEEBM/review";

const TARGETS = [
  {
    slug: "website",
    title: "Book your session",
    subtitle: "Points to lextattoo.com so people can book online.",
    url: "https://www.lextattoo.com",
  },
  {
    slug: "reviews",
    title: "Leave us a review",
    subtitle: "Opens the Google listing to leave a review in seconds.",
    url: STUDIO_GOOGLE_REVIEW_LINK,
  },
];

const INK = "#222222";

async function genPng(target) {
  const file = path.join(OUT_DIR, `${target.slug}-qr.png`);
  await QRCode.toFile(file, target.url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1024,
    color: { dark: INK, light: "#FFFFFFFF" },
  });
  console.log("wrote", file);
}

async function genPdf(target) {
  const qrPngBytes = await QRCode.toBuffer(target.url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 1600,
    color: { dark: INK, light: "#FFFFFFFF" },
  });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait, points
  const { width, height } = page.getSize();

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const inkColor = rgb(0x22 / 255, 0x22 / 255, 0x22 / 255);

  page.drawText("LEX ALMEIDA TATTOO", {
    x: 60,
    y: height - 90,
    size: 14,
    font: bold,
    color: inkColor,
  });

  const titleLines = target.title.toUpperCase();
  page.drawText(titleLines, {
    x: 60,
    y: height - 140,
    size: 30,
    font: bold,
    color: inkColor,
  });

  page.drawText(target.subtitle, {
    x: 60,
    y: height - 170,
    size: 12,
    font: regular,
    color: inkColor,
  });

  const qrImage = await pdf.embedPng(qrPngBytes);
  const qrSize = 340;
  page.drawImage(qrImage, {
    x: (width - qrSize) / 2,
    y: height - 620,
    width: qrSize,
    height: qrSize,
  });

  page.drawText(target.url, {
    x: 60,
    y: 130,
    size: 10,
    font: regular,
    color: inkColor,
    maxWidth: width - 120,
  });

  page.drawText("Porto, Portugal · lextattoo.com", {
    x: 60,
    y: 60,
    size: 10,
    font: regular,
    color: inkColor,
  });

  const bytes = await pdf.save();
  const file = path.join(OUT_DIR, `${target.slug}-poster.pdf`);
  await writeFile(file, bytes);
  console.log("wrote", file);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const target of TARGETS) {
    await genPng(target);
    await genPdf(target);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
