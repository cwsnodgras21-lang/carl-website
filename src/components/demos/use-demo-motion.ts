"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { DemoMotion } from "@/motion/demos";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The demos' motion, loaded on first use. Resolves to `null` when the
 * visitor prefers reduced motion — callers then apply state immediately.
 * Everything in flight is undone on unmount.
 */
export function useDemoMotion() {
  const motion = useRef<DemoMotion | null>(null);

  const load = useCallback(async (): Promise<DemoMotion | null> => {
    if (prefersReducedMotion()) return null;
    if (!motion.current) {
      const { createDemoMotion } = await import("@/motion/demos");
      motion.current ??= createDemoMotion();
    }
    return motion.current;
  }, []);

  const stop = useCallback(() => motion.current?.stop(), []);

  useEffect(() => () => motion.current?.stop(), []);

  return useMemo(() => ({ load, stop }), [load, stop]);
}
