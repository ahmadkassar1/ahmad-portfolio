"use client";

import { PDFDocument } from "pdf-lib";
import type { Box } from "@/lib/lab/redacto/render";

export type FlattenInput = { canvas: HTMLCanvasElement; boxes: Box[] };

async function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  // toBlob (not toDataURL + fetch) — a data: fetch would hit the CSP.
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not rasterize the page");
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * True redaction: composite each page onto a fresh canvas, paint the boxes as
 * solid black PIXELS, then embed that raster in a new PDF. The original text
 * layer never makes it into the output — unlike a drawn rectangle, the
 * redacted content is genuinely unrecoverable. Returns a flattened PDF blob
 * plus a SHA-256 of the bytes for a local audit certificate.
 */
export async function flattenToPdf(
  pages: FlattenInput[],
): Promise<{ blob: Blob; sha256: string; redactions: number }> {
  const pdf = await PDFDocument.create();
  let redactions = 0;

  for (const { canvas, boxes } of pages) {
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "#000000";
    for (const b of boxes) {
      ctx.fillRect(b.x, b.y, b.w, b.h);
      redactions++;
    }
    const png = await canvasToPng(out);
    const img = await pdf.embedPng(png);
    const page = pdf.addPage([out.width, out.height]);
    page.drawImage(img, { x: 0, y: 0, width: out.width, height: out.height });
  }

  const bytes = await pdf.save();
  // Concrete ArrayBuffer (pdf.save() types as Uint8Array<ArrayBufferLike>, which
  // doesn't satisfy BufferSource / BlobPart under strict TS).
  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const digest = await crypto.subtle.digest("SHA-256", ab);
  const sha256 = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return { blob: new Blob([ab], { type: "application/pdf" }), sha256, redactions };
}
