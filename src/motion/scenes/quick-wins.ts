import { $, $$, ease, playTimeline, shown, wipe } from "../helpers";
import type { Scene } from "../types";

/**
 * FAST TRANSFORMATIONS. Not scrubbed: each row fires once, quickly
 * (~0.4s), as it comes into view — old process is already there, the
 * intervention's connector snaps across, the new process lands. The pace
 * change against the flagship scenes is the point.
 */
export const quickWins: Scene = ({ root, controller }) => {
  for (const row of $$(root, "[data-quick-win]")) {
    const tl = playTimeline();
    const before = $$(row, "[data-before]").find(shown);
    const after = $$(row, "[data-after]").find(shown);
    const via = $$(row, "[data-via]").find(shown);
    const line = via && $(via, "[data-via-line]");

    if (before) tl.add(before, { opacity: [0.35, 1], duration: 120 }, 0);
    if (via) tl.add(line ? $$(via, ":scope > p") : via, { opacity: [0, 1], duration: 140 }, 70);
    if (line) tl.add(line, { scaleX: [0, 1], duration: 200, ease: ease.snap }, 90);
    if (after) tl.add(after, { ...wipe, duration: 180, ease: ease.settle }, 250);

    controller.trigger(tl, row, 0.86);
  }
};
