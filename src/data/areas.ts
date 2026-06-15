/**
 * The two physical areas of the deck that aren't project stations:
 * the About desk (far side, behind the core from the home camera) and
 * the Contact terminal (right side). Both sit in the gaps of the
 * station ring so nothing overlaps a pedestal or the view corridor.
 */
export const aboutArea = {
  /** Angle π — the left wing of the deck. */
  position: [-7.0, 0, 0] as [number, number, number],
  rotation: Math.PI / 2,
  cameraPosition: [-4.0, 1.9, 0] as [number, number, number],
  cameraTarget: [-7.0, 1.2, 0] as [number, number, number],
};

export const contactArea = {
  /** Angle 0 — the right wing of the deck. */
  position: [7.0, 0, 0] as [number, number, number],
  rotation: -Math.PI / 2,
  cameraPosition: [4.0, 1.9, 0] as [number, number, number],
  cameraTarget: [7.0, 1.35, 0] as [number, number, number],
};

export const labArea = {
  /** A raised pod floating in the front gap between the two near stations. */
  position: [0, 2.0, 5.6] as [number, number, number],
  rotation: 0,
  cameraPosition: [0, 2.2, 8.5] as [number, number, number],
  cameraTarget: [0, 2.0, 5.6] as [number, number, number],
};
