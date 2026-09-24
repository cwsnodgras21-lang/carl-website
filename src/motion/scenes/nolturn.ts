import { $, $$, ease, playTimeline } from "../helpers";
import type { Scene } from "../types";

/**
 * NOLTURN INVENTORY — calm, on purpose. This is an owned product; the real
 * screenshot will carry the weight once it exists, so the placeholder is
 * never animated. The only motion: the capability structure's rules draw
 * in once, quickly, as the list arrives.
 */
export const nolturn: Scene = ({ root, controller }) => {
  const list = $(root, "[data-capabilities]");
  if (!list) return;
  const tl = playTimeline();
  $$(list, "li").forEach((li, i) => {
    const line = $(li, "[data-cap-line]");
    if (line) tl.add(line, { scaleX: [0, 1], duration: 260, ease: ease.settle }, i * 45);
  });
  controller.trigger(tl, list, 0.85);
};
