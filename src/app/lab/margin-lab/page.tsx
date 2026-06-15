"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_PRODUCT,
  computePricing,
  decodeProduct,
  encodeProduct,
  money,
  type Channel,
  type Component,
  type Product,
} from "@/lib/lab/margin/model";

const input =
  "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/15";
const num = "w-20 rounded-md border border-zinc-300 px-2 py-1.5 text-right text-sm tabular-nums outline-none focus:border-green-700";
const btn = "inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50";

export default function MarginLabPage() {
  const [product, setProduct] = useState<Product>(DEFAULT_PRODUCT);
  const [scenario, setScenario] = useState(0); // material cost delta %
  const [toast, setToast] = useState<string | null>(null);
  const cid = useRef(100);

  const pricing = useMemo(() => computePricing(product), [product]);
  const scenarioPricing = useMemo(() => computePricing(product, 1 + scenario / 100), [product, scenario]);
  const [selChannel, setSelChannel] = useState(product.channels[0]?.id ?? "");
  const sel = pricing.channels.find((c) => c.id === selChannel) ?? pricing.channels[0];

  useEffect(() => {
    const m = window.location.hash.match(/p=([^&]+)/);
    if (m) {
      const loaded = decodeProduct(m[1]);
      if (loaded) setProduct(loaded);
    }
  }, []);

  // Keep the break-even selector in sync if its channel gets deleted.
  useEffect(() => {
    if (!product.channels.some((c) => c.id === selChannel)) {
      setSelChannel(product.channels[0]?.id ?? "");
    }
  }, [product.channels, selChannel]);

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2200);
  };

  const set = (patch: Partial<Product>) => setProduct((p) => ({ ...p, ...patch }));
  const setComp = (id: string, patch: Partial<Component>) =>
    setProduct((p) => ({ ...p, components: p.components.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const setChan = (id: string, patch: Partial<Channel>) =>
    setProduct((p) => ({ ...p, channels: p.channels.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const share = async () => {
    const url = `${location.origin}${location.pathname}#p=${encodeProduct(product)}`;
    history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url);
    flash("Shareable link copied");
  };
  const exportCsv = () => {
    const head = "channel,price,fees,profit_per_unit,margin_pct,break_even_units";
    const rows = pricing.channels.map(
      (c) => `${c.name},${c.price.toFixed(2)},${c.feeTotal.toFixed(2)},${c.profitPerUnit.toFixed(2)},${c.marginPct.toFixed(1)},${c.breakEvenUnits ?? ""}`,
    );
    const blob = new Blob([[head, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${product.name.toLowerCase().replace(/\s+/g, "-")}-pricing.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    flash("Exported price sheet (CSV)");
  };

  return (
    <div className="min-h-dvh bg-zinc-100 font-sans text-zinc-900 antialiased">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Link href="/lab" className="shrink-0 font-mono text-xs text-zinc-400 hover:text-zinc-900">
          ← Lab
        </Link>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-green-700 text-sm font-semibold text-white">
          $
        </span>
        <input
          aria-label="Product name"
          value={product.name}
          onChange={(e) => set({ name: e.target.value })}
          className="min-w-0 flex-1 rounded-md px-2 py-1 text-sm font-medium outline-none hover:bg-zinc-50 focus:bg-zinc-50"
        />
        <div className="flex items-center gap-1.5">
          <button className={btn} onClick={exportCsv}>
            Export
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-800"
            onClick={share}
          >
            Share
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[20rem_1fr]">
        {/* Cost build-up */}
        <section className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700">Cost build-up</h2>
            <div className="space-y-2">
              {product.components.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <input
                    aria-label="Component"
                    value={c.name}
                    onChange={(e) => setComp(c.id, { name: e.target.value })}
                    className={`${input} flex-1`}
                  />
                  <input
                    aria-label="Qty"
                    type="number"
                    value={c.qty}
                    onChange={(e) => setComp(c.id, { qty: Number(e.target.value) })}
                    className="w-14 rounded-md border border-zinc-300 px-2 py-1.5 text-right text-sm outline-none focus:border-green-700"
                  />
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                    <input
                      aria-label="Unit cost"
                      type="number"
                      step="0.01"
                      value={c.unitCost}
                      onChange={(e) => setComp(c.id, { unitCost: Number(e.target.value) })}
                      className="w-20 rounded-md border border-zinc-300 py-1.5 pl-5 pr-2 text-right text-sm tabular-nums outline-none focus:border-green-700"
                    />
                  </div>
                  <button
                    aria-label="Remove"
                    onClick={() => set({ components: product.components.filter((x) => x.id !== c.id) })}
                    className="shrink-0 px-1 text-zinc-300 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => set({ components: [...product.components, { id: `c${cid.current++}`, name: "New material", qty: 1, unitCost: 0 }] })}
              className="mt-2 text-sm font-medium text-green-700 hover:text-green-800"
            >
              + Material
            </button>

            <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm">
              <Row label="Labor (minutes)">
                <input type="number" value={product.laborMinutes} onChange={(e) => set({ laborMinutes: Number(e.target.value) })} className={num} />
              </Row>
              <Row label="Labor rate ($/hr)">
                <input type="number" value={product.laborRate} onChange={(e) => set({ laborRate: Number(e.target.value) })} className={num} />
              </Row>
              <Row label="Overhead / unit ($)">
                <input type="number" step="0.01" value={product.overhead} onChange={(e) => set({ overhead: Number(e.target.value) })} className={num} />
              </Row>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-zinc-100 pt-4">
              <span className="text-sm text-zinc-500">True unit cost</span>
              <span className="text-xl font-semibold tabular-nums text-zinc-900">{money(pricing.unitCost)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <Row label="Target margin">
              <span className="flex items-center gap-2">
                <input type="number" value={product.targetMargin} onChange={(e) => set({ targetMargin: Number(e.target.value) })} className={num} />
                <span className="text-sm text-zinc-400">%</span>
              </span>
            </Row>
            <input
              type="range"
              min={0}
              max={80}
              value={product.targetMargin}
              onChange={(e) => set({ targetMargin: Number(e.target.value) })}
              className="mt-2 w-full accent-green-700"
              aria-label="Target margin slider"
            />
            <div className="mt-3">
              <Row label="Monthly fixed costs ($)">
                <input type="number" value={product.fixedCosts} onChange={(e) => set({ fixedCosts: Number(e.target.value) })} className={num} />
              </Row>
            </div>
          </div>
        </section>

        {/* Channels + results */}
        <section className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-zinc-700">Channels &amp; suggested prices</h2>
              <button
                onClick={() => set({ channels: [...product.channels, { id: `ch${cid.current++}`, name: "New channel", pctFee: 0, flatFee: 0, perTxnFee: 0 }] })}
                className="text-sm font-medium text-green-700 hover:text-green-800"
              >
                + Channel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-400">
                    <th className="px-4 py-2 font-medium">Channel</th>
                    <th className="px-2 py-2 text-right font-medium">% fee</th>
                    <th className="px-2 py-2 text-right font-medium">flat</th>
                    <th className="px-2 py-2 text-right font-medium">/txn</th>
                    <th className="px-3 py-2 text-right font-medium">Price</th>
                    <th className="px-3 py-2 text-right font-medium">Profit/unit</th>
                    <th className="px-3 py-2 text-right font-medium">Break-even</th>
                    <th className="px-1" />
                  </tr>
                </thead>
                <tbody>
                  {product.channels.map((ch) => {
                    const r = pricing.channels.find((x) => x.id === ch.id)!;
                    return (
                      <tr key={ch.id} className="border-b border-zinc-50 last:border-0">
                        <td className="px-4 py-2">
                          <input value={ch.name} onChange={(e) => setChan(ch.id, { name: e.target.value })} className="w-28 rounded border border-transparent px-1 py-1 text-sm hover:border-zinc-200 focus:border-green-700 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input type="number" step="0.1" value={ch.pctFee} onChange={(e) => setChan(ch.id, { pctFee: Number(e.target.value) })} className="w-14 rounded border border-zinc-200 px-1 py-1 text-right text-sm tabular-nums focus:border-green-700 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input type="number" step="0.01" value={ch.flatFee} onChange={(e) => setChan(ch.id, { flatFee: Number(e.target.value) })} className="w-14 rounded border border-zinc-200 px-1 py-1 text-right text-sm tabular-nums focus:border-green-700 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input type="number" step="0.01" value={ch.perTxnFee} onChange={(e) => setChan(ch.id, { perTxnFee: Number(e.target.value) })} className="w-14 rounded border border-zinc-200 px-1 py-1 text-right text-sm tabular-nums focus:border-green-700 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">{r.reachable ? money(r.price) : <span className="text-red-600">unreachable</span>}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-zinc-600">{r.reachable ? money(r.profitPerUnit) : "—"}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-zinc-500">{r.breakEvenUnits ?? "—"}</td>
                        <td className="px-1">
                          {product.channels.length > 1 && (
                            <button aria-label="Remove channel" onClick={() => set({ channels: product.channels.filter((x) => x.id !== ch.id) })} className="px-1 text-zinc-300 hover:text-red-600">
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {product.channels.length > 0 && product.targetMargin + Math.max(...product.channels.map((c) => c.pctFee)) >= 100 && (
              <p className="border-t border-zinc-100 px-5 py-2 text-xs text-red-600">
                A channel’s fee % + target margin ≥ 100% — that price is mathematically unreachable. Lower the target margin.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Break-even chart */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-700">Break-even</h3>
                <select value={selChannel} onChange={(e) => setSelChannel(e.target.value)} className="rounded-md border border-zinc-300 px-2 py-1 text-xs focus:border-green-700 focus:outline-none">
                  {product.channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <BreakEvenChart price={sel?.price ?? 0} profit={sel?.profitPerUnit ?? 0} fixedCosts={product.fixedCosts} breakEven={sel?.breakEvenUnits ?? null} reachable={!!sel?.reachable} />
            </div>

            {/* Scenario */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-medium text-zinc-700">What-if: material cost</h3>
              <p className="mb-3 text-xs text-zinc-400">Stress-test prices if material prices move.</p>
              <div className="flex items-center gap-3">
                <input type="range" min={-30} max={50} value={scenario} onChange={(e) => setScenario(Number(e.target.value))} className="flex-1 accent-green-700" aria-label="Material cost change" />
                <span className={`w-16 text-right text-sm font-medium tabular-nums ${scenario > 0 ? "text-red-600" : scenario < 0 ? "text-green-700" : "text-zinc-500"}`}>
                  {scenario > 0 ? "+" : ""}
                  {scenario}%
                </span>
              </div>
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-zinc-400">
                    <th className="py-1 text-left font-medium">Channel</th>
                    <th className="py-1 text-right font-medium">Now</th>
                    <th className="py-1 text-right font-medium">Scenario</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.channels.map((c) => {
                    const sc = scenarioPricing.channels.find((x) => x.id === c.id)!;
                    const up = sc.price > c.price + 0.005;
                    return (
                      <tr key={c.id} className="border-t border-zinc-50">
                        <td className="py-1.5 text-zinc-600">{c.name}</td>
                        <td className="py-1.5 text-right tabular-nums text-zinc-500">{c.reachable ? money(c.price) : "—"}</td>
                        <td className={`py-1.5 text-right font-medium tabular-nums ${up ? "text-red-600" : "text-zinc-900"}`}>{sc.reachable ? money(sc.price) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

const W = 340;
const H = 200;
const PAD = { l: 44, r: 12, t: 12, b: 26 };

function BreakEvenChart({
  price,
  profit,
  fixedCosts,
  breakEven,
  reachable,
}: {
  price: number;
  profit: number;
  fixedCosts: number;
  breakEven: number | null;
  reachable: boolean;
}) {
  if (!reachable || profit <= 0 || !breakEven) {
    return (
      <div className="grid h-[200px] place-items-center text-center text-sm text-zinc-400">
        {!reachable ? "Price unreachable at this margin." : "Set a positive profit and fixed costs to see break-even."}
      </div>
    );
  }
  const maxU = Math.max(breakEven * 2, 8);
  const variablePerUnit = price - profit; // unit cost + fees
  const maxY = Math.max(price * maxU, fixedCosts + variablePerUnit * maxU);
  const x = (u: number) => PAD.l + (u / maxU) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (H - PAD.t - PAD.b) * (1 - v / maxY);

  const revenue = `M${x(0)},${y(0)} L${x(maxU)},${y(price * maxU)}`;
  const cost = `M${x(0)},${y(fixedCosts)} L${x(maxU)},${y(fixedCosts + variablePerUnit * maxU)}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Break-even chart">
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1={PAD.l} x2={W - PAD.r} y1={y(maxY * t)} y2={y(maxY * t)} stroke="#e4e4e7" />
        ))}
        <text x={PAD.l - 6} y={y(maxY) + 4} textAnchor="end" fontSize={9} className="fill-zinc-400">
          ${Math.round(maxY)}
        </text>
        <path d={cost} fill="none" stroke="#a1a1aa" strokeWidth={2} />
        <path d={revenue} fill="none" stroke="#15803d" strokeWidth={2} />
        <line x1={x(breakEven)} x2={x(breakEven)} y1={PAD.t} y2={H - PAD.b} stroke="#15803d" strokeDasharray="3 3" strokeWidth={1} />
        <circle cx={x(breakEven)} cy={y(price * breakEven)} r={3.5} fill="#15803d" />
        <text x={x(maxU)} y={H - 8} textAnchor="end" fontSize={9} className="fill-zinc-400">
          {maxU} units
        </text>
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-500"><span className="h-2 w-2 rounded-full bg-green-700" /> revenue</span>
          <span className="flex items-center gap-1.5 text-zinc-500"><span className="h-2 w-2 rounded-full bg-zinc-400" /> total cost</span>
        </span>
        <span className="font-medium text-green-700">Break even: {breakEven} units</span>
      </div>
    </div>
  );
}
