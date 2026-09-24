"use client";

import { useCallback, useRef, useState } from "react";
import { useDemoMotion } from "./use-demo-motion";

/**
 * Stage state for a pipeline demo. `reached` is the latest stage the run
 * has got to (-1 = not started). With motion, the copper signal walks the
 * pipeline and advances `reached` as it arrives at each stage; with
 * reduced motion the run completes immediately.
 */
export function usePipelineRun({
  stages,
  dwell,
}: {
  stages: number;
  dwell?: number | ((stage: number) => number);
}) {
  const [reached, setReached] = useState(-1);
  const [running, setRunning] = useState(false);
  const track = useRef<HTMLOListElement>(null);
  const motion = useDemoMotion();
  const runId = useRef(0);
  const last = stages - 1;

  const start = useCallback(async () => {
    const id = ++runId.current;
    const m = await motion.load();
    if (id !== runId.current) return; // reset while loading
    const el = track.current;
    const signal = el?.querySelector<HTMLElement>("[data-signal]");
    if (!m || !el || !signal) {
      setReached(last);
      return;
    }
    setRunning(true);
    m.runPipeline({
      track: el,
      signal,
      nodes: Array.from(el.querySelectorAll<HTMLElement>("[data-stage-node]")),
      onStage: setReached,
      onDone: () => setRunning(false),
      dwell,
    });
  }, [dwell, last, motion]);

  const reset = useCallback(() => {
    runId.current++;
    motion.stop();
    setRunning(false);
    setReached(-1);
  }, [motion]);

  return {
    reached,
    running,
    started: reached >= 0 || running,
    complete: reached === last && !running,
    track,
    start,
    reset,
  };
}
