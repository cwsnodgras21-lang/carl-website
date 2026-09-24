import { $, $$, ease, scrubTimeline, shown } from "../helpers";
import type { Scene } from "../types";

/**
 * UNDERSTAND → VISUALIZE → BUILD → REFINE. Scrubbed, simple — by now the
 * visitor knows the language. A signal runs the line (the page rail itself
 * on phones) and each stage activates as it arrives. The principle below
 * ("Complexity has to earn its existence.") is deliberately left still.
 */
export const process: Scene = ({ root, controller }) => {
  const stages = $$(root, "[data-process-stage]");
  if (!stages.length) return;
  const list = stages[0].parentElement!;
  const signal = $(list, "[data-signal]");
  const content = (li: HTMLElement) => $$(li, ":scope > p, :scope > h3");

  if (shown(signal)) {
    const left = list.getBoundingClientRect().left;
    // Park just past each stage's node so the signal stays visible on the line.
    const stops = stages.map((li) => li.getBoundingClientRect().left - left + 30);
    const tl = scrubTimeline();
    const leg = 800 / stages.length;
    let at = 60;
    stops.forEach((x, i) => {
      const arrive = 60 + leg * (i + 0.3);
      tl.add(signal!, { translateX: x, duration: arrive - at, ease: "inOutSine" }, at);
      at = arrive;
      tl.add(content(stages[i]), { opacity: [0.25, 1], duration: 60, ease: ease.settle }, arrive - 10);
    });
    controller.scrub(tl, { el: list, start: 0.8, end: 0.4 });
    return;
  }

  for (const li of stages) {
    const tl = scrubTimeline();
    const node = $(li, "[data-rail-node]");
    if (node) tl.add(node, { scale: [0.3, 1], duration: 200, ease: ease.snap }, 0);
    tl.add(content(li), { opacity: [0.25, 1], duration: 500, ease: ease.settle }, 150);
    controller.scrub(tl, { el: li, start: 0.88, end: 0.62 });
  }
};
