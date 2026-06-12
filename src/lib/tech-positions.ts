import * as THREE from "three";

/**
 * Live world positions of the orbiting tech objects, written by the
 * constellation every frame and read by the camera rig when a tech is
 * focused. A plain module-level map (not React state) because these
 * change 60×/second and must never trigger renders.
 */
export const techWorldPositions = new Map<string, THREE.Vector3>();

export function getTechPosition(id: string): THREE.Vector3 | undefined {
  return techWorldPositions.get(id);
}
