"use client";

import { useMemo, useRef, useState } from "react";
import type { SeriesPoint } from "@/lib/lab/parcel-data";
import { compact } from "@/lib/lab/parcel-data";

const ACCENT = "#0f766e"; // teal-700 — the single accent across Helm

/** Tiny inline trend line for KPI cards. No axes, no interaction. */
export function Sparkline({
  data,
  up,
  width = 96,
  height = 28,
}: {
  data: number[];
  up: boolean;
  width?: number;
  height?: number;
}) {
  const { d } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return { d: `M${points.join(" L")}` };
  }, [data, width, height]);

  const stroke = up ? ACCENT : "#b91c1c";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const W = 760;
const H = 280;
const PAD = { top: 16, right: 16, bottom: 28, left: 48 };

/**
 * Interactive area chart, drawn by hand in SVG. Gridlines + y/x ticks, an
 * area fill under a 2px line, and a crosshair + HTML tooltip that tracks the
 * pointer to the nearest data point.
 */
export function AreaChart({ data }: { data: SeriesPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const { areaPath, linePath, max, x, y, ticks } = useMemo(() => {
    const values = data.map((d) => d.requests);
    const rawMax = Math.max(...values);
    // Round the axis ceiling up to a clean number.
    const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const max = Math.ceil(rawMax / mag) * mag;
    const n = data.length;
    const x = (i: number) => PAD.left + (i / (n - 1)) * plotW;
    const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
    const line = data.map((d, i) => `${x(i).toFixed(1)},${y(d.requests).toFixed(1)}`);
    const linePath = `M${line.join(" L")}`;
    const areaPath = `${linePath} L${x(n - 1).toFixed(1)},${(PAD.top + plotH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + plotH).toFixed(1)} Z`;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ v: max * t, yy: y(max * t) }));
    return { areaPath, linePath, max, x, y, ticks };
  }, [data, plotW, plotH]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const frac = (px - PAD.left) / plotW;
    const idx = Math.round(frac * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  };

  // Label only a handful of x ticks to avoid crowding.
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <div ref={wrapRef} className="relative" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="API requests per period">
        <defs>
          <linearGradient id="helm-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.18} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={t.yy} y2={t.yy} stroke="#e4e4e7" strokeWidth={1} />
            <text x={PAD.left - 8} y={t.yy + 3.5} textAnchor="end" className="fill-zinc-400" fontSize={10}>
              {compact(t.v)}
            </text>
          </g>
        ))}

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-zinc-400" fontSize={10}>
              {d.label}
            </text>
          ) : null,
        )}

        <path d={areaPath} fill="url(#helm-area)" />
        <path d={linePath} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].requests)} r={4} fill="#fff" stroke={ACCENT} strokeWidth={2} />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <div className="font-medium text-zinc-900">{compact(data[hover].requests)} requests</div>
          <div className="mt-0.5 text-zinc-500">
            {data[hover].label} · {compact(data[hover].errors)} errors
          </div>
        </div>
      )}
    </div>
  );
}

/** Horizontal bars for endpoint volume, widths relative to the top entry. */
export function EndpointBars({
  items,
}: {
  items: { method: string; path: string; requests: number }[];
}) {
  const max = Math.max(...items.map((i) => i.requests));
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.path}>
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate font-mono text-zinc-600">
              <span className="text-zinc-400">{it.method}</span> {it.path}
            </span>
            <span className="tabular-nums text-zinc-500">{compact(it.requests)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${(it.requests / max) * 100}%`, backgroundColor: ACCENT }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
