"use client";

import { detectPII, type Match, type PiiType } from "@/lib/lab/redacto/detect";

// Lazy-load pdf.js at call time (client only). Importing it at module scope
// breaks prerender — pdf.js references DOMMatrix during module evaluation,
// which doesn't exist on the server. The worker is bundled (same-origin →
// CSP-clean, no CDN fetch).
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      return mod;
    });
  }
  return pdfjsPromise;
}

export type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  source: "auto" | "manual";
  type?: PiiType;
};

export type RenderedPage = {
  index: number;
  width: number;
  height: number;
  /** PNG data URL of the rendered page (for display; not a network fetch). */
  bitmap: string;
  /** The live canvas, kept for flattening on export. */
  canvas: HTMLCanvasElement;
  autoBoxes: Box[];
  detected: Match[];
};

type TextItemLike = { str: string; transform: number[]; width: number; height: number };

const SCALE = 1.6;

export async function renderPdf(data: ArrayBuffer): Promise<RenderedPage[]> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: RenderedPage[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    // Extract text with per-run device-space rects.
    const tc = await page.getTextContent();
    let text = "";
    const spans: { start: number; end: number; x: number; y: number; w: number; h: number }[] = [];
    for (const raw of tc.items) {
      const item = raw as TextItemLike;
      if (typeof item.str !== "string" || item.str.length === 0) continue;
      const tx = pdfjs.Util.transform(viewport.transform, item.transform);
      const fh = Math.hypot(tx[1], tx[3]) || 10;
      const w = (item.width ?? 0) * SCALE;
      const start = text.length;
      text += item.str;
      spans.push({ start, end: text.length, x: tx[4], y: tx[5] - fh, w, h: fh });
      text += " ";
    }

    const detected = detectPII(text);
    const autoBoxes: Box[] = [];
    detected.forEach((m, mi) => {
      for (const s of spans) {
        if (s.start < m.end && s.end > m.start) {
          autoBoxes.push({
            id: `a${i}_${mi}_${autoBoxes.length}`,
            x: s.x,
            y: s.y,
            w: s.w,
            h: s.h,
            source: "auto",
            type: m.type,
          });
        }
      }
    });

    pages.push({
      index: i,
      width: canvas.width,
      height: canvas.height,
      bitmap: canvas.toDataURL("image/png"),
      canvas,
      autoBoxes,
      detected,
    });
  }
  return pages;
}

export async function renderImage(file: File): Promise<RenderedPage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error("Could not read that image"));
      im.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(img, 0, 0);
    return {
      index: 1,
      width: canvas.width,
      height: canvas.height,
      bitmap: canvas.toDataURL("image/png"),
      canvas,
      autoBoxes: [],
      detected: [],
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
