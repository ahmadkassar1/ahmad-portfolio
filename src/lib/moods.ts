/**
 * Station moods — one functional tint per project station, drawn from the
 * Cobalt Ledger data-ink palette so the world and the ledger share a
 * vocabulary. Used by lights, emissive trims, holo props, and HUD chips.
 */
export type MoodKey = "cobalt" | "amber" | "sage" | "coral";

export type Mood = {
  key: MoodKey;
  /** Primary emissive / light color. */
  color: string;
  /** Brighter variant for hover states and bloom-catching trims. */
  bright: string;
  /** Dimmed variant for idle glows and texture accents. */
  dim: string;
};

export const moods: Record<MoodKey, Mood> = {
  cobalt: { key: "cobalt", color: "#4d7cff", bright: "#7396ff", dim: "#22345f" },
  amber: { key: "amber", color: "#c9a35c", bright: "#e8c47e", dim: "#4f4126" },
  sage: { key: "sage", color: "#6fae8a", bright: "#92d1ac", dim: "#2c4536" },
  coral: { key: "coral", color: "#c9786b", bright: "#e89a8d", dim: "#4f2f2a" },
};

/** World-level constants shared across components. */
export const worldPalette = {
  ground: "#0b0d12",
  fog: "#0b0d12",
  panel: "#14161c",
  line: "#2a2925",
  ink: "#f2f0ea",
  inkSoft: "#a8a59a",
  accent: "#4d7cff",
  accentBright: "#7396ff",
} as const;
