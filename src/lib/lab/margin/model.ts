/**
 * Margin Lab — the pricing engine. The hard part makers get wrong is that
 * marketplace fees are a PERCENT OF THE FINAL PRICE, which depends on the
 * fee — a circular dependency. We solve it in closed form:
 *
 *   profit = price − cost − (flat + perTxn + pct·price)   (target: profit = margin·price)
 *   ⇒ price·(1 − pct − margin) = cost + flat + perTxn
 *   ⇒ price = (cost + flat + perTxn) / (1 − pct − margin)
 *
 * Pure functions, no I/O — everything runs client-side.
 */

export type Component = { id: string; name: string; qty: number; unitCost: number };
export type Channel = {
  id: string;
  name: string;
  /** Percent of final price, e.g. 6.5. */
  pctFee: number;
  flatFee: number;
  perTxnFee: number;
};

export type Product = {
  name: string;
  components: Component[];
  laborMinutes: number;
  laborRate: number; // per hour
  overhead: number; // per unit
  fixedCosts: number; // monthly, for break-even
  targetMargin: number; // percent of price
  channels: Channel[];
};

export type ChannelResult = {
  id: string;
  name: string;
  reachable: boolean;
  price: number;
  feeTotal: number;
  profitPerUnit: number;
  marginPct: number;
  breakEvenUnits: number | null;
};

export type Pricing = { unitCost: number; materialCost: number; laborCost: number; channels: ChannelResult[] };

export function unitCostOf(p: Product, materialMultiplier = 1): number {
  const material = p.components.reduce((s, c) => s + c.qty * c.unitCost, 0) * materialMultiplier;
  const labor = (p.laborMinutes / 60) * p.laborRate;
  return material + labor + p.overhead;
}

export function computePricing(p: Product, materialMultiplier = 1): Pricing {
  const material = p.components.reduce((s, c) => s + c.qty * c.unitCost, 0) * materialMultiplier;
  const labor = (p.laborMinutes / 60) * p.laborRate;
  const unitCost = material + labor + p.overhead;
  const m = p.targetMargin / 100;

  const channels = p.channels.map((ch): ChannelResult => {
    const pct = ch.pctFee / 100;
    const denom = 1 - pct - m;
    const reachable = denom > 0.01;
    const price = reachable ? (unitCost + ch.flatFee + ch.perTxnFee) / denom : Infinity;
    const feeTotal = reachable ? ch.flatFee + ch.perTxnFee + price * pct : 0;
    const profitPerUnit = reachable ? price - unitCost - feeTotal : 0;
    const marginPct = reachable && price > 0 ? (profitPerUnit / price) * 100 : 0;
    const breakEvenUnits =
      reachable && profitPerUnit > 0 && p.fixedCosts > 0 ? Math.ceil(p.fixedCosts / profitPerUnit) : null;
    return { id: ch.id, name: ch.name, reachable, price, feeTotal, profitPerUnit, marginPct, breakEvenUnits };
  });

  return { unitCost, materialCost: material, laborCost: labor, channels };
}

export const money = (n: number) =>
  n === Infinity || Number.isNaN(n) ? "—" : `$${n.toFixed(2)}`;

export const DEFAULT_PRODUCT: Product = {
  name: "Cedar & Sage soy candle",
  components: [
    { id: "c1", name: "Soy wax (240g)", qty: 1, unitCost: 1.85 },
    { id: "c2", name: "Cotton wick + sustainer", qty: 1, unitCost: 0.18 },
    { id: "c3", name: "Fragrance oil (15ml)", qty: 1, unitCost: 1.4 },
    { id: "c4", name: "Amber glass jar, 8oz", qty: 1, unitCost: 2.1 },
    { id: "c5", name: "Label + gift box", qty: 1, unitCost: 0.65 },
  ],
  laborMinutes: 12,
  laborRate: 18,
  overhead: 0.4,
  fixedCosts: 450,
  targetMargin: 40,
  channels: [
    { id: "etsy", name: "Etsy", pctFee: 6.5, flatFee: 0.2, perTxnFee: 0.3 },
    { id: "shopify", name: "Shopify", pctFee: 2.9, flatFee: 0, perTxnFee: 0.3 },
    { id: "wholesale", name: "Wholesale", pctFee: 0, flatFee: 0, perTxnFee: 0 },
    { id: "market", name: "Farmers market", pctFee: 0, flatFee: 0, perTxnFee: 0 },
  ],
};

export function encodeProduct(p: Product): string {
  return btoa(encodeURIComponent(JSON.stringify(p)));
}
const fnum = (v: unknown, d: number) => (Number.isFinite(Number(v)) ? Number(v) : d);

export function decodeProduct(s: string): Product | null {
  // #p= hash is untrusted: coerce every numeric so a crafted payload can't
  // feed NaN into the pricing math, and require at least one channel.
  try {
    const obj: unknown = JSON.parse(decodeURIComponent(atob(s)));
    if (!obj || typeof obj !== "object") return null;
    const o = obj as Record<string, unknown>;
    if (!Array.isArray(o.components) || !Array.isArray(o.channels) || o.channels.length === 0) return null;
    const components: Component[] = o.components.map((c, i) => {
      const r = (c ?? {}) as Record<string, unknown>;
      return {
        id: typeof r.id === "string" ? r.id : `c${i}`,
        name: typeof r.name === "string" ? r.name : "Item",
        qty: fnum(r.qty, 1),
        unitCost: fnum(r.unitCost, 0),
      };
    });
    const channels: Channel[] = o.channels.map((c, i) => {
      const r = (c ?? {}) as Record<string, unknown>;
      return {
        id: typeof r.id === "string" ? r.id : `ch${i}`,
        name: typeof r.name === "string" ? r.name : "Channel",
        pctFee: fnum(r.pctFee, 0),
        flatFee: fnum(r.flatFee, 0),
        perTxnFee: fnum(r.perTxnFee, 0),
      };
    });
    return {
      name: typeof o.name === "string" ? o.name : "Product",
      components,
      channels,
      laborMinutes: fnum(o.laborMinutes, 0),
      laborRate: fnum(o.laborRate, 0),
      overhead: fnum(o.overhead, 0),
      fixedCosts: fnum(o.fixedCosts, 0),
      targetMargin: fnum(o.targetMargin, 0),
    };
  } catch {
    return null;
  }
}
