"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "./motion";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Live `prefers-reduced-motion` value. Defaults to `true` during server
 * rendering so nothing animates before we know the user's preference.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );
}
