/**
 * Shared, non-reactive movement input for Walk mode. The on-screen
 * joystick (a DOM HUD element) writes here and WalkControls reads it every
 * frame — a plain module singleton so a thumbstick drag never triggers a
 * React re-render. x = strafe (right positive), y = forward (positive).
 * Both are clamped to [-1, 1].
 */
export const walkInput = { x: 0, y: 0 };

export function resetWalkInput() {
  walkInput.x = 0;
  walkInput.y = 0;
}
