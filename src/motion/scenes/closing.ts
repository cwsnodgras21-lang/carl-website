import { $, ease, scrubTimeline, token } from "../helpers";
import type { Scene } from "../types";

/**
 * RESOLUTION — completing the circuit. Scrubbed.
 *
 * The rail arrives back at the original connection. The wire draws to its
 * terminal, and this time the terminal closes: in the hero it was an open
 * circle (power available); here it fills (circuit complete). Then the
 * question and the ways to act on it. The headline itself doesn't move —
 * it was said at the start; this is where it lands.
 */
export const closing: Scene = ({ root, controller }) => {
  const connection = $(root, "[data-connection]");
  const wire = connection && $(connection, "[data-wire]");
  const terminal = connection && $(connection, "[data-terminal]");
  const origin = connection && $(connection, "[data-origin]");
  const reveal = $(root, "[data-closing-reveal]");
  if (!connection || !wire || !terminal || !origin || !reveal) return;

  const accent = token("accent");
  const tl = scrubTimeline()
    .add(origin, { scale: [0.4, 1], duration: 120, ease: ease.snap }, 0)
    .add(wire, { scaleX: [0, 1], duration: 520, ease: ease.draw }, 60)
    .add(terminal, { backgroundColor: [token("background"), accent], borderColor: [token("muted"), accent], duration: 80 }, 580)
    .add(reveal, { opacity: [0, 1], duration: 220, ease: ease.settle }, 700);

  controller.scrub(tl, { el: connection, start: 0.9, end: 0.45 });
};
