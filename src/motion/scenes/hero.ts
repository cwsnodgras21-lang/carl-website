import { createTimeline } from "animejs";
import { $, ease } from "../helpers";
import type { Scene } from "../types";

/**
 * INITIALIZE — the system receives power.
 *
 * Origin node energises → the wire draws to its terminal while the headline
 * resolves behind the leading edge of the wire → supporting copy becomes
 * available → the wire turns down and becomes the page rail.
 *
 * Plays once on load (≈1.4s; content is readable after ≈1s). If the page
 * loads already scrolled past the hero, it renders the finished state.
 * Pre-paint states live in globals.css under `html.motion` so the static
 * version never flashes first.
 */
export const hero: Scene = ({ root, intro, own }) => {
  const origin = $(root, "[data-connection] [data-origin]");
  const wire = $(root, "[data-connection] [data-wire]");
  const terminal = $(root, "[data-connection] [data-terminal]");
  const drop = $(root, "[data-connection] [data-drop]");
  const title = $(root, "#hero-title");
  const reveal = $(root, "[data-hero-reveal]");
  if (!origin || !wire || !terminal || !drop || !title || !reveal) return;

  const tl = createTimeline({ autoplay: false })
    .add(origin, { scale: [0, 1], duration: 180, ease: ease.snap }, 0)
    .add(wire, { scaleX: [0, 1], duration: 650, ease: ease.draw }, 140)
    .add(
      title,
      {
        clipPath: ["inset(0% 100% -20% 0%)", "inset(0% 0% -20% 0%)"],
        duration: 620,
        ease: ease.draw,
      },
      190,
    )
    .add(terminal, { opacity: [0, 1], duration: 140, ease: "linear" }, 760)
    .add(reveal, { opacity: [0, 1], duration: 300, ease: ease.settle }, 800)
    .add(drop, { scaleY: [0, 1], duration: 700, ease: ease.draw }, 820);

  own(tl);
  if (intro) tl.play();
  else tl.seek(tl.duration);
};
