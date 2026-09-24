"use client";

import { useEffect } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

/**
 * Mounts the motion runtime on the homepage. Renders nothing.
 *
 * The runtime (and Anime.js) is a separate, lazily loaded chunk, so the
 * static page renders and becomes interactive without it. With
 * `prefers-reduced-motion: reduce` it is never loaded, and switching the
 * preference on mid-visit tears it down back to the static page.
 */
export function MotionRoot() {
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    let stop: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      if (query.matches || stop) return;
      import("@/motion/runtime").then(({ startMotion }) => {
        if (!cancelled && !query.matches && !stop) stop = startMotion();
      });
    };
    const halt = () => {
      stop?.();
      stop = undefined;
      document.documentElement.classList.remove("motion", "motion-live");
    };
    const onChange = () => (query.matches ? halt() : start());

    start();
    query.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
      halt();
    };
  }, []);

  return null;
}
