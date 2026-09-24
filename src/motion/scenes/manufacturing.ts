import { $, $$, ease, scrubTimeline, setTemp, shown, token, undimmed } from "../helpers";
import type { Scene } from "../types";

/**
 * FLOW — work moving through an operation. Scrubbed, one traversal.
 *
 * The copper part physically travels the line (along the band on desktop,
 * down it on phones). Each station's gate energises as the part reaches it
 * and relaxes once it has passed; its label stays lit, so the whole
 * process remains readable behind the part. Direction marks light as they
 * are passed. No fill follows the part — this is a line, not a progress bar.
 */
export const manufacturing: Scene = ({ root, controller }) => {
  const flow = $(root, "[data-flow]");
  const layout = flow && $$(flow, ":scope > div").find(shown);
  if (!layout) return;
  const part = $(layout, "[data-part]");
  const stations = $$(layout, "[data-station]");
  if (!part || !stations.length) return;

  const vertical = !layout.classList.contains("hidden");
  // The part rides over the station gates, not behind them.
  setTemp(part, { zIndex: "2" });
  const accent = token("accent");
  const technical = token("technical");

  // Positions are read once here (build) — never during scroll.
  const partBox = part.getBoundingClientRect();
  const axis = (r: DOMRect) => (vertical ? r.top + r.height / 2 : r.left + r.width / 2);
  const origin = axis(partBox);
  const gates = stations.map((s) => $(s, vertical ? ":scope > span[aria-hidden]" : ":scope > span:last-child")!);
  const stops = gates.map((g) => axis(g.getBoundingClientRect()) - origin);
  const track = part.parentElement!.getBoundingClientRect();
  const end = (vertical ? track.bottom - 18 : track.right - 22) - (vertical ? partBox.top : partBox.left) - (vertical ? partBox.height : partBox.width);

  const tl = scrubTimeline();
  const prop = vertical ? "translateY" : "translateX";
  const move = (to: number): Record<string, number> => ({ [prop]: to });
  const T0 = 60;
  const leg = 820 / stations.length;

  let at = T0;
  stops.forEach((stop, i) => {
    const arrive = T0 + leg * (i + 0.5);
    tl.add(part, { ...move(stop), duration: arrive - at, ease: "inOutSine" }, at);
    at = arrive;
    const gate = gates[i];
    const labels = $$(stations[i], ":scope > span:not([aria-hidden])");
    const core = gate.classList.contains("border-accent");
    tl.add(labels, { opacity: [0.3, 1], duration: 30 }, arrive - 20);
    // Gates stay opaque (they sit over the band); they dim by colour.
    const inner = $(gate, ":scope > span");
    if (inner) tl.add(inner, { ...undimmed(inner, ["backgroundColor"]), duration: 30 }, arrive - 20);
    if (core) tl.add(gate, { ...undimmed(gate, ["borderColor"]), duration: 30 }, arrive - 20);
    else {
      tl.add(gate, { borderColor: [token("border"), accent], duration: 20 }, arrive - 15);
      tl.add(gate, { borderColor: [accent, technical], duration: 60 }, arrive + leg * 0.35);
    }
  });
  tl.add(part, { ...move(end), duration: 1000 - 40 - at, ease: ease.settle }, at);

  const marks = $$(layout, "[data-direction]");
  marks.forEach((mark, i) => {
    tl.add(mark, { opacity: [0.2, 1], duration: 30 }, T0 + leg * (i + 1) - 10);
  });

  controller.scrub(tl, { el: layout, start: 0.78, end: vertical ? 0.1 : 0.3 });
};
