import type { MoodKey } from "@/lib/moods";

/**
 * Project stations — the four projects arranged around the holo core.
 * Positions are polar: stations sit on a ring of radius STATION_RADIUS,
 * facing inward. The camera focus point hovers in front of each station.
 */
export const STATION_RADIUS = 6.2;

export type Station = {
  /** Matches Project.vignette so the panel can find its project. */
  id: "pipeline" | "qr-menu" | "publishing" | "storefront";
  /** Index label, mirrors the ledger's 01–04. */
  index: string;
  /** Short name for HUD buttons and label plates. */
  shortName: string;
  /** Angle around the core, radians. */
  angle: number;
  mood: MoodKey;
};

export const stations: Station[] = [
  {
    id: "pipeline",
    index: "01",
    shortName: "CRM Pipeline",
    angle: Math.PI * 0.25,
    mood: "cobalt",
  },
  {
    id: "qr-menu",
    index: "02",
    shortName: "QR Ordering",
    angle: Math.PI * 0.75,
    mood: "amber",
  },
  {
    id: "publishing",
    index: "03",
    shortName: "Publishing",
    angle: Math.PI * 1.25,
    mood: "sage",
  },
  {
    id: "storefront",
    index: "04",
    shortName: "Storefront",
    angle: Math.PI * 1.75,
    mood: "coral",
  },
];

export function stationPosition(station: Station): [number, number, number] {
  return [
    Math.cos(station.angle) * STATION_RADIUS,
    0,
    Math.sin(station.angle) * STATION_RADIUS,
  ];
}

/** Where the camera parks when a station is focused: pulled toward the
 *  core from the station, slightly raised, looking at the station. */
export function stationCameraPosition(
  station: Station,
): [number, number, number] {
  const r = STATION_RADIUS - 3.9;
  return [Math.cos(station.angle) * r, 2.05, Math.sin(station.angle) * r];
}
