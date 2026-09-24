/**
 * Motion policy shared by every scene.
 *
 * Three levels, in order of how often they should appear:
 *   ambient     — barely-there line movement / node pulse. Never required.
 *   narrative   — scroll-controlled storytelling (path drawing, assembly).
 *   interactive — only in response to deliberate user input.
 *
 * With `prefers-reduced-motion: reduce`, ambient and narrative motion are
 * skipped entirely and diagrams render in their completed state. The static
 * markup IS the completed state, so animation code only ever enhances it.
 */

export type MotionLevel = "ambient" | "narrative" | "interactive";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Imperative check for animation setup code (client only). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Whether a given level of motion may run right now. */
export function motionAllowed(level: MotionLevel): boolean {
  if (level === "interactive") return true;
  return !prefersReducedMotion();
}

export const durations = {
  fast: 180,
  base: 420,
  slow: 900,
} as const;
