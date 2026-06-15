"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AreaChart, EndpointBars, Sparkline } from "@/components/lab/helm/charts";
import {
  deliveries,
  endpoints,
  kpis,
  requestSeries,
  type DeliveryStatus,
  type RangeKey,
} from "@/lib/lab/parcel-data";

const NAV = ["Overview", "Requests", "Webhooks", "Logs", "Settings"] as const;
const RANGES: { key: RangeKey; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

const STATUS_STYLE: Record<DeliveryStatus, string> = {
  delivered: "bg-teal-50 text-teal-700 ring-teal-600/20",
  deferred: "bg-amber-50 text-amber-700 ring-amber-600/20",
  bounced: "bg-orange-50 text-orange-700 ring-orange-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function HelmPage() {
  const router = useRouter();
  const [range, setRange] = useState<RangeKey>("30d");
  const [section, setSection] = useState<(typeof NAV)[number]>("Overview");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const series = useMemo(() => requestSeries(range), [range]);

  // ⌘K / Ctrl+K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rangeNote =
    range === "24h" ? "last 24 hours" : range === "7d" ? "last 7 days" : "last 30 days";

  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900 antialiased">
      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-teal-700 text-sm font-semibold text-white">
              P
            </span>
            <span className="font-semibold tracking-tight">Parcel</span>
          </div>
          <nav className="flex-1 p-3" aria-label="Sections">
            {NAV.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                aria-current={section === item ? "page" : undefined}
                className={`mb-0.5 block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  section === item
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="border-t border-zinc-200 p-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              ← Back to portfolio
            </Link>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-zinc-50/80 px-5 backdrop-blur lg:px-8">
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 lg:hidden">
              ←
            </Link>
            <h1 className="text-sm font-semibold tracking-tight lg:text-base">{section}</h1>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="ml-auto hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-300 sm:flex"
            >
              Search…
              <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                ⌘K
              </kbd>
            </button>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600">
              AK
            </span>
          </header>

          <main className="flex-1 space-y-6 p-5 lg:p-8">
            {/* Title row + range switch */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Deliverability overview</h2>
                <p className="text-sm text-zinc-500">Email & webhook traffic, {rangeNote}.</p>
              </div>
              <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
                {RANGES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRange(r.key)}
                    aria-pressed={range === r.key}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      range === r.key ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((k) => {
                const positive = k.delta >= 0;
                const good = positive === k.goodWhenUp;
                return (
                  <div key={k.label} className="rounded-xl border border-zinc-200 bg-white p-5">
                    <p className="text-sm text-zinc-500">{k.label}</p>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <span className="text-2xl font-semibold tracking-tight tabular-nums">{k.value}</span>
                      <Sparkline data={k.spark} up={good} />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${good ? "text-teal-700" : "text-red-600"}`}>
                      {positive ? "▲" : "▼"} {Math.abs(k.delta)}%
                      <span className="font-normal text-zinc-400"> vs prev. period</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Chart row */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <section className="rounded-xl border border-zinc-200 bg-white p-5 xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-700">API requests</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-teal-700" /> requests
                  </span>
                </div>
                <AreaChart data={series} />
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-medium text-zinc-700">Top endpoints · 30d</h3>
                <EndpointBars items={endpoints} />
              </section>
            </div>

            {/* Deliveries table */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h3 className="text-sm font-medium text-zinc-700">Recent deliveries</h3>
                <span className="text-xs text-zinc-400">live</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-400">
                      <th className="px-5 py-2.5 font-medium">Message</th>
                      <th className="px-5 py-2.5 font-medium">Recipient</th>
                      <th className="px-5 py-2.5 font-medium">Endpoint</th>
                      <th className="px-5 py-2.5 font-medium">Status</th>
                      <th className="px-5 py-2.5 text-right font-medium">Latency</th>
                      <th className="px-5 py-2.5 text-right font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((d) => (
                      <tr key={d.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/60">
                        <td className="px-5 py-3 font-mono text-xs text-zinc-700">{d.id}</td>
                        <td className="px-5 py-3 text-zinc-600">{d.recipient}</td>
                        <td className="px-5 py-3 font-mono text-xs text-zinc-500">{d.endpoint}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLE[d.status]}`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-zinc-600">{d.latencyMs} ms</td>
                        <td className="px-5 py-3 text-right text-zinc-400">{d.ago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSection={(s) => {
            setSection(s);
            setPaletteOpen(false);
          }}
          onRange={(r) => {
            setRange(r);
            setPaletteOpen(false);
          }}
          onHome={() => router.push("/")}
        />
      )}
    </div>
  );
}

type Command = { id: string; label: string; hint: string; run: () => void };

function CommandPalette({
  onClose,
  onSection,
  onRange,
  onHome,
}: {
  onClose: () => void;
  onSection: (s: (typeof NAV)[number]) => void;
  onRange: (r: RangeKey) => void;
  onHome: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const commands: Command[] = useMemo(
    () => [
      ...NAV.map((s) => ({ id: `nav-${s}`, label: `Go to ${s}`, hint: "Section", run: () => onSection(s) })),
      { id: "r-24h", label: "Range: last 24 hours", hint: "View", run: () => onRange("24h") },
      { id: "r-7d", label: "Range: last 7 days", hint: "View", run: () => onRange("7d") },
      { id: "r-30d", label: "Range: last 30 days", hint: "View", run: () => onRange("30d") },
      { id: "home", label: "Back to portfolio", hint: "Navigate", run: onHome },
    ],
    [onSection, onRange, onHome],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/30 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Type a command…"
          className="w-full border-b border-zinc-100 px-4 py-3.5 text-sm outline-none placeholder:text-zinc-400"
        />
        <ul className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No matching commands</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                  i === active ? "bg-zinc-100 text-zinc-900" : "text-zinc-600"
                }`}
              >
                {c.label}
                <span className="text-xs text-zinc-400">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
