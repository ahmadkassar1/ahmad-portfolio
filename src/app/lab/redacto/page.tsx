"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { renderImage, renderPdf, type Box, type RenderedPage } from "@/lib/lab/redacto/render";
import { flattenToPdf } from "@/lib/lab/redacto/flatten";
import { PII_LABEL, summarize, type PiiType } from "@/lib/lab/redacto/detect";

type Status = "empty" | "loading" | "ready" | "error";

export default function RedactoPage() {
  const [status, setStatus] = useState<Status>("empty");
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [fileName, setFileName] = useState("");
  const [useAuto, setUseAuto] = useState(true);
  const [draw, setDraw] = useState(true);
  // Manual boxes keyed by page index.
  const [manual, setManual] = useState<Record<number, Box[]>>({});
  const [audit, setAudit] = useState<{ sha256: string; redactions: number; pages: number } | null>(null);
  const manualId = useRef(0);

  const load = useCallback(async (file: File) => {
    setStatus("loading");
    setError(null);
    setAudit(null);
    setManual({});
    setFileName(file.name);
    try {
      const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      const isImg = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name);
      if (isPdf) {
        const buf = await file.arrayBuffer();
        setPages(await renderPdf(buf));
      } else if (isImg) {
        setPages([await renderImage(file)]);
      } else {
        throw new Error("Drop a PDF or an image file.");
      }
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open that file.");
      setStatus("error");
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) load(file);
  };

  const detectedSummary = useMemo(() => {
    const all = pages.flatMap((p) => p.detected);
    return summarize(all);
  }, [pages]);

  const totalAuto = useMemo(() => pages.reduce((s, p) => s + p.autoBoxes.length, 0), [pages]);
  const totalManual = useMemo(() => Object.values(manual).reduce((s, b) => s + b.length, 0), [manual]);

  const boxesFor = (p: RenderedPage): Box[] => [...(useAuto ? p.autoBoxes : []), ...(manual[p.index] ?? [])];

  const exportPdf = async () => {
    try {
      const result = await flattenToPdf(pages.map((p) => ({ canvas: p.canvas, boxes: boxesFor(p) })));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(result.blob);
      a.download = `${fileName.replace(/\.[^.]+$/, "") || "document"}-redacted.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
      setAudit({ sha256: result.sha256, redactions: result.redactions, pages: pages.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
      setStatus("error");
    }
  };

  const reset = () => {
    setPages([]);
    setStatus("empty");
    setManual({});
    setAudit(null);
    setError(null);
  };

  return (
    <div className="min-h-dvh bg-zinc-100 font-sans text-zinc-900 antialiased">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Link href="/lab" className="shrink-0 font-mono text-xs text-zinc-400 hover:text-zinc-900">
          ← Lab
        </Link>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-red-700 text-sm font-semibold text-white">▮</span>
        <span className="font-semibold tracking-tight">Redacto</span>
        <span className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> on-device · nothing uploaded
        </span>
        {status === "ready" && (
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={reset} className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              New file
            </button>
            <button onClick={exportPdf} className="rounded-lg bg-red-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-red-800">
              Export redacted PDF
            </button>
          </div>
        )}
      </header>

      {status === "empty" && (
        <div className="mx-auto max-w-2xl px-6 py-20">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white px-6 py-16 text-center transition-colors hover:border-red-400"
          >
            <span className="text-lg font-medium text-zinc-700">Drop a PDF or image to redact</span>
            <span className="mt-1.5 text-sm text-zinc-500">It’s rendered and processed entirely in your browser — open DevTools, you’ll see zero uploads.</span>
            <span className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Choose a file</span>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && load(e.target.files[0])}
            />
          </label>
          <p className="mt-6 text-center text-xs text-zinc-400">
            Detects SSNs, card numbers (Luhn-checked), emails, phones &amp; more. Export burns the boxes into the pixels —
            the redacted text is gone, not just covered.
          </p>
        </div>
      )}

      {status === "loading" && (
        <div className="grid place-items-center py-32 text-sm text-zinc-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-red-700" />
          <p className="mt-3">Rendering {fileName}…</p>
        </div>
      )}

      {status === "error" && (
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button onClick={reset} className="mt-4 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Try another file
          </button>
        </div>
      )}

      {status === "ready" && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_18rem]">
          {/* Pages */}
          <div className="space-y-5">
            {pages.map((p) => (
              <PageView
                key={p.index}
                page={p}
                autoVisible={useAuto}
                manualBoxes={manual[p.index] ?? []}
                draw={draw}
                onAddBox={(b) => setManual((m) => ({ ...m, [p.index]: [...(m[p.index] ?? []), { ...b, id: `m${manualId.current++}`, source: "manual" }] }))}
                onRemoveBox={(id) => setManual((m) => ({ ...m, [p.index]: (m[p.index] ?? []).filter((x) => x.id !== id) }))}
              />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-700">Detected</h2>
              {detectedSummary.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-400">No structured PII auto-detected{pages[0]?.detected ? "" : " (image — draw boxes manually)"}.</p>
              ) : (
                <ul className="mt-2.5 space-y-1.5">
                  {detectedSummary.map((d) => (
                    <li key={d.type} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">{PII_LABEL[d.type as PiiType]}</span>
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">{d.count}</span>
                    </li>
                  ))}
                </ul>
              )}
              <label className="mt-4 flex items-center gap-2.5 border-t border-zinc-100 pt-3 text-sm text-zinc-700">
                <input type="checkbox" checked={useAuto} onChange={(e) => setUseAuto(e.target.checked)} className="h-4 w-4 accent-red-700" />
                Redact {totalAuto} auto-detected
              </label>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <label className="flex items-center gap-2.5 text-sm text-zinc-700">
                <input type="checkbox" checked={draw} onChange={(e) => setDraw(e.target.checked)} className="h-4 w-4 accent-red-700" />
                Draw to redact
              </label>
              <p className="mt-2 text-xs text-zinc-400">Drag across the page to box anything the detector missed (signatures, faces, logos). Click a box to remove it.</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-zinc-500">Manual boxes</span>
                <span className="font-medium tabular-nums">{totalManual}</span>
              </div>
            </div>

            {audit && (
              <div className="rounded-xl border border-green-200 bg-green-50/60 p-4">
                <h3 className="text-sm font-semibold text-green-800">Exported ✓</h3>
                <p className="mt-1 text-xs text-green-700">{audit.redactions} regions burned across {audit.pages} page(s). Original text discarded.</p>
                <p className="mt-2 break-all font-mono text-[10px] text-zinc-500">sha256: {audit.sha256}</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function PageView({
  page,
  autoVisible,
  manualBoxes,
  draw,
  onAddBox,
  onRemoveBox,
}: {
  page: RenderedPage;
  autoVisible: boolean;
  manualBoxes: Box[];
  draw: boolean;
  onAddBox: (b: { x: number; y: number; w: number; h: number }) => void;
  onRemoveBox: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x0: number; y0: number; x: number; y: number } | null>(null);

  // Pointer → canvas-pixel coords.
  const toCanvas = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * page.width,
      y: ((clientY - r.top) / r.height) * page.height,
    };
  };

  const pct = (b: { x: number; y: number; w: number; h: number }) => ({
    left: `${(b.x / page.width) * 100}%`,
    top: `${(b.y / page.height) * 100}%`,
    width: `${(b.w / page.width) * 100}%`,
    height: `${(b.h / page.height) * 100}%`,
  });

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div
        ref={ref}
        className={`relative select-none ${draw ? "cursor-crosshair" : ""}`}
        style={{ aspectRatio: `${page.width} / ${page.height}` }}
        onPointerDown={(e) => {
          if (!draw) return;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          const c = toCanvas(e.clientX, e.clientY);
          setDrag({ x0: c.x, y0: c.y, x: c.x, y: c.y });
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          const c = toCanvas(e.clientX, e.clientY);
          setDrag({ ...drag, x: c.x, y: c.y });
        }}
        onPointerUp={() => {
          if (!drag) return;
          const x = Math.min(drag.x0, drag.x);
          const y = Math.min(drag.y0, drag.y);
          const w = Math.abs(drag.x - drag.x0);
          const h = Math.abs(drag.y - drag.y0);
          if (w > 4 && h > 4) onAddBox({ x, y, w, h });
          setDrag(null);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.bitmap} alt={`Page ${page.index}`} className="block w-full" draggable={false} />

        {autoVisible &&
          page.autoBoxes.map((b) => (
            <span key={b.id} aria-hidden="true" className="absolute bg-black/85 ring-1 ring-red-500/60" style={pct(b)} />
          ))}

        {manualBoxes.map((b) => (
          <button
            key={b.id}
            onClick={() => onRemoveBox(b.id)}
            title="Click to remove"
            aria-label="Remove redaction box"
            className="absolute bg-black ring-1 ring-red-400 hover:ring-2"
            style={pct(b)}
          />
        ))}

        {drag && (
          <span
            aria-hidden="true"
            className="absolute border-2 border-red-600 bg-red-600/20"
            style={pct({ x: Math.min(drag.x0, drag.x), y: Math.min(drag.y0, drag.y), w: Math.abs(drag.x - drag.x0), h: Math.abs(drag.y - drag.y0) })}
          />
        )}
      </div>
    </div>
  );
}
