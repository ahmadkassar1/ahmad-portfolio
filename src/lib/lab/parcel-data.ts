import { mulberry32 } from "@/lib/prng";

/**
 * Seeded, deterministic data for the Helm dashboard (a fictional email +
 * webhooks API called "Parcel"). Everything is generated from a fixed seed
 * with no Date/Math.random, so the server and client render identically (no
 * hydration drift) and the demo looks the same on every load.
 */

export type RangeKey = "24h" | "7d" | "30d";

export type SeriesPoint = { label: string; requests: number; errors: number };

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Pure label for the Nth day of the window (no Date — keeps SSR stable). */
function dayLabel(i: number, startMonth = 4, startDay = 12): string {
  let day = startDay + i;
  let month = startMonth;
  const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  while (day > lengths[month]) {
    day -= lengths[month];
    month = (month + 1) % 12;
  }
  return `${MONTHS[month]} ${day}`;
}

/** Hour label "0:00".."23:00" for the 24h view. */
function hourLabel(i: number): string {
  return `${i.toString().padStart(2, "0")}:00`;
}

function round(n: number): number {
  return Math.round(n);
}

/**
 * Request volume series for a window. Baseline with a gentle upward trend,
 * weekly weekend dips (daily view) / nightly troughs (hourly view), and
 * seeded noise. Errors track a low, slightly bursty fraction.
 */
export function requestSeries(range: RangeKey): SeriesPoint[] {
  if (range === "24h") {
    const rand = mulberry32(0xc0ffee);
    return Array.from({ length: 24 }, (_, h) => {
      // Diurnal curve: quiet overnight, business-hours peak ~14:00.
      const diurnal = 0.45 + 0.55 * Math.sin(((h - 4) / 24) * Math.PI * 2 - Math.PI / 2);
      const base = 6800 + diurnal * 7200;
      const noise = (rand() - 0.5) * 900;
      const requests = round(Math.max(900, base + noise));
      const errors = round(requests * (0.004 + rand() * 0.006));
      return { label: hourLabel(h), requests, errors };
    });
  }

  const days = range === "7d" ? 7 : 30;
  const rand = mulberry32(range === "7d" ? 0x7f7f7f : 0x5eed42);
  return Array.from({ length: days }, (_, i) => {
    const trend = i * (range === "7d" ? 1100 : 1500);
    const weekend = i % 7 === 5 || i % 7 === 6 ? -42000 : 0;
    const base = 248000 + trend + weekend;
    const noise = (rand() - 0.5) * 26000;
    const requests = round(Math.max(60000, base + noise));
    const spike = rand() > 0.88 ? 1.8 : 1;
    const errors = round(requests * (0.005 + rand() * 0.004) * spike);
    return { label: dayLabel(i), requests, errors };
  });
}

export type Kpi = {
  label: string;
  value: string;
  /** Percent change vs the previous comparable window. */
  delta: number;
  /** Whether an increase is good (revenue) or bad (latency, errors). */
  goodWhenUp: boolean;
  spark: number[];
};

function spark(seed: number, n = 16, drift = 1): number[] {
  const rand = mulberry32(seed);
  let v = 50;
  return Array.from({ length: n }, () => {
    v += (rand() - 0.5) * 18 + drift;
    v = Math.max(8, Math.min(96, v));
    return round(v);
  });
}

export const kpis: Kpi[] = [
  { label: "Monthly recurring revenue", value: "$48,210", delta: 6.2, goodWhenUp: true, spark: spark(11, 16, 1.4) },
  { label: "Active projects", value: "1,284", delta: 3.1, goodWhenUp: true, spark: spark(22, 16, 0.7) },
  { label: "API requests · 30d", value: "8.42M", delta: 11.4, goodWhenUp: true, spark: spark(33, 16, 1.1) },
  { label: "Delivery rate", value: "99.2%", delta: -0.3, goodWhenUp: true, spark: spark(44, 16, -0.2) },
];

export type EndpointStat = { method: string; path: string; requests: number };

export const endpoints: EndpointStat[] = [
  { method: "POST", path: "/v1/messages", requests: 3_142_880 },
  { method: "POST", path: "/v1/batch", requests: 1_806_240 },
  { method: "GET", path: "/v1/messages/:id", requests: 1_233_510 },
  { method: "POST", path: "/v1/webhooks", requests: 818_960 },
  { method: "GET", path: "/v1/domains", requests: 412_300 },
];

export type DeliveryStatus = "delivered" | "deferred" | "bounced" | "failed";

export type Delivery = {
  id: string;
  endpoint: string;
  recipient: string;
  status: DeliveryStatus;
  latencyMs: number;
  ago: string;
};

export const deliveries: Delivery[] = [
  { id: "msg_8fK2qa", endpoint: "POST /v1/messages", recipient: "noah@northwind.io", status: "delivered", latencyMs: 214, ago: "just now" },
  { id: "msg_3pLm7x", endpoint: "POST /v1/batch", recipient: "billing@acme.co", status: "delivered", latencyMs: 188, ago: "1m ago" },
  { id: "msg_Zr0c9d", endpoint: "POST /v1/messages", recipient: "ops@lumen.dev", status: "deferred", latencyMs: 902, ago: "2m ago" },
  { id: "msg_Q1Wvb4", endpoint: "POST /v1/messages", recipient: "hi@parcelhq.com", status: "delivered", latencyMs: 173, ago: "4m ago" },
  { id: "msg_7Ht2nm", endpoint: "POST /v1/batch", recipient: "team@formwork.app", status: "bounced", latencyMs: 341, ago: "6m ago" },
  { id: "msg_Kd8s1q", endpoint: "POST /v1/messages", recipient: "alerts@meridian.sh", status: "delivered", latencyMs: 205, ago: "9m ago" },
  { id: "msg_Lp4z6e", endpoint: "POST /v1/webhooks", recipient: "svc-hook-04", status: "failed", latencyMs: 1480, ago: "11m ago" },
  { id: "msg_Vn9b2w", endpoint: "POST /v1/messages", recipient: "support@harbor.io", status: "delivered", latencyMs: 196, ago: "13m ago" },
];

/** Compact number formatter — 3_142_880 → "3.14M". */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
