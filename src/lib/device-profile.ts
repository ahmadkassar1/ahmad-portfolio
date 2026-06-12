/**
 * Client-side device capability probe. Runs once on mount (never during
 * render, never on the server) and decides whether the visitor defaults
 * into the 3D world or stays on the server-rendered ledger.
 */
export type Quality = "high" | "medium" | "low";

export type DeviceProfile = {
  /** WebGL2 context could actually be created. */
  webglOk: boolean;
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
  isSmallViewport: boolean;
  quality: Quality;
  /** Capable enough that the world should be the default experience. */
  autoEnter: boolean;
};

export function probeDevice(): DeviceProfile {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isSmallViewport = window.innerWidth < 768;

  let webglOk = false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    webglOk = gl !== null;
    if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglOk = false;
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is Chrome-only and absent from lib.dom — feature-detect it.
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const dpr = window.devicePixelRatio ?? 1;

  let quality: Quality = "medium";
  if (cores >= 8 && memory >= 8 && !isCoarsePointer) quality = "high";
  else if (cores <= 4 || memory <= 2 || (isCoarsePointer && dpr > 2.5))
    quality = "low";

  return {
    webglOk,
    prefersReducedMotion,
    isCoarsePointer,
    isSmallViewport,
    quality,
    // Reduced-motion visitors and weak devices keep the ledger as the
    // default; the world stays one explicit opt-in away (the enter pill).
    autoEnter:
      webglOk && !prefersReducedMotion && !isSmallViewport && quality !== "low",
  };
}
